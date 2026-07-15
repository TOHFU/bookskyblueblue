"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Work } from "@/domain/entities/work";
import { stashSearchDetailWork } from "@/lib/searchDetailCache";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 200;
const SEARCH_CACHE_LIMIT = 20;

type SearchCacheEntry = {
  works: Work[];
  cachedAt: number;
};

const searchResultCache = new Map<string, SearchCacheEntry>();

/** テスト間の干渉を避けるためのキャッシュクリア */
export function clearSearchResultCacheForTests() {
  searchResultCache.clear();
}

function getCachedResults(query: string): Work[] | null {
  const entry = searchResultCache.get(query);
  return entry ? entry.works : null;
}

function setCachedResults(query: string, works: Work[]) {
  searchResultCache.set(query, { works, cachedAt: Date.now() });

  if (searchResultCache.size <= SEARCH_CACHE_LIMIT) {
    return;
  }

  const oldestKey = searchResultCache.keys().next().value;
  if (oldestKey !== undefined) {
    searchResultCache.delete(oldestKey);
  }
}

export function useSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Work[]>([]);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const latestQueryRef = useRef("");
  const activeRequestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchResults = useCallback(async (searchQuery: string) => {
    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;

    const cached = getCachedResults(searchQuery);
    if (cached) {
      setResults(cached);
      setDisplayedCount(PAGE_SIZE);
      setIsLoading(false);
      return;
    }

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);

    try {
      const params = new URLSearchParams({ q: searchQuery });
      const response = await fetch(`/api/works?${params.toString()}`, {
        signal: abortController.signal,
      });
      if (!response.ok) {
        throw new Error("検索に失敗しました");
      }

      const data = (await response.json()) as Work[];
      if (
        searchQuery !== latestQueryRef.current ||
        requestId !== activeRequestIdRef.current
      ) {
        return;
      }

      setCachedResults(searchQuery, data);
      setResults(data);
      setDisplayedCount(PAGE_SIZE);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      if (
        searchQuery === latestQueryRef.current &&
        requestId === activeRequestIdRef.current
      ) {
        setResults([]);
        setDisplayedCount(PAGE_SIZE);
      }
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    latestQueryRef.current = query;

    // 入力直後に待ち状態を出し、空白のまま固まって見えないようにする
    const cached = getCachedResults(query);
    if (cached) {
      setResults(cached);
      setDisplayedCount(PAGE_SIZE);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      void fetchResults(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, fetchResults]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [results]);

  const handleQueryChange = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
  }, []);

  const handleSampleQuery = useCallback((sample: string) => {
    setQuery(sample);
  }, []);

  const handleDetailClick = useCallback(
    (work: Work) => {
      if (work.id) {
        stashSearchDetailWork(work);
        router.push(`/search/detail/${work.id}`);
      }
    },
    [router]
  );

  const handleClose = useCallback(() => {
    router.push("/");
  }, [router]);

  const displayedWorks = useMemo(
    () => results.slice(0, displayedCount),
    [displayedCount, results]
  );

  // 先頭件数の詳細ルートとカタログAPIを先読みし、タップ後の待ちを短縮する
  useEffect(() => {
    for (const work of displayedWorks.slice(0, 5)) {
      if (!work.id) continue;
      router.prefetch?.(`/search/detail/${work.id}`);
      void fetch(`/api/catalog/${work.id}`).catch(() => undefined);
    }
  }, [displayedWorks, router]);

  return {
    query,
    results,
    displayedWorks,
    isLoading,
    hasMore: displayedCount < results.length,
    sentinelRef,
    handleQueryChange,
    handleSampleQuery,
    handleDetailClick,
    handleClose,
  };
}
