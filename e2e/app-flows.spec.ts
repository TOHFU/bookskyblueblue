import { expect, test } from "@playwright/test";

test.describe("TOP/SEARCH/BOOK", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(async () => {
      await new Promise<void>((resolve, reject) => {
        const req = indexedDB.open("book-sky-blue-blue", 1);

        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains("savedWorks")) {
            db.createObjectStore("savedWorks", { keyPath: "identifier" });
          }
        };

        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction("savedWorks", "readwrite");
          tx.objectStore("savedWorks").clear();
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        };

        req.onerror = () => reject(req.error);
      });
    });
  });

  test("TOP-EMPTYSTATE が表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "TOP-EMPTYSTATE" })).toBeVisible();
    await expect(page.getByRole("link", { name: "検索画面へ" })).toBeVisible();
  });

  test("SEARCH で検索して SEARCH DETAIL へ遷移できる", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("textbox").fill("駅");
    await expect(page.getByRole("link", { name: "作品詳細" }).first()).toBeVisible({ timeout: 15000 });
    await page.getByRole("link", { name: "作品詳細" }).first().click();
    await expect(page).toHaveURL(/\/search\/detail\//);
    await expect(page.getByRole("heading", { name: "SEARCH DETAIL" })).toBeVisible();
    await expect(page.getByText("作品ID:")).toBeVisible();
  });

  test("DOWNLOAD 後に TOP へ戻り BOOK を閲覧できる", async ({ page }) => {
    await page.route(/\/api\/works\/work-002(?:\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "work-002",
          title: "坊っちゃん",
          author: "夏目漱石",
          firstPublishedYear: "1906",
          writingStyle: "新字新仮名",
          publisher: "岩波書店",
          sourceBookName: "坊っちゃん",
          content:
            "親譲りの無鉄砲で小供の時から損ばかりしている。".repeat(80),
        }),
      });
    });

    await page.goto("/download/work-002");
    await expect(page.getByRole("heading", { name: "DOWNLOAD" })).toBeVisible();
  await expect(page).toHaveURL("/", { timeout: 20000 });

    await expect(page.getByText("坊っちゃん")).toBeVisible();
  await page.getByRole("link", { name: "詳細" }).first().click();
    await expect(page).toHaveURL(/\/book\//);

    await expect(page.getByText("BOOK-ODDPAGE")).toBeVisible();
    await expect(page.getByRole("button", { name: "次へ" })).toBeVisible();
    await page.getByRole("button", { name: "次へ" }).click();
    await expect(page.getByText("2 /" )).toBeVisible();
  });
});
