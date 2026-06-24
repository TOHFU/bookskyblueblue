import type { StoredBookLayout } from "@/domain/entities/bookLayoutCache";
import {
  BOOK_LAYOUT_WORK_ID_INDEX,
  openDatabase,
  STORE_BOOK_LAYOUT,
} from "@/data/repositories/indexedDbConnection";

const MEMORY_CACHE_LIMIT = 8;
const memoryCache = new Map<string, StoredBookLayout>();

function rememberInMemoryCache(entry: StoredBookLayout): void {
  if (memoryCache.has(entry.id)) {
    memoryCache.delete(entry.id);
  }
  memoryCache.set(entry.id, entry);

  while (memoryCache.size > MEMORY_CACHE_LIMIT) {
    const oldestKey = memoryCache.keys().next().value;
    if (!oldestKey) {
      break;
    }
    memoryCache.delete(oldestKey);
  }
}

function readFromMemoryCache(
  workId: string,
  layoutKey: string,
  contentHash: string
): StoredBookLayout | null {
  const entry = memoryCache.get(createBookLayoutCacheId(workId, layoutKey));
  if (!entry || entry.contentHash !== contentHash) {
    return null;
  }

  return entry;
}

export function createBookLayoutCacheId(workId: string, layoutKey: string): string {
  return `${workId}:${layoutKey}`;
}

export async function getBookLayoutCache(
  workId: string,
  layoutKey: string,
  contentHash: string
): Promise<StoredBookLayout | null> {
  const cached = readFromMemoryCache(workId, layoutKey, contentHash);
  if (cached) {
    return cached;
  }

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOK_LAYOUT, "readonly");
    const request = tx
      .objectStore(STORE_BOOK_LAYOUT)
      .get(createBookLayoutCacheId(workId, layoutKey));

    request.onsuccess = () => {
      const entry = request.result as StoredBookLayout | undefined;
      if (!entry || entry.contentHash !== contentHash) {
        resolve(null);
        return;
      }
      rememberInMemoryCache(entry);
      resolve(entry);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveBookLayoutCache(entry: StoredBookLayout): Promise<void> {
  rememberInMemoryCache(entry);

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOK_LAYOUT, "readwrite");
    const request = tx.objectStore(STORE_BOOK_LAYOUT).put(entry);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteBookLayoutCachesForWork(workId: string): Promise<void> {
  for (const [key, entry] of memoryCache) {
    if (entry.workId === workId) {
      memoryCache.delete(key);
    }
  }

  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOK_LAYOUT, "readwrite");
    const store = tx.objectStore(STORE_BOOK_LAYOUT);
    const index = store.index(BOOK_LAYOUT_WORK_ID_INDEX);
    const request = index.getAllKeys(workId);

    request.onsuccess = () => {
      const keys = request.result as string[];
      keys.forEach((key) => {
        store.delete(key);
      });
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** テスト用: メモリキャッシュをクリアする */
export function clearBookLayoutMemoryCacheForTests(): void {
  memoryCache.clear();
}
