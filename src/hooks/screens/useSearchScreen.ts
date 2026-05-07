"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Work } from "@/domain/entities/work";

const PAGE_SIZE = 10;

export function useSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Work[]>([]);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchResults = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ q: searchQuery });
      const response = await fetch(`/api/works?${params.toString()}`);
      if (!response.ok) {
        throw new Error("検索に失敗しました");
      }

      const data = (await response.json()) as Work[];
      setResults(data);
      setDisplayedCount(PAGE_SIZE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      void fetchResults(query);
    }, 300);

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
