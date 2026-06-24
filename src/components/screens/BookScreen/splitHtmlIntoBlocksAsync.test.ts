import { afterEach, describe, expect, it, vi } from "vitest";
import {
  resetSplitHtmlWorkerStateForTests,
  splitHtmlIntoBlocksAsync,
} from "./splitHtmlIntoBlocksAsync";
import { splitHtmlIntoBlocksImpl } from "./splitHtmlIntoBlocksImpl";

describe("splitHtmlIntoBlocksImpl", () => {
  it("トップレベルの要素をブロックに分割する", () => {
    const html = "<p>あ</p><p>い</p>";
    expect(splitHtmlIntoBlocksImpl(html)).toEqual(["<p>あ</p>", "<p>い</p>"]);
  });
});

describe("splitHtmlIntoBlocksAsync", () => {
  afterEach(() => {
    resetSplitHtmlWorkerStateForTests();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("テスト環境では同期分割にフォールバックする", async () => {
    const html = "<p>あ</p><p>い</p>";
    await expect(splitHtmlIntoBlocksAsync(html)).resolves.toEqual([
      "<p>あ</p>",
      "<p>い</p>",
    ]);
  });

  it("Worker が DOMParser エラーを返したらメインスレッドで分割する", async () => {
    vi.stubEnv("VITEST", "");

    const html = "<p>あ</p><p>い</p>";
    const postMessage = vi.fn(({ id }: { id: number }) => {
      queueMicrotask(() => {
        onmessage?.({
          data: { id, error: "DOMParser is not available in Worker" },
        } as MessageEvent);
      });
    });
    let onmessage: ((event: MessageEvent) => void) | null = null;

    vi.stubGlobal("Worker", function MockWorker(this: Worker) {
      this.postMessage = postMessage as Worker["postMessage"];
      Object.defineProperty(this, "onmessage", {
        set(handler: (event: MessageEvent) => void) {
          onmessage = handler;
        },
        get() {
          return onmessage;
        },
      });
      this.terminate = vi.fn();
    });

    await expect(splitHtmlIntoBlocksAsync(html)).resolves.toEqual([
      "<p>あ</p>",
      "<p>い</p>",
    ]);

    await expect(splitHtmlIntoBlocksAsync(html)).resolves.toEqual([
      "<p>あ</p>",
      "<p>い</p>",
    ]);
    expect(postMessage).toHaveBeenCalledTimes(1);
  });
});
