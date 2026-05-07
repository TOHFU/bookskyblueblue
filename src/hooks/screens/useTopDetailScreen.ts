"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clientWorkLibraryRepository } from "@/application/containers/clientWorkContainer";
import { getSavedWorkDetailStateUseCase } from "@/application/usecases/getSavedWorkDetailStateUseCase";
import type { Bookmark, Work } from "@/domain/entities/work";

type ReadingProgress = {
  page: number;
  totalPages: number;
};

export function useTopDetailScreen(identifier: string) {
  const router = useRouter();
  const [work, setWork] = useState<Work | null>(null);
  const [progress, setProgress] = useState<ReadingProgress>({ page: 0, totalPages: 0 });
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const state = await getSavedWorkDetailStateUseCase(
          clientWorkLibraryRepository,
          identifier
        );
        setWork(state.work);
        setProgress(state.progress);
        setBookmarks(state.bookmarks);
      } finally {
        setIsLoading(false);
      }
    };

    void loadState();
  }, [identifier]);

  const handleBack = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleClose = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleRead = useCallback(() => {
    router.push(`/book/${identifier}?page=${progress.page}`);
  }, [identifier, progress.page, router]);

  const handleOpenBookmark = useCallback(
    (page: number) => {
      router.push(`/book/${identifier}?page=${page}`);
    },
    [identifier, router]
  );

  return {
    work,
    progress,
    bookmarks,
    isLoading,
    handleBack,
    handleClose,
    handleRead,
    handleOpenBookmark,
  };
}