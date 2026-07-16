/**
 * HCD Phase1: ダウンロード画面(DownloadScreen)のレイアウトをビューポート幅違いで検証するスクリプト
 * Usage: node scripts/hcd-explore-download.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.HCD_BASE_URL ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), ".cursor", "hcd-artifacts");
const IDENTIFIER = "1073";
// 一般的なスマートフォンの幅の範囲を代表する2サイズで検証する
const VIEWPORTS = [
  { name: "narrow", width: 390, height: 844 },
  { name: "wide", width: 430, height: 932 },
];

async function captureForViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/search/detail/${IDENTIFIER}`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /をダウンロードする$/ }).first().click();
  await page.waitForURL(/\/download\//);
  await page.waitForTimeout(150);
  await page.screenshot({
    path: path.join(OUT, `download-screen-${viewport.name}.png`),
  });

  await context.close();
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "chrome" });

  for (const viewport of VIEWPORTS) {
    await captureForViewport(browser, viewport);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
