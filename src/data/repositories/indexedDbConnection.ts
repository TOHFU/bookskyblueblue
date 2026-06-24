export const DB_NAME = "bookskyblueblue";
export const DB_VERSION = 2;
export const STORE_WORKS = "savedWorks";
export const STORE_BOOK_LAYOUT = "bookLayoutCache";
export const BOOK_LAYOUT_WORK_ID_INDEX = "workId";

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_WORKS)) {
        db.createObjectStore(STORE_WORKS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_BOOK_LAYOUT)) {
        const store = db.createObjectStore(STORE_BOOK_LAYOUT, { keyPath: "id" });
        store.createIndex(BOOK_LAYOUT_WORK_ID_INDEX, "workId", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
