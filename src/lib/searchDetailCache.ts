import type { Work } from "@/domain/entities/work";

const STORAGE_KEY_PREFIX = "search-detail-work:";

function storageKey(identifier: string) {
  return `${STORAGE_KEY_PREFIX}${identifier}`;
}

/** 検索結果→詳細の即時表示用に Work を一時保存する */
export function stashSearchDetailWork(work: Work) {
  if (typeof window === "undefined" || !work.id) {
    return;
  }

  try {
    sessionStorage.setItem(storageKey(work.id), JSON.stringify(work));
  } catch {
    // quota / private mode では無視（APIフォールバック）
  }
}

/** 詳細画面用に一時保存した Work を取り出す（なければ null） */
export function takeSearchDetailWork(identifier: string): Work | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(storageKey(identifier));
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as Work;
  } catch {
    return null;
  }
}
