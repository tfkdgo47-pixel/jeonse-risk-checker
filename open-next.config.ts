import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// ISR/재검증 없는 단순 앱이라 기본 설정(R2 캐시 등 없이)으로 충분하다.
export default defineCloudflareConfig();
