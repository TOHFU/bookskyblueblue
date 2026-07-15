import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearSearchResultCacheForTests,
  useSearchScreen,
} from "./useSearchScreen";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("useSearchScreen", () => {
  beforeEach(() => {
    clearSearchResultCacheForTests();
    mockPush.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("q=%E5%A4%8F%E7%9B%AE%E6%BC%B1%E7%9F%B3") || url.includes("夏目漱石")) {
          return Response.json([
            { id: "001", title: "坊っちゃん", author: "夏目漱石" },
          ]);
        }
        return Response.json([]);
      }),
    );
  });

  it("同一クエリ再検索ではキャッシュから即時に結果を返す", async () => {
    const { result } = renderHook(() => useSearchScreen());

    act(() => {
      result.current.handleQueryChange("夏目漱石");
    });

    await waitFor(() => {
      expect(result.current.results).toHaveLength(1);
    });

    const worksFetchCount = () =>
      vi
        .mocked(fetch)
        .mock.calls.filter(([input]) => String(input).includes("/api/works")).length;

    const callsAfterFirstHit = worksFetchCount();

    act(() => {
      result.current.handleQueryChange("別クエリ");
    });

    await waitFor(() => {
      expect(worksFetchCount()).toBeGreaterThan(callsAfterFirstHit);
      expect(result.current.isLoading).toBe(false);
    });

    const callsAfterOtherQuery = worksFetchCount();

    act(() => {
      result.current.handleQueryChange("夏目漱石");
    });

    expect(result.current.results[0]?.title).toBe("坊っちゃん");
    expect(result.current.isLoading).toBe(false);
    expect(worksFetchCount()).toBe(callsAfterOtherQuery);
  });

  it("入力直後に isLoading が true になる", () => {
    const { result } = renderHook(() => useSearchScreen());

    act(() => {
      result.current.handleQueryChange("芥川");
    });

    expect(result.current.isLoading).toBe(true);
  });
});
