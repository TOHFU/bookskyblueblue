/**
 * HCD Phase1: TOP詳細画面(TopDetailScreen)の表示を検証する一時スクリプト
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.HCD_BASE_URL ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), ".cursor", "hcd-artifacts");
const IDENTIFIER = "1046";

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/search/detail/${IDENTIFIER}`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /をダウンロードする$/ }).first().click();
  await page.waitForURL(/\/download\//);
  await page.waitForURL(/\/book\//, { timeout: 20000 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /の詳細を見る$/ }).first().click();
  await page.waitForURL(/\/book\/detail\//);
  await page.screenshot({ path: path.join(OUT, "topdetail-screen.png") });

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
