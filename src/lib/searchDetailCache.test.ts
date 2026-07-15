import { beforeEach, describe, expect, it } from "vitest";
import {
  stashSearchDetailWork,
  takeSearchDetailWork,
} from "./searchDetailCache";

describe("searchDetailCache", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stashしたWorkをidentifierで取り出せる", () => {
    stashSearchDetailWork({ id: "001", title: "坊っちゃん" });
    expect(takeSearchDetailWork("001")?.title).toBe("坊っちゃん");
  });

  it("未保存のidentifierはnullを返す", () => {
    expect(takeSearchDetailWork("missing")).toBeNull();
  });
});
