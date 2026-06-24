import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ChunkMetadata } from "@/components/screens/BookScreen/bookHtmlUtils";
import {
  createStoredBookLayout,
  scheduleDeferredCacheBuild,
  scheduleTotalPagesMeasurement,
} from "./bookLayoutCacheScheduler";

const saveBookLayoutCache = vi.fn().mockResolvedValue(undefined);

vi.mock("@/data/repositories/bookLayoutCacheRepository", () => ({
  createBookLayoutCacheId: (workId: string, layoutKey: string) => `${workId}:${layoutKey}`,
  saveBookLayoutCache: (...args: unknown[]) => saveBookLayoutCache(...args),
}));

const layoutParams = {
  columnWidth: 32,
  containerHeight: 600,
  containerWidth: 300,
};

function createMetadata(overrides: Partial<ChunkMetadata> = {}): ChunkMetadata {
  return {
    totalPages: 45,
    totalPagesKnown: true,
    totalChunks: 3,
    blocks: ["<p>a</p>", "<p>b</p>", "<p>c</p>"],
    layoutParams,
    chunks: [
      {
        chunkId: 0,
        startPage: 0,
        contentStartPage: 0,
        endPage: 20,
        blockStart: 0,
        blockEnd: 0,
        content: "<p>a</p>",
      },
    ],
    ...overrides,
  };
}

describe("createStoredBookLayout", () => {
  it("チャンク境界を開始ページ順に保存する", () => {
    const metadata = createMetadata({
      chunks: [
        {
          chunkId: 1,
          startPage: 18,
          contentStartPage: 18,
          endPage: 40,
          blockStart: 1,
          blockEnd: 1,
          content: "<p>b</p>",
        },
        {
          chunkId: 0,
          startPage: 0,
          contentStartPage: 0,
          endPage: 20,
          blockStart: 0,
          blockEnd: 0,
          content: "<p>a</p>",
        },
      ],
    });

    const stored = createStoredBookLayout("work-1", "32:600:300", "100:1", metadata, false);

    expect(stored.id).toBe("work-1:32:600:300");
    expect(stored.isComplete).toBe(false);
    expect(stored.chunkBoundaries.map((boundary) => boundary.startPage)).toEqual([0, 18]);
  });
});

describe("scheduleDeferredCacheBuild", () => {
  beforeEach(() => {
    saveBookLayoutCache.mockClear();
    vi.useFakeTimers();
    vi.stubGlobal(
      "requestIdleCallback",
      (callback: IdleDeadline extends never ? never : (deadline: IdleDeadline) => void) =>
        window.setTimeout(
          () =>
            callback({
              didTimeout: false,
              timeRemaining: () => 50,
            }),
          0
        )
    );
    vi.stubGlobal("cancelIdleCallback", (id: number) => {
      window.clearTimeout(id);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("不足チャンクを1件ずつ構築して保存する", async () => {
    const metadata = createMetadata();

    const cancel = scheduleDeferredCacheBuild({
      workId: "work-1",
      layoutKey: "32:600:300",
      contentHash: "100:1",
      getMetadata: () => metadata,
    });

    await vi.runAllTimersAsync();

    expect(metadata.chunks.length).toBeGreaterThan(1);
    expect(saveBookLayoutCache).toHaveBeenCalled();

    const lastCall = saveBookLayoutCache.mock.calls.at(-1)?.[0] as { isComplete: boolean };
    expect(lastCall.isComplete).toBe(true);

    cancel();
  });

  it("キャンセル後は構築を続けない", async () => {
    const metadata = createMetadata();

    const cancel = scheduleDeferredCacheBuild({
      workId: "work-1",
      layoutKey: "32:600:300",
      contentHash: "100:1",
      getMetadata: () => metadata,
    });

    cancel();
    const callsBefore = saveBookLayoutCache.mock.calls.length;

    await vi.runAllTimersAsync();

    expect(saveBookLayoutCache.mock.calls.length).toBe(callsBefore);
  });
});

describe("scheduleTotalPagesMeasurement", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "requestIdleCallback",
      (callback: (deadline: IdleDeadline) => void) =>
        window.setTimeout(
          () =>
            callback({
              didTimeout: false,
              timeRemaining: () => 50,
            }),
          0
        )
    );
    vi.stubGlobal("cancelIdleCallback", (id: number) => {
      window.clearTimeout(id);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("総ページ数未計測のメタデータを更新する", async () => {
    const metadata = createMetadata({
      totalPages: 1,
      totalPagesKnown: false,
      totalChunks: 1,
      chunks: [],
    });
    const onMeasured = vi.fn();

    const cancel = scheduleTotalPagesMeasurement({
      html: "<p>あ</p>".repeat(20),
      params: layoutParams,
      getMetadata: () => metadata,
      onMeasured,
    });

    await vi.runAllTimersAsync();

    expect(metadata.totalPagesKnown).toBe(true);
    expect(onMeasured).toHaveBeenCalledWith(expect.any(Number));

    cancel();
  });

  it("総ページ数が既知なら計測しない", async () => {
    const metadata = createMetadata();
    const onMeasured = vi.fn();

    const cancel = scheduleTotalPagesMeasurement({
      html: "<p>あ</p>",
      params: layoutParams,
      getMetadata: () => metadata,
      onMeasured,
    });

    await vi.runAllTimersAsync();

    expect(onMeasured).not.toHaveBeenCalled();

    cancel();
  });
});
