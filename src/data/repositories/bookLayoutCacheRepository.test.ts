import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { StoredBookLayout } from "@/domain/entities/bookLayoutCache";

const idbStore = new Map<string, StoredBookLayout>();
const workIdIndex = new Map<string, Set<string>>();

const { openDatabaseMock } = vi.hoisted(() => ({
  openDatabaseMock: vi.fn(),
}));

function createFakeDatabase() {
  return {
    transaction: () => {
      const tx = {
        oncomplete: null as (() => void) | null,
        onerror: null as (() => void) | null,
        objectStore: () => ({
          get: (key: string) => {
            const request = {
              result: idbStore.get(key),
              onsuccess: null as (() => void) | null,
              onerror: null as (() => void) | null,
            };
            queueMicrotask(() => request.onsuccess?.call(request));
            return request;
          },
          put: (entry: StoredBookLayout) => {
            idbStore.set(entry.id, entry);
            const keys = workIdIndex.get(entry.workId) ?? new Set<string>();
            keys.add(entry.id);
            workIdIndex.set(entry.workId, keys);

            const request = {
              onsuccess: null as (() => void) | null,
              onerror: null as (() => void) | null,
            };
            queueMicrotask(() => request.onsuccess?.call(request));
            return request;
          },
          delete: (key: string) => {
            const entry = idbStore.get(key);
            if (entry) {
              idbStore.delete(key);
              workIdIndex.get(entry.workId)?.delete(key);
            }
            const request = {
              onsuccess: null as (() => void) | null,
              onerror: null as (() => void) | null,
            };
            queueMicrotask(() => request.onsuccess?.call(request));
            return request;
          },
          index: () => ({
            getAllKeys: (workId: string) => {
              const request = {
                result: [...(workIdIndex.get(workId) ?? [])],
                onsuccess: null as (() => void) | null,
                onerror: null as (() => void) | null,
              };
              queueMicrotask(() => request.onsuccess?.call(request));
              return request;
            },
          }),
        }),
      };

      queueMicrotask(() => tx.oncomplete?.call(tx));
      return tx;
    },
  };
}

openDatabaseMock.mockImplementation(() => Promise.resolve(createFakeDatabase()));

vi.mock("@/data/repositories/indexedDbConnection", () => ({
  DB_NAME: "bookskyblueblue",
  DB_VERSION: 2,
  STORE_WORKS: "savedWorks",
  STORE_BOOK_LAYOUT: "bookLayoutCache",
  BOOK_LAYOUT_WORK_ID_INDEX: "workId",
  openDatabase: openDatabaseMock,
}));

import {
  clearBookLayoutMemoryCacheForTests,
  createBookLayoutCacheId,
  deleteBookLayoutCachesForWork,
  getBookLayoutCache,
  saveBookLayoutCache,
} from "./bookLayoutCacheRepository";

function createEntry(overrides: Partial<StoredBookLayout> = {}): StoredBookLayout {
  return {
    id: "work-1:32:600:300",
    workId: "work-1",
    layoutKey: "32:600:300",
    contentHash: "100:abc",
    totalPages: 45,
    totalChunks: 3,
    chunkBoundaries: [],
    updatedAt: 1,
    isComplete: false,
    ...overrides,
  };
}

describe("bookLayoutCacheRepository", () => {
  beforeEach(() => {
    idbStore.clear();
    workIdIndex.clear();
    clearBookLayoutMemoryCacheForTests();
    openDatabaseMock.mockClear();
  });

  afterEach(() => {
    clearBookLayoutMemoryCacheForTests();
  });

  it("createBookLayoutCacheId を生成する", () => {
    expect(createBookLayoutCacheId("work-1", "32:600:300")).toBe("work-1:32:600:300");
  });

  it("save 後の get はメモリキャッシュから返す", async () => {
    const entry = createEntry();

    await saveBookLayoutCache(entry);
    openDatabaseMock.mockClear();

    const cached = await getBookLayoutCache("work-1", "32:600:300", "100:abc");

    expect(openDatabaseMock).not.toHaveBeenCalled();
    expect(cached).toEqual(entry);
  });

  it("contentHash が異なる場合は null を返す", async () => {
    await saveBookLayoutCache(createEntry());

    const cached = await getBookLayoutCache("work-1", "32:600:300", "other-hash");

    expect(cached).toBeNull();
  });

  it("メモリに無い場合は IndexedDB から読み込む", async () => {
    const entry = createEntry();
    idbStore.set(entry.id, entry);
    workIdIndex.set(entry.workId, new Set([entry.id]));

    const cached = await getBookLayoutCache("work-1", "32:600:300", "100:abc");

    expect(openDatabaseMock).toHaveBeenCalled();
    expect(cached).toEqual(entry);
  });

  it("作品削除時にレイアウトキャッシュを削除する", async () => {
    const entry = createEntry();
    await saveBookLayoutCache(entry);

    await deleteBookLayoutCachesForWork("work-1");

    expect(idbStore.has(entry.id)).toBe(false);
    expect(await getBookLayoutCache("work-1", "32:600:300", "100:abc")).toBeNull();
  });
});
