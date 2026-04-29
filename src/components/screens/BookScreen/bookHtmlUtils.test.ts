import { describe, expect, it } from "vitest";
import { sanitizeHtml, extractMainContent } from "./bookHtmlUtils";

describe("sanitizeHtml", () => {
  it("scriptタグを除去する", () => {
    const input = '<p>テキスト</p><script>alert("XSS")</script>';
    expect(sanitizeHtml(input)).not.toContain("<script>");
    expect(sanitizeHtml(input)).not.toContain("alert");
  });

  it("styleタグを除去する", () => {
    const input = '<p>テキスト</p><style>body { color: red; }</style>';
    expect(sanitizeHtml(input)).not.toContain("<style>");
  });

  it("onXXXイベントハンドラ属性を除去する", () => {
    const input = '<button onclick="evil()">クリック</button>';
    expect(sanitizeHtml(input)).not.toContain("onclick");
  });

  it("javascript: href を除去する", () => {
    const input = '<a href="javascript:void(0)">リンク</a>';
    expect(sanitizeHtml(input)).not.toContain("javascript:");
  });

  it("imgタグをalt属性テキストに置換する（ダブルクォート）", () => {
    const input = '<img src="foo.png" alt="図1" />';
    expect(sanitizeHtml(input)).toBe("図1");
  });

  it("imgタグをalt属性テキストに置換する（シングルクォート）", () => {
    const input = "<img src='foo.png' alt='図A' />";
    expect(sanitizeHtml(input)).toBe("図A");
  });

  it("altなしのimgタグは空文字に置換される", () => {
    const input = '<p><img src="noalt.png"></p>';
    expect(sanitizeHtml(input)).not.toContain("<img");
  });

  it("3連続以上のbrタグをbr2つに圧縮する", () => {
    const input = "行1<br><br><br><br>行2";
    const result = sanitizeHtml(input);
    expect(result).toContain("<br><br>");
    // 3つ以上は残らない
    expect(result).not.toMatch(/<br>(<br>){2,}/);
  });
});

describe("extractMainContent", () => {
  it("class=main_text の div 内容を抽出する", () => {
    const input = `
      <html><body>
        <div class="main_text">
          <p>本文テキスト</p>
        </div>
      </body></html>
    `;
    const result = extractMainContent(input);
    expect(result).toContain("本文テキスト");
    expect(result).not.toContain("main_text");
  });

  it("main_text がない場合はbodyのフォールバック", () => {
    const input = "<html><body><p>フォールバック本文</p></body></html>";
    const result = extractMainContent(input);
    expect(result).toContain("フォールバック本文");
  });

  it("bodyもない場合はhttm全体をsanitizeして返す", () => {
    const input = "<p>そのままのHTML</p>";
    const result = extractMainContent(input);
    expect(result).toContain("そのままのHTML");
  });

  it("ネストしたdivが含まれていても正しく抽出される", () => {
    const input = `
      <div class="main_text">
        <div><p>ネスト内テキスト</p></div>
      </div>
    `;
    const result = extractMainContent(input);
    expect(result).toContain("ネスト内テキスト");
  });

  it("main_text のスクリプトタグを除去する", () => {
    const input = `
      <div class="main_text">
        <p>本文</p><script>evil()</script>
      </div>
    `;
    const result = extractMainContent(input);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("evil");
  });
});
