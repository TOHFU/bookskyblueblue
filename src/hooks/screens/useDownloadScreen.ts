"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clientWorkCatalogRepository, clientWorkLibraryRepository } from "@/application/containers/clientWorkContainer";
import { downloadWorkUseCase } from "@/application/usecases/downloadWorkUseCase";

type DownloadStatus = "downloading" | "done" | "error";

export function useDownloadScreen(identifier: string) {
  const router = useRouter();
  const [status, setStatus] = useState<DownloadStatus>("downloading");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const runDownload = async () => {
      try {
        setProgress(20);
        setProgress(40);
        setProgress(70);

        await downloadWorkUseCase(
          clientWorkCatalogRepository,
          clientWorkLibraryRepository,
          identifier
        );

        setProgress(90);

        const cache = await caches.open("book-pages-cache");
        await Promise.all([
          cache.add(`/book/${identifier}`),
          cache.add(`/book/detail/${identifier}`)
        ]);

        setProgress(100);
        setStatus("done");

        // 完了後は TOP を経由せず、すぐに読書を始められるようにする
        setTimeout(() => {
          router.push(`/book/${identifier}`);
        }, 400);
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "エラーが発生しました"
        );
      }
    };

    void runDownload();
  }, [identifier, router]);

  return {
    status,
    progress,
    errorMessage,
  };
}
