/**
 * HCD Phase1: 読書画面(BookScreen)の閲覧体験を検証するブラウザ探索スクリプト
 * 「作品詳細 → ダウンロード → TOP → 保存済み作品の詳細 → 本文を読む(クライアント遷移)」
 * という再訪問時の実際の操作を再現し、読書画面表示直後の状態をスクリーンショットで確認する。
 * Usage: node scripts/hcd-explore-book.mjs
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

  // 事前ダウンロード
  await page.goto(`${BASE}/search/detail/${IDENTIFIER}`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /をダウンロードする$/ }).first().click();
  await page.waitForURL(/\/download\//);
  await page.waitForURL(/\/book\//, { timeout: 20000 });
  await page.waitForTimeout(500);

  // TOPへ戻り、保存済み作品の詳細 →「本文を読む」でクライアント遷移により読書画面を開く
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /の詳細を見る$/ }).first().click();
  await page.waitForURL(/\/book\/detail\//);
  await page.getByRole("button", { name: "本文を読む" }).waitFor();
  await page.getByRole("button", { name: "本文を読む" }).click();
  await page.waitForURL(
    (url) => new URL(url).pathname.startsWith("/book/") && !new URL(url).pathname.includes("/detail/")
  );

  // 表示直後の数フレームを連続キャプチャし、フェードイン等による表示崩れがないか確認する
  for (let i = 0; i < 6; i++) {
    await page.screenshot({ path: path.join(OUT, `book-clientnav-${i}.png`) });
    await page.waitForTimeout(30);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
