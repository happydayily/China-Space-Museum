import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDirectory = join(projectRoot, 'docs', 'screenshots', 'review', 'latest')
const port = Number(process.env.REVIEW_SCREENSHOT_PORT || 4173)
const baseUrl = `http://127.0.0.1:${port}`
const outputFiles = [
  '01-home.png',
  '02-launch.png',
  '03-satellite.png',
  '04-human.png',
  '05-lunar.png',
  '06-planetary.png',
]

const browserCandidates = [
  process.env.REVIEW_BROWSER_PATH,
  process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Microsoft', 'Edge', 'Application', 'msedge.exe') : '',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean)

function readJson(fileName) {
  return JSON.parse(readFileSync(join(projectRoot, 'src', 'data', fileName), 'utf8'))
}

function findBrowser() {
  const browserPath = browserCandidates.find((candidate) => existsSync(candidate))
  if (!browserPath) throw new Error('未找到可复用的 Edge/Chrome 浏览器，请设置 REVIEW_BROWSER_PATH。')
  return browserPath
}

async function isServerReady() {
  try {
    const response = await fetch(baseUrl)
    return response.ok
  } catch {
    return false
  }
}

function startServer() {
  const command = existsSync(join(projectRoot, 'dist', 'index.html')) ? 'preview' : 'dev'
  const viteBin = join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js')
  const child = spawn(process.execPath, [viteBin, command, '--host', '127.0.0.1', '--port', String(port)], {
    cwd: projectRoot,
    stdio: 'inherit',
    windowsHide: true,
  })
  return child
}

async function waitForServer(child) {
  const deadline = Date.now() + 30000
  while (Date.now() < deadline) {
    if (await isServerReady()) return
    if (child.exitCode !== null) throw new Error(`Vite ${child.spawnargs?.[2] || 'server'} 提前退出，退出码 ${child.exitCode}`)
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 300))
  }
  throw new Error(`等待 ${baseUrl} 超时。`)
}

async function waitForStablePage(page) {
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {})
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((image) => {
      image.loading = 'eager'
      image.removeAttribute('loading')
    })
    window.scrollTo(0, document.documentElement.scrollHeight)
    window.scrollTo(0, 0)
  })
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready
    await Promise.race([
      Promise.all([...document.images].map((image) => image.complete
        ? Promise.resolve()
        : new Promise((resolvePromise) => {
          image.addEventListener('load', resolvePromise, { once: true })
          image.addEventListener('error', resolvePromise, { once: true })
        }))),
      new Promise((resolvePromise) => setTimeout(resolvePromise, 8000)),
    ])
  })
  await page.addStyleTag({ content: `
    *, *::before, *::after { animation-play-state: paused !important; transition: none !important; }
  ` })
  await page.waitForTimeout(900)
}

function stopServer(server) {
  if (!server) return
  server.kill()
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const bodyText = document.body?.innerText || ''
    const failedImages = [...document.images]
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.alt || image.src || '未命名图片')
    const errorOverlay = document.querySelector('vite-error-overlay, [data-vite-dev-id]')
    const errorText = /Cannot GET|Internal Server Error|404 Not Found|Failed to fetch|\[plugin:vite\]/i.test(bodyText)
    return {
      failedImages,
      hasErrorOverlay: Boolean(errorOverlay),
      hasErrorText: errorText,
    }
  })
}

async function capturePage(page, name, route, outputPath) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' })
  await waitForStablePage(page)
  const inspection = await inspectPage(page)
  if (inspection.hasErrorOverlay || inspection.hasErrorText) throw new Error('检测到浏览器错误页或 Vite 错误覆盖层。')
  if (inspection.failedImages.length) throw new Error(`图片加载失败：${inspection.failedImages.join('、')}`)
  await page.screenshot({ path: outputPath, fullPage: true, type: 'png' })
  const size = statSync(outputPath).size
  if (!size) throw new Error('截图文件大小为 0。')
  console.log(`✓ ${name} -> ${outputPath} (${size} bytes)`)
}

async function main() {
  mkdirSync(outputDirectory, { recursive: true })
  for (const fileName of outputFiles) rmSync(join(outputDirectory, fileName), { force: true })

  const grandHalls = readJson('grandHalls.json').sort((a, b) => String(a.index).localeCompare(String(b.index), 'zh-CN'))
  if (grandHalls.length !== 5) throw new Error(`grandHalls.json 当前读取到 ${grandHalls.length} 个展厅，预期 5 个。`)

  const pages = [
    ['首页', '/', '01-home.png'],
    ...grandHalls.map((hall, index) => [hall.name, `/#grand-hall/${encodeURIComponent(hall.id)}`, outputFiles[index + 1]]),
  ]
  const browserPath = findBrowser()
  const existingServer = await isServerReady()
  const server = existingServer ? null : startServer()
  const failures = []
  let browser

  try {
    if (server) await waitForServer(server)
    browser = await chromium.launch({ headless: true, executablePath: browserPath })
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 })
    for (const [name, route, fileName] of pages) {
      try {
        await capturePage(page, name, route, join(outputDirectory, fileName))
      } catch (error) {
        failures.push(`${name}: ${error.message}`)
        console.error(`✗ ${name}: ${error.message}`)
      }
    }
  } finally {
    await browser?.close()
    stopServer(server)
    if (server) await new Promise((resolvePromise) => setTimeout(resolvePromise, 250))
  }

  const missing = outputFiles.filter((fileName) => !existsSync(join(outputDirectory, fileName)) || statSync(join(outputDirectory, fileName)).size === 0)
  if (missing.length || failures.length) {
    if (missing.length) console.error(`缺少截图：${missing.join('、')}`)
    process.exitCode = 1
    return
  }
  console.log(`自动验收截图完成：${outputFiles.length} 张，视口 1600×900，fullPage PNG。`)
}

main().catch((error) => {
  console.error(`截图流程失败：${error.message}`)
  process.exitCode = 1
})
