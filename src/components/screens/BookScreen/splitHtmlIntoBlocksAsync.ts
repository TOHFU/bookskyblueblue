import { splitHtmlIntoBlocksImpl } from "./splitHtmlIntoBlocksImpl";

type IdleRequestCallback = (deadline: IdleDeadline) => void;

const pendingIdleTasks = new Set<number>();

function isTestEnvironment(): boolean {
  return typeof process !== "undefined" && process.env.VITEST === "true";
}

function requestIdleTask(callback: IdleRequestCallback): number {
  if (typeof requestIdleCallback === "function") {
    return requestIdleCallback(callback);
  }

  return window.setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => 0,
    });
  }, 0);
}

function cancelIdleTask(taskId: number): void {
  if (typeof cancelIdleCallback === "function") {
    cancelIdleCallback(taskId);
    return;
  }

  window.clearTimeout(taskId);
}

export function cancelPendingSplitHtmlTasks(): void {
  for (const taskId of pendingIdleTasks) {
    cancelIdleTask(taskId);
  }
  pendingIdleTasks.clear();
}

/** アイドル時にメインスレッドで HTML をブロック分割する */
export function splitHtmlIntoBlocksAsync(html: string): Promise<string[]> {
  if (isTestEnvironment()) {
    return Promise.resolve(splitHtmlIntoBlocksImpl(html));
  }

  return new Promise((resolve) => {
    const taskId = requestIdleTask(() => {
      pendingIdleTasks.delete(taskId);
      resolve(splitHtmlIntoBlocksImpl(html));
    });
    pendingIdleTasks.add(taskId);
  });
}

/** テスト用: 保留中のアイドルタスクをクリアする */
export function resetSplitHtmlIdleStateForTests(): void {
  cancelPendingSplitHtmlTasks();
}
