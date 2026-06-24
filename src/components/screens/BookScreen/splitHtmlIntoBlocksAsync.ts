import { splitHtmlIntoBlocks } from "./bookHtmlUtils";
import { splitHtmlIntoBlocksImpl } from "./splitHtmlIntoBlocksImpl";

type PendingRequest = {
  resolve: (blocks: string[]) => void;
  reject: (error: Error) => void;
};

let worker: Worker | null = null;
let requestId = 0;
const pendingRequests = new Map<number, PendingRequest>();

function isTestEnvironment(): boolean {
  return typeof process !== "undefined" && process.env.VITEST === "true";
}

function shouldUseWorker(): boolean {
  return typeof window !== "undefined" && typeof Worker !== "undefined" && !isTestEnvironment();
}

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("./splitHtmlIntoBlocks.worker.ts", import.meta.url));
    worker.onmessage = (event: MessageEvent<{ id: number; blocks?: string[]; error?: string }>) => {
      const { id, blocks, error } = event.data;
      const pending = pendingRequests.get(id);
      if (!pending) {
        return;
      }

      pendingRequests.delete(id);
      if (error || !blocks) {
        pending.reject(new Error(error ?? "HTML split failed"));
        return;
      }

      pending.resolve(blocks);
    };
    worker.onerror = () => {
      for (const pending of pendingRequests.values()) {
        pending.reject(new Error("HTML split worker error"));
      }
      pendingRequests.clear();
      worker?.terminate();
      worker = null;
    };
  }

  return worker;
}

export function terminateSplitHtmlWorker(): void {
  for (const pending of pendingRequests.values()) {
    pending.reject(new Error("HTML split worker terminated"));
  }
  pendingRequests.clear();
  worker?.terminate();
  worker = null;
}

export function splitHtmlIntoBlocksAsync(html: string): Promise<string[]> {
  if (!shouldUseWorker()) {
    return Promise.resolve(splitHtmlIntoBlocksImpl(html));
  }

  return new Promise((resolve, reject) => {
    const id = ++requestId;
    pendingRequests.set(id, { resolve, reject });

    try {
      getWorker().postMessage({ id, html });
    } catch {
      pendingRequests.delete(id);
      resolve(splitHtmlIntoBlocks(html));
    }
  });
}
