import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { AppData } from "../types";
import { defaultData } from "./storage";

/**
 * Single source of truth for persistence.
 *
 * - Data lives in IndexedDB (one record, key "data").
 * - Each write is a single atomic `put` of the whole record, so a partial /
 *   interrupted write can never corrupt the store.
 * - A one-time migration imports any legacy localStorage data.
 * - `migrate()` is the content-migration seam: bump SCHEMA_VERSION and branch
 *   on the stored version to evolve the shape without ever wiping data.
 * - If IndexedDB is unavailable (rare: private mode / old browser) we fall
 *   back to localStorage so the app still works.
 */

const DB_NAME = "headroom";
const STORE = "app";
const KEY = "data";
const LEGACY_KEY = "safespend-data";
export const SCHEMA_VERSION = 1;

type StoredData = AppData & { schemaVersion?: number };

interface HeadroomDB extends DBSchema {
  app: { key: string; value: StoredData };
}

let dbPromise: Promise<IDBPDatabase<HeadroomDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<HeadroomDB>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      },
    });
  }
  return dbPromise;
}

/** Bring any older / partial shape up to the current schema. */
export function migrate(raw: Partial<StoredData> | undefined | null): AppData {
  const merged: AppData = { ...defaultData, ...(raw ?? {}) };

  // --- content migrations would branch on raw?.schemaVersion here ---
  // e.g. if ((raw?.schemaVersion ?? 0) < 2) { ...reshape... }

  // Re-derive onboarding gates so a setup-complete user never gets bounced
  // back into onboarding after an update.
  if (merged.setupComplete) {
    merged.welcomeSeen = true;
    merged.onboardingComplete = true;
    merged.signedUp = true;
    merged.permissionsSeen = true;
    merged.allSetSeen = true;
  } else if (merged.welcomeSeen && !merged.onboardingComplete) {
    merged.onboardingComplete = true;
  }

  return merged;
}

/** Load on startup. Migrates legacy localStorage data on first run. */
export async function initData(): Promise<AppData> {
  try {
    const db = await getDB();
    let stored = await db.get(STORE, KEY);

    if (!stored) {
      const legacy = readLegacy();
      if (legacy) {
        const migrated = migrate(legacy);
        await db.put(STORE, { ...migrated, schemaVersion: SCHEMA_VERSION }, KEY);
        try {
          localStorage.removeItem(LEGACY_KEY);
        } catch {
          /* ignore */
        }
        return migrated;
      }
      return { ...defaultData };
    }

    return migrate(stored);
  } catch {
    // IndexedDB blocked — degrade to localStorage.
    return readLegacy() ? migrate(readLegacy()) : { ...defaultData };
  }
}

/** Persist the whole record atomically. */
export async function persist(data: AppData): Promise<void> {
  const record: StoredData = { ...data, schemaVersion: SCHEMA_VERSION };
  try {
    const db = await getDB();
    await db.put(STORE, record, KEY);
  } catch {
    try {
      localStorage.setItem(LEGACY_KEY, JSON.stringify(data));
    } catch {
      /* nowhere left to write */
    }
  }
}

/** Wipe everything (used by "Delete data & start over"). */
export async function clearData(): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE, KEY);
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* ignore */
  }
}

function readLegacy(): Partial<StoredData> | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Download a JSON backup. */
function backupFilename() {
  return `headroom-backup-${new Date().toISOString().slice(0, 10)}.json`;
}

export function exportData(data: AppData): void {
  const payload = {
    app: "headroom",
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = backupFilename();
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Parse + validate an imported backup file. Throws on anything unusable. */
export function parseImport(text: string): AppData {
  const parsed = JSON.parse(text);
  const payload = parsed?.data ?? parsed; // accept wrapped or raw AppData
  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.balance !== "number" ||
    !Array.isArray(payload.bills)
  ) {
    throw new Error("Not a Headroom backup file");
  }
  return migrate(payload);
}
