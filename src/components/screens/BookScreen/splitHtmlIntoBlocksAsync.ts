import { splitHtmlIntoBlocksImpl } from "./splitHtmlIntoBlocksImpl";

type PendingRequest = {
  html: string;
  resolve: (blocks: string[]) => void;
};

let worker: Worker | null = null;
let workerUsable = true;
let requestId = 0;
const pendingRequests = new Map<number, PendingRequest>();

function isTestEnvironment(): boolean {
  return typeof process !== "undefined" && process.env.VITEST === "true";
}

function shouldUseWorker(): boolean {
  return (
    workerUsable &&
    typeof window !== "undefined" &&
    typeof Worker !== "undefined" &&
    !isTestEnvironment()
  );
}

function splitOnMainThread(html: string): string[] {
  return splitHtmlIntoBlocksImpl(html);
}

function disableWorker(): void {
  workerUsable = false;
  worker?.terminate();
  worker = null;
}

function fallbackAllPendingToMainThread(): void {
  for (const [, pending] of pendingRequests) {
    pending.resolve(splitOnMainThread(pending.html));
  }
  pendingRequests.clear();
}

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("./splitHtmlIntoBlocks.worker.ts", import.meta.url));
    worker.onmessage = (event: MessageEvent<{ id: number; blocks?: string[]; error?: string }>) => {
      const { id, blocks, error } = event.data;

      if (error || !blocks) {
        disableWorker();
        fallbackAllPendingToMainThread();
        return;
      }

      const pending = pendingRequests.get(id);
      if (!pending) {
        return;
      }

      pendingRequests.delete(id);
      pending.resolve(blocks);
    };
    worker.onerror = () => {
      disableWorker();
      fallbackAllPendingToMainThread();
    };
  }

  return worker;
}

export function terminateSplitHtmlWorker(): void {
  pendingRequests.clear();
  worker?.terminate();
  worker = null;
}

export function splitHtmlIntoBlocksAsync(html: string): Promise<string[]> {
  if (!shouldUseWorker()) {
    return Promise.resolve(splitOnMainThread(html));
  }

  return new Promise((resolve) => {
    const id = ++requestId;
    pendingRequests.set(id, { html, resolve });

    try {
      getWorker().postMessage({ id, html });
    } catch {
      pendingRequests.delete(id);
      disableWorker();
      resolve(splitOnMainThread(html));
    }
  });
}

/** テスト用: Worker 利用可否フラグをリセットする */
export function resetSplitHtmlWorkerStateForTests(): void {
  workerUsable = true;
  terminateSplitHtmlWorker();
}
