import { workSchema, type Work } from "@/domain/entities/work";

const DB_NAME = "bookskyblueblue";
const DB_VERSION = 1;
const STORE_WORKS = "savedWorks";

/** IndexedDBのデータベースを開く */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_WORKS)) {
        db.createObjectStore(STORE_WORKS, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

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

/** 閲覧位置を保存 */
export async function saveReadingPosition(
  workId: string,
  page: number
): Promise<void> {
  const work = await getWork(workId);
  if (!work) return;
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_WORKS, "readwrite");
    const request = tx
      .objectStore(STORE_WORKS)
      .put({ ...work, _readingPage: page });
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
