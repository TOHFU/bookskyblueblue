import type { StoredBookLayout } from "@/domain/entities/bookLayoutCache";
import {
  BOOK_LAYOUT_WORK_ID_INDEX,
  openDatabase,
  STORE_BOOK_LAYOUT,
} from "@/data/repositories/indexedDbConnection";

export function createBookLayoutCacheId(workId: string, layoutKey: string): string {
  return `${workId}:${layoutKey}`;
}

export async function getBookLayoutCache(
  workId: string,
  layoutKey: string,
  contentHash: string
): Promise<StoredBookLayout | null> {
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
      resolve(entry);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveBookLayoutCache(entry: StoredBookLayout): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOK_LAYOUT, "readwrite");
    const request = tx.objectStore(STORE_BOOK_LAYOUT).put(entry);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteBookLayoutCachesForWork(workId: string): Promise<void> {
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
