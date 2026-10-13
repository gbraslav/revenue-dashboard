import { list, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
  createdAt: string;
}

/** `<13-digit epoch>-<8 hex>` — lexicographically sortable by time. */
const ID_PATTERN = /^\d{13}-[0-9a-f]{8}$/;

const BLOB_PREFIX = "messages/";
const LOCAL_DIR = path.join(process.cwd(), "data", "messages");

/**
 * Vercel's filesystem is read-only, so persistence moves to Blob whenever a
 * store is wired up. Local dev falls back to plain JSON files under `data/`.
 */
function usingBlob(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID
  );
}

/** Must match the access level the Blob store was created with. */
const BLOB_ACCESS = (process.env.BLOB_ACCESS ?? "private") as
  | "public"
  | "private";

export function newMessageId(): string {
  return `${Date.now()}-${randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

export function isValidMessageId(id: string): boolean {
  return ID_PATTERN.test(id);
}

export async function saveMessage(message: ContactMessage): Promise<void> {
  const body = JSON.stringify(message, null, 2);

  if (usingBlob()) {
    await put(`${BLOB_PREFIX}${message.id}.json`, body, {
      access: BLOB_ACCESS,
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, `${message.id}.json`), body, "utf8");
}

export async function getMessage(id: string): Promise<ContactMessage | null> {
  if (!isValidMessageId(id)) return null;

  if (usingBlob()) {
    // Imported lazily: `get` reaches the network, unlike the local branch.
    const { get } = await import("@vercel/blob");
    const result = await get(`${BLOB_PREFIX}${id}.json`, {
      access: BLOB_ACCESS,
      useCache: false,
    });
    if (!result || result.statusCode !== 200) return null;
    return JSON.parse(await new Response(result.stream).text());
  }

  try {
    const raw = await fs.readFile(path.join(LOCAL_DIR, `${id}.json`), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function listIds(): Promise<string[]> {
  if (usingBlob()) {
    const { blobs } = await list({ prefix: BLOB_PREFIX, limit: 1000 });
    return blobs.map((b) => path.basename(b.pathname, ".json"));
  }

  try {
    const files = await fs.readdir(LOCAL_DIR);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.basename(f, ".json"));
  } catch {
    return [];
  }
}

/** Newest first. One record per file, so this fans out across all of them. */
export async function listMessages(): Promise<ContactMessage[]> {
  const ids = (await listIds()).filter(isValidMessageId).sort().reverse();
  const messages = await Promise.all(ids.map(getMessage));
  return messages.filter((m): m is ContactMessage => m !== null);
}
