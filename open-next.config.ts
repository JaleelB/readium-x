import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

// NEXT_INC_CACHE_KV aliases the existing article KV namespace in Wrangler.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
