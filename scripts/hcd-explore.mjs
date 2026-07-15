/**
 * HCD Phase1: 利用状況把握用ブラウザ探索スクリプト
 * Usage: node scripts/hcd-explore.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.HCD_BASE_URL ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), ".cursor", "hcd-artifacts");
const QUERY = "夏目漱石";

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  const apiTimings = [];
  page.on("response", async (response) => {
    const url = response.url();
    if (!url.includes("/api/")) return;
    const timing = response.request().timing();
    apiTimings.push({
      url,
      status: response.status(),
      // responseEnd can be -1 if not available
      responseEnd: timing.responseEnd,
      requestStart: timing.requestStart,
    });
  });

  const report = {
    base: BASE,
    startedAt: new Date().toISOString(),
    steps: [],
    apiTimings,
    performance: {},
    issues: [],
  };

  async function step(name, fn) {
    const t0 = Date.now();
    try {
      await fn();
      const durationMs = Date.now() - t0;
      report.steps.push({ name, ok: true, durationMs });
      console.log(`OK  ${name} (${durationMs}ms)`);
    } catch (error) {
      const durationMs = Date.now() - t0;
      report.steps.push({
        name,
        ok: false,
        durationMs,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`NG  ${name}:`, error);
      throw error;
    }
  }

  await step("top_load", async () => {
    const t0 = Date.now();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    report.performance.topLoadMs = Date.now() - t0;
    await page.screenshot({
      path: path.join(OUT, "01-top.png"),
      fullPage: true,
    });
  });

  await step("open_search", async () => {
    await page.getByRole("button", { name: "検索画面へ移動" }).first().click();
    await page.waitForURL(/\/search/);
    await page.getByRole("textbox", { name: "作品を検索" }).waitFor();
    await page.screenshot({
      path: path.join(OUT, "02-search.png"),
      fullPage: true,
    });
  });

  await step("search_query", async () => {
    const input = page.getByRole("textbox", { name: "作品を検索" });
    const t0 = Date.now();

    const worksResponsePromise = page.waitForResponse(
      (res) =>
        res.url().includes("/api/works") &&
        decodeURIComponent(res.url()).includes(QUERY) &&
        res.ok(),
      { timeout: 30000 },
    );

    await input.fill(QUERY);
    const response = await worksResponsePromise;
    report.performance.searchInputToResponseMs = Date.now() - t0;
    report.performance.searchApiStatus = response.status();

    await page.getByRole("article").first().waitFor({ timeout: 15000 });
    report.performance.searchInputToFirstResultMs = Date.now() - t0;
    await page.screenshot({
      path: path.join(OUT, "03-search-results.png"),
      fullPage: true,
    });

    // 初回コールドはネットワーク依存。R1 は同一クエリ再検索 ≤500ms を評価対象とする
    report.performance.searchColdMs =
      report.performance.searchInputToFirstResultMs;
  });

  await step("search_same_query_cached", async () => {
    const input = page.getByRole("textbox", { name: "作品を検索" });
    await input.fill("");
    await page.waitForTimeout(250);

    const t0 = Date.now();
    await input.fill(QUERY);
    await page.getByRole("article").first().waitFor({ timeout: 5000 });
    report.performance.searchCachedMs = Date.now() - t0;
    await page.screenshot({
      path: path.join(OUT, "03b-search-cached.png"),
      fullPage: true,
    });

    if (report.performance.searchCachedMs > 500) {
      report.issues.push(
        `同一クエリ再検索が ${report.performance.searchCachedMs}ms（目標 R1: 500ms以内）`,
      );
    }
  });

  await step("open_detail", async () => {
    const t0 = Date.now();
    await page.getByRole("button", { name: /の詳細を見る$/ }).first().click();
    await page.waitForURL(/\/search\/detail\//);
    report.performance.detailNavMs = Date.now() - t0;
    await page.screenshot({
      path: path.join(OUT, "04-search-detail.png"),
      fullPage: true,
    });
  });

  // ダウンロードは外部通信が重いので、詳細画面までの体験を主対象にする
  await step("back_to_top_and_check_empty_or_list", async () => {
    await page.getByRole("button", { name: "TOPに戻る" }).click();
    await page.waitForURL((url) => new URL(url).pathname === "/");
    await page.screenshot({
      path: path.join(OUT, "05-top-after.png"),
      fullPage: true,
    });
  });

  // CLS / paint metrics
  report.performance.webVitals = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paints = performance.getEntriesByType("paint");
    return {
      domContentLoaded: nav?.domContentLoadedEventEnd,
      loadEventEnd: nav?.loadEventEnd,
      firstPaint: paints.find((p) => p.name === "first-paint")?.startTime,
      firstContentfulPaint: paints.find(
        (p) => p.name === "first-contentful-paint",
      )?.startTime,
    };
  });

  await writeFile(
    path.join(OUT, "phase1-report.json"),
    JSON.stringify(report, null, 2),
    "utf-8",
  );
  console.log("Wrote", path.join(OUT, "phase1-report.json"));
  console.log("Issues:", report.issues);

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
