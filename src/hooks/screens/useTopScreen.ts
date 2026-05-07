"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clientWorkLibraryRepository } from "@/application/containers/clientWorkContainer";
import { loadTopWorksUseCase } from "@/application/usecases/loadTopWorksUseCase";
import type { Work } from "@/domain/entities/work";

export function useTopScreen() {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progressMap, setProgressMap] = useState<Record<string, { page: number; totalPages: number }>>({});
  const [deleteTarget, setDeleteTarget] = useState<Work | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const loadWorks = useCallback(async () => {
    try {
      const nextState = await loadTopWorksUseCase(clientWorkLibraryRepository);
      setWorks(nextState.works);
      setProgressMap(nextState.progressMap);
    } catch {
      setWorks([]);
      setIsErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWorks();
  }, [loadWorks]);

  const handleDeleteClick = useCallback((work: Work) => {
    setDeleteTarget(work);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (work: Work) => {
      if (!work.id) return;
      await clientWorkLibraryRepository.remove(work.id);
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
      await loadWorks();
    },
    [loadWorks]
  );

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  }, []);

  const handleDetailClick = useCallback(
    (work: Work) => {
      if (work.id) {
        router.push(`/book/${work.id}`);
      }
    },
    [router]
  );

  const handleSearchClick = useCallback(() => {
    router.push("/search");
  }, [router]);

  const handleHelpClick = useCallback(() => {
    router.push("/about");
  }, [router]);

  const closeErrorDialog = useCallback(() => {
    setIsErrorDialogOpen(false);
  }, []);

  return {
    works,
    isLoading,
    progressMap,
    deleteTarget,
    isDeleteDialogOpen,
    isErrorDialogOpen,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleDetailClick,
    handleSearchClick,
    handleHelpClick,
    closeErrorDialog,
  };
}
