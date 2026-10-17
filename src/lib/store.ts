import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Tiny key/value persistence for admin-managed content.
 *
 *  1. Upstash Redis over REST (production; serverless friendly). Vercel's Upstash integration
 *     provides KV_REST_API_URL / KV_REST_API_TOKEN; UPSTASH_REDIS_REST_* also work.
 *  2. A directory on disk (local development, or a VPS/Docker volume): ADMIN_DATA_DIR,
 *     defaulting to ./data outside production.
 *  Returns null when neither is available, so the admin can say so instead of failing silently.
 */
export type Store = {
  kind: "redis" | "file";
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
};

const env = (k: string) => process.env[k]?.trim() || undefined;

function redisStore(url: string, token: string): Store {
  const run = async (command: string[]) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(10_000),
    });
    const json = (await res.json().catch(() => ({}))) as { result?: unknown; error?: string };
    if (!res.ok || json.error) throw new Error(`Storage error (${res.status})`);
    return json.result;
  };
  return {
    kind: "redis",
    get: async (key) => ((await run(["GET", key])) as string | null) ?? null,
    set: async (key, value) => void (await run(["SET", key, value])),
    del: async (key) => void (await run(["DEL", key])),
  };
}

function fileStore(dir: string): Store {
  const file = (key: string) => path.join(dir, encodeURIComponent(key));
  return {
    kind: "file",
    get: async (key) => {
      try {
        return await readFile(file(key), "utf8");
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw e;
      }
    },
    set: async (key, value) => {
      await mkdir(dir, { recursive: true });
      await writeFile(file(key), value, { mode: 0o600 });
    },
    del: async (key) => {
      await rm(file(key), { force: true });
    },
  };
}

let cached: Store | null | undefined;
export function getStore(): Store | null {
  if (cached !== undefined) return cached;
  const url = env("KV_REST_API_URL") ?? env("UPSTASH_REDIS_REST_URL");
  const token = env("KV_REST_API_TOKEN") ?? env("UPSTASH_REDIS_REST_TOKEN");
  const dir = env("ADMIN_DATA_DIR") ?? (process.env.NODE_ENV !== "production" ? "./data" : undefined);
  cached = url && token ? redisStore(url.replace(/\/$/, ""), token) : dir ? fileStore(path.resolve(/*turbopackIgnore: true*/ dir)) : null;
  return cached;
}
