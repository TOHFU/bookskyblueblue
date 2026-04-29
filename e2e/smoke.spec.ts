import { expect, test } from "@playwright/test";

const AKUTAGAWA_QUERY = "芥川龍之介";
const AKUTAGAWA_WORK_ID = "4872";

async function mockAkutagawaSearch(page: import("@playwright/test").Page) {
  await page.route("**/api/works?**", async (route) => {
    const url = new URL(route.request().url());
    const query = url.searchParams.get("q") ?? "";

    if (query === AKUTAGAWA_QUERY) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: AKUTAGAWA_WORK_ID,
            title: "愛読書の印象",
            author: "芥川 龍之介",
            firstPublishedYear: "1926（大正15）年",
            writingStyle: "新字新仮名",
            publisher: "青空文庫",
          },
        ]),
      });
      return;
    }

    await route.fallback();
  });
}

// ----------------------------------------------------------------
// TOP画面
// ----------------------------------------------------------------
test.describe("TOP画面", () => {
  test("トップページが表示される", async ({ page }) => {
    await page.goto("/");
    // 検索ボタンが表示されれば TOP 画面がレンダリングされている
    await expect(
      page.getByRole("button", { name: "検索画面へ移動" }).first(),
    ).toBeVisible({ timeout: 10000 });
  });

  test("作品が0件のとき EmptyState が表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("作品を追加してみましょう")).toBeVisible({ timeout: 10000 });
  });

  test("検索ボタンをクリックすると SEARCH画面に遷移する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "検索画面へ移動" }).first().click();
    await expect(page).toHaveURL(/\/search/);
    await expect(page.getByRole("textbox", { name: "作品を検索" })).toBeVisible();
  });

  test("ヘルプボタンをクリックすると ABOUT画面に遷移する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "ヘルプを開く" }).click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByText("BOOK SKY, BLUE BLUEは、")).toBeVisible();
  });
});

// ----------------------------------------------------------------
// SEARCH画面
// ----------------------------------------------------------------
test.describe("SEARCH画面", () => {
  test("検索インプットが表示される", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByRole("textbox", { name: "作品を検索" })).toBeVisible();
  });

  test("「芥川龍之介」で検索すると検索結果が表示される", async ({ page }) => {
    await mockAkutagawaSearch(page);
    await page.goto("/search");
    const input = page.getByRole("textbox", { name: "作品を検索" });
    await input.fill(AKUTAGAWA_QUERY);
    // debounce 300ms + API レスポンス待ち
    await expect(page.getByRole("article").first()).toBeVisible({ timeout: 10000 });
  });

  test("「芥川龍之介」の検索結果に著者名が含まれる", async ({ page }) => {
    await mockAkutagawaSearch(page);
    await page.goto("/search");
    const input = page.getByRole("textbox", { name: "作品を検索" });
    await input.fill(AKUTAGAWA_QUERY);
    await expect(page.getByText(/芥川\s*龍之介/).first()).toBeVisible({ timeout: 10000 });
  });

  test("Closeボタンをクリックするとトップに戻る", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("button", { name: "TOPに戻る" }).click();
    await expect(page).toHaveURL("/");
  });
});

// ----------------------------------------------------------------
// SEARCH DETAIL画面
// ----------------------------------------------------------------
test.describe("SEARCH DETAIL画面", () => {
  test("検索結果カードの詳細ボタンをクリックすると詳細画面に遷移する", async ({ page }) => {
    await mockAkutagawaSearch(page);
    await page.goto("/search");
    const input = page.getByRole("textbox", { name: "作品を検索" });
    await input.fill(AKUTAGAWA_QUERY);
    await page.getByRole("article").first().waitFor({ timeout: 10000 });
    await page.getByRole("button", { name: "詳細を見る" }).first().click();
    await expect(page).toHaveURL(/\/search\/detail\//);
  });

  test("Backボタンをクリックすると SEARCH画面に戻る", async ({ page }) => {
    await mockAkutagawaSearch(page);
    await page.goto("/search");
    const input = page.getByRole("textbox", { name: "作品を検索" });
    await input.fill(AKUTAGAWA_QUERY);
    await page.getByRole("article").first().waitFor({ timeout: 10000 });
    await page.getByRole("button", { name: "詳細を見る" }).first().click();
    await expect(page).toHaveURL(/\/search\/detail\//);
    await page.getByRole("button", { name: "検索結果に戻る" }).click();
    await expect(page).toHaveURL(/\/search/);
  });

  test("Closeボタンをクリックするとトップに戻る", async ({ page }) => {
    await mockAkutagawaSearch(page);
    await page.goto("/search");
    const input = page.getByRole("textbox", { name: "作品を検索" });
    await input.fill(AKUTAGAWA_QUERY);
    await page.getByRole("article").first().waitFor({ timeout: 10000 });
    await page.getByRole("button", { name: "詳細を見る" }).first().click();
    await expect(page).toHaveURL(/\/search\/detail\//);
    await page.getByRole("button", { name: "TOPに戻る" }).click();
    await expect(page).toHaveURL("/");
  });
});
