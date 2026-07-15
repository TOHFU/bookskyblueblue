import { describe, expect, it } from "vitest";
import { getProgressLabel } from "./getProgressLabel";

describe("getProgressLabel", () => {
  it("未読を返す", () => {
    expect(getProgressLabel(0, 10)).toBe("未読");
  });

  it("読了を返す", () => {
    expect(getProgressLabel(9, 10)).toBe("読了");
  });

  it("途中ページを返す", () => {
    expect(getProgressLabel(4, 10)).toBe("5ページ");
  });
});
