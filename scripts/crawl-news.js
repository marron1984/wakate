#!/usr/bin/env node
/**
 * WAKATE ニュースクローラー
 *
 * よしもと漫才劇場関連のニュースを複数ソースからクロールし、
 * src/data/news.json を更新する。
 *
 * 使い方:
 *   node scripts/crawl-news.js          # 全ソースからクロール
 *   node scripts/crawl-news.js --dry    # ドライラン（書き込みしない）
 *   node scripts/crawl-news.js --check  # 更新確認のみ
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

// --- パス定義 ---
const ROOT = path.resolve(__dirname, '..')
const NEWS_PATH = path.join(ROOT, 'src', 'data', 'news.json')
const CONFIG_PATH = path.join(__dirname, 'crawl-config.json')
const LOG_PATH = path.join(__dirname, 'crawl.log')
const SEEN_PATH = path.join(__dirname, '.seen-urls.json')

// --- 設定読み込み ---
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
const allKeywords = [
  ...config.keywords.primary,
  ...config.keywords.comedians,
  ...config.keywords.general,
]

// --- CLI フラグ ---
const DRY_RUN = process.argv.includes('--dry')
const CHECK_ONLY = process.argv.includes('--check')

// --- ログ ---
function log(msg) {
  const ts = new Date().toISOString()
  const line = `[${ts}] ${msg}`
  console.log(line)
  fs.appendFileSync(LOG_PATH, line + '\n')
}

// --- HTTP フェッチ (Node 標準のみ) ---
function fetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, {
      headers: {
        'User-Agent': config.crawl.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en;q=0.5',
        ...opts.headers,
      },
      timeout: 15000,
    }, (res) => {
      // リダイレクト追従
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirect = new URL(res.headers.location, url).href
        return fetch(redirect, opts).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        res.resume()
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${url}`)) })
  })
}

// --- HTML からテキスト抽出 (軽量パーサー) ---
function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/\s+/g, ' ')
    .trim()
}

// --- HTML からリンク＋タイトルを抽出 ---
function extractArticles(html, baseUrl) {
  const articles = []
  // <a> タグからリンクとテキストを抽出
  const linkRegex = /<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1]
    const text = stripHtml(match[2]).trim()
    if (!text || text.length < 5) continue

    let fullUrl
    try {
      fullUrl = new URL(href, baseUrl).href
    } catch {
      continue
    }

    articles.push({ url: fullUrl, title: text })
  }
  return articles
}

// --- 記事の周辺テキストから本文スニペットを抽出 ---
function extractSnippet(html, title) {
  // <meta description> を探す
  const metaMatch = html.match(/<meta\s[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta\s[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)
  if (metaMatch) return stripHtml(metaMatch[1]).slice(0, 200)

  // og:description
  const ogMatch = html.match(/<meta\s[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta\s[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i)
  if (ogMatch) return stripHtml(ogMatch[1]).slice(0, 200)

  // 本文テキストから最初の長い文を探す
  const plainText = stripHtml(html)
  const idx = plainText.indexOf(title)
  if (idx >= 0) {
    const after = plainText.slice(idx + title.length, idx + title.length + 300).trim()
    if (after.length > 20) return after.slice(0, 200)
  }

  return ''
}

// --- 記事の公開日を抽出 ---
function extractDate(html) {
  // JSON-LD
  const ldMatch = html.match(/"datePublished"\s*:\s*"([^"]+)"/)
  if (ldMatch) {
    const d = new Date(ldMatch[1])
    if (!isNaN(d)) return d.toISOString().slice(0, 10)
  }

  // <time datetime="">
  const timeMatch = html.match(/<time[^>]*datetime=["']([^"']+)["']/)
  if (timeMatch) {
    const d = new Date(timeMatch[1])
    if (!isNaN(d)) return d.toISOString().slice(0, 10)
  }

  // meta article:published_time
  const metaMatch = html.match(/<meta\s[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/)
  if (metaMatch) {
    const d = new Date(metaMatch[1])
    if (!isNaN(d)) return d.toISOString().slice(0, 10)
  }

  // 日本語日付パターン (2026年3月23日)
  const jpMatch = html.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (jpMatch) {
    return `${jpMatch[1]}-${jpMatch[2].padStart(2, '0')}-${jpMatch[3].padStart(2, '0')}`
  }

  return new Date().toISOString().slice(0, 10)
}

// --- キーワードフィルタ: 関連記事かどうか ---
function isRelevant(title, snippet) {
  const text = (title + ' ' + snippet).toLowerCase()
  return allKeywords.some(kw => text.includes(kw.toLowerCase()))
}

// --- 芸人マッチング ---
function matchComedian(title, snippet) {
  const comedians = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src', 'data', 'comedians.json'), 'utf-8')
  )
  const text = title + ' ' + snippet
  for (const c of comedians) {
    if (text.includes(c.name)) return c.id
    for (const m of c.members) {
      if (text.includes(m)) return c.id
    }
  }
  return null
}

// --- カテゴリ自動判定 ---
function classifyCategory(title, snippet) {
  const text = title + ' ' + snippet
  const cats = config.categories
  let best = null
  let bestScore = 0
  for (const [cat, keywords] of Object.entries(cats)) {
    const score = keywords.filter(kw => text.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      best = cat
    }
  }
  return best || 'ニュース'
}

// --- 既読 URL 管理 ---
function loadSeenUrls() {
  try {
    return new Set(JSON.parse(fs.readFileSync(SEEN_PATH, 'utf-8')))
  } catch {
    return new Set()
  }
}

function saveSeenUrls(urls) {
  fs.writeFileSync(SEEN_PATH, JSON.stringify([...urls], null, 2))
}

// --- 重複チェック (タイトル類似度) ---
function isSimilarTitle(a, b) {
  const na = a.replace(/[\s\u3000【】「」『』]/g, '')
  const nb = b.replace(/[\s\u3000【】「」『』]/g, '')
  if (na === nb) return true
  // 部分一致 (70%以上の文字が共通)
  const shorter = na.length < nb.length ? na : nb
  const longer = na.length < nb.length ? nb : na
  let matches = 0
  for (const ch of shorter) {
    if (longer.includes(ch)) matches++
  }
  return matches / shorter.length > 0.7
}

// --- ソース1件をクロール ---
async function crawlSource(source) {
  log(`  クロール開始: ${source.name} (${source.url})`)
  const articles = []

  try {
    const html = await fetch(source.url)
    const links = extractArticles(html, source.url)
    log(`    ${links.length} 件のリンクを検出`)

    // キーワードに合致するリンクだけ取得
    const relevant = links.filter(l => isRelevant(l.title, ''))
    log(`    ${relevant.length} 件がキーワード一致`)

    // 各記事の詳細ページを取得 (最大 maxArticlesPerSource 件)
    const toFetch = relevant.slice(0, config.crawl.maxArticlesPerSource)
    for (const link of toFetch) {
      try {
        const articleHtml = await fetch(link.url)
        const snippet = extractSnippet(articleHtml, link.title)
        const date = extractDate(articleHtml)

        // キーワード再チェック（本文込みで）
        if (!isRelevant(link.title, snippet)) continue

        articles.push({
          title: link.title,
          url: link.url,
          date,
          summary: snippet,
          source: source.id,
          comedianId: matchComedian(link.title, snippet),
          category: classifyCategory(link.title, snippet),
        })
      } catch (err) {
        log(`    記事取得失敗: ${link.url} - ${err.message}`)
      }

      // レート制限: 1秒待つ
      await new Promise(r => setTimeout(r, 1000))
    }
  } catch (err) {
    log(`  ソース取得失敗: ${source.name} - ${err.message}`)
  }

  log(`  ${source.name}: ${articles.length} 件の記事を取得`)
  return articles
}

// --- メイン ---
async function main() {
  log('=== WAKATE ニュースクローラー 開始 ===')
  if (DRY_RUN) log('(ドライランモード)')
  if (CHECK_ONLY) log('(更新確認モード)')

  // 既存ニュース読み込み
  const existingNews = JSON.parse(fs.readFileSync(NEWS_PATH, 'utf-8'))
  const seenUrls = loadSeenUrls()
  const maxId = Math.max(...existingNews.map(n => n.id), 0)

  log(`既存ニュース: ${existingNews.length} 件 / 既読URL: ${seenUrls.size} 件`)

  // 全ソースをクロール
  const enabledSources = config.sources.filter(s => s.enabled)
  const allArticles = []

  for (const source of enabledSources) {
    const articles = await crawlSource(source)
    allArticles.push(...articles)
  }

  log(`\n全ソースから ${allArticles.length} 件の候補記事を取得`)

  // 重複除去: 既読URL, 既存タイトル類似
  const newArticles = []
  for (const article of allArticles) {
    // URL 既読チェック
    if (seenUrls.has(article.url)) continue

    // 既存ニュースとのタイトル類似チェック
    const isDupe = existingNews.some(n => isSimilarTitle(n.title, article.title))
      || newArticles.some(n => isSimilarTitle(n.title, article.title))
    if (isDupe) continue

    newArticles.push(article)
    seenUrls.add(article.url)
  }

  log(`新規記事: ${newArticles.length} 件`)

  if (CHECK_ONLY) {
    if (newArticles.length > 0) {
      log('\n--- 新規記事一覧 ---')
      newArticles.forEach(a => log(`  [${a.date}] ${a.title}`))
    } else {
      log('新規記事はありません')
    }
    log('=== 更新確認完了 ===')
    return
  }

  if (newArticles.length === 0) {
    log('更新なし。終了します。')
    saveSeenUrls(seenUrls)
    log('=== クロール完了 ===')
    return
  }

  // 新規記事を news.json の形式に変換
  const newsEntries = newArticles.map((a, i) => ({
    id: maxId + i + 1,
    title: a.title,
    date: a.date,
    category: a.category,
    summary: a.summary || a.title,
    comedianId: a.comedianId,
    event: null,
    _source: a.source,
    _url: a.url,
  }))

  if (DRY_RUN) {
    log('\n--- ドライラン: 追加予定の記事 ---')
    newsEntries.forEach(e => log(`  [${e.date}] ${e.title} (${e.category})`))
    log('=== ドライラン完了 ===')
    return
  }

  // news.json に追加 (先頭に新しい記事を追加)
  const updatedNews = [...newsEntries, ...existingNews]

  // 最大件数を超えたら古い記事を削除
  if (updatedNews.length > config.crawl.maxTotalArticles) {
    updatedNews.length = config.crawl.maxTotalArticles
  }

  fs.writeFileSync(NEWS_PATH, JSON.stringify(updatedNews, null, 2) + '\n')
  saveSeenUrls(seenUrls)

  log(`news.json 更新完了: ${newsEntries.length} 件追加 → 合計 ${updatedNews.length} 件`)
  log('=== クロール完了 ===')
}

main().catch(err => {
  log(`致命的エラー: ${err.message}`)
  process.exit(1)
})
