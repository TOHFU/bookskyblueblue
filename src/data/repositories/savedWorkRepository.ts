"use client";

import { getWorkIdentifier } from "@/domain/entities/workIdentifier";
import type { Work } from "@/domain/entities/work";

const DB_NAME = "book-sky-blue-blue";
const STORE_NAME = "savedWorks";
const DB_VERSION = 1;

type StoredWork = Work & {
  identifier: string;
  savedAt: number;
};

export async function listSavedWorks(): Promise<StoredWork[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();

    req.onsuccess = () => {
      const result = Array.isArray(req.result) ? (req.result as StoredWork[]) : [];
      resolve(result.sort((a, b) => b.savedAt - a.savedAt));
    };

    req.onerror = () => reject(req.error ?? new Error("Failed to list saved works"));
  });
}

export async function getSavedWork(identifier: string): Promise<StoredWork | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(identifier);

    req.onsuccess = () => resolve((req.result as StoredWork | undefined) ?? null);
    req.onerror = () => reject(req.error ?? new Error("Failed to get saved work"));
  });
}

export async function saveWork(work: Work): Promise<StoredWork> {
  const db = await openDatabase();
  const payload: StoredWork = {
    ...work,
    identifier: getWorkIdentifier(work),
    savedAt: Date.now(),
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const req = tx.objectStore(STORE_NAME).put(payload);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error ?? new Error("Failed to save work"));
  });

  return payload;
}

export async function deleteSavedWork(identifier: string): Promise<void> {
  const db = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const req = tx.objectStore(STORE_NAME).delete(identifier);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error ?? new Error("Failed to delete saved work"));
  });
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available in this environment"));
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "identifier" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Failed to open IndexedDB"));
  });

  return dbPromise;
}
