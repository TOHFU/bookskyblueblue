import { workSchema, type Work } from "@/domain/entities/work";
import type { WorkLibraryRepository } from "@/domain/repositories/workLibraryRepository";
import { deleteBookLayoutCachesForWork } from "@/data/repositories/bookLayoutCacheRepository";
import { openDatabase, STORE_WORKS } from "@/data/repositories/indexedDbConnection";

/** 保存済み作品を全件取得 */
export async function getSavedWorks(): Promise<Work[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_WORKS, "readonly");
    const request = tx.objectStore(STORE_WORKS).getAll();
    request.onsuccess = () => {
      const results = (request.result as unknown[])
        .map((item) => workSchema.safeParse(item))
        .filter((r) => r.success)
        .map((r) => r.data);
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

/** 作品を保存（本文を含む） */
export async function saveWork(work: Work): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_WORKS, "readwrite");
    const request = tx.objectStore(STORE_WORKS).put(work);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/** 作品を削除 */
export async function deleteWork(id: string): Promise<void> {
  const db = await openDatabase();
  await deleteBookLayoutCachesForWork(id);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_WORKS, "readwrite");
    const request = tx.objectStore(STORE_WORKS).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/** 指定IDの作品を取得 */
export async function getWork(id: string): Promise<Work | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_WORKS, "readonly");
    const request = tx.objectStore(STORE_WORKS).get(id);
    request.onsuccess = () => {
      const parsed = workSchema.safeParse(request.result);
      resolve(parsed.success ? parsed.data : null);
    };
    request.onerror = () => reject(request.error);
  });
}

/** 閲覧位置と総ページ数を保存 */
export async function saveReadingPosition(
  workId: string,
  page: number,
  totalPages: number
): Promise<void> {
  const work = await getWork(workId);
  if (!work) return;
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_WORKS, "readwrite");
    const request = tx
      .objectStore(STORE_WORKS)
      .put({ ...work, _readingPage: page, _totalPages: totalPages });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/** 閲覧位置を取得 */
export async function getReadingPosition(workId: string): Promise<number> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_WORKS, "readonly");
    const request = tx.objectStore(STORE_WORKS).get(workId);
    request.onsuccess = () => {
      const data = request.result as Record<string, unknown> | undefined;
      resolve(typeof data?._readingPage === "number" ? data._readingPage : 0);
    };
    request.onerror = () => reject(request.error);
  });
}

/** 閲覧位置と総ページ数を取得 */
export async function getReadingProgress(
  workId: string
): Promise<{ page: number; totalPages: number }> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_WORKS, "readonly");
    const request = tx.objectStore(STORE_WORKS).get(workId);
    request.onsuccess = () => {
      const data = request.result as Record<string, unknown> | undefined;
      resolve({
        page: typeof data?._readingPage === "number" ? data._readingPage : 0,
        totalPages: typeof data?._totalPages === "number" ? data._totalPages : 0,
      });
    };
    request.onerror = () => reject(request.error);
  });
}

export class IndexedDbWorkLibraryRepository implements WorkLibraryRepository {
  async getAll(): Promise<Work[]> {
    return getSavedWorks();
  }

  async getById(identifier: string): Promise<Work | null> {
    return getWork(identifier);
  }

  async save(work: Work): Promise<void> {
    return saveWork(work);
  }

  async remove(identifier: string): Promise<void> {
    return deleteWork(identifier);
  }

  async saveReadingPosition(
    identifier: string,
    page: number,
    totalPages: number
  ): Promise<void> {
    return saveReadingPosition(identifier, page, totalPages);
  }

  async getReadingPosition(identifier: string): Promise<number> {
    return getReadingPosition(identifier);
  }

  async getReadingProgress(
    identifier: string
  ): Promise<{ page: number; totalPages: number }> {
    return getReadingProgress(identifier);
  }
}
