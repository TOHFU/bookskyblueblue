import { defaultCache } from "@serwist/next/worker";
import { Serwist, NetworkOnly, StaleWhileRevalidate, type PrecacheEntry } from "serwist";

// Webpackが注入する __SW_MANIFEST の型を定義
declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
};

const serwist = new Serwist({
  precacheEntries: [
    ...(self.__SW_MANIFEST || []),
    { url: "/offline", revision: "1" },
    { url: "/about", revision: "1" },
  ],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // 検索機能はキャッシュ除外
      matcher: ({ url }) => url.pathname.startsWith("/search"),
      handler: new NetworkOnly(),
    },
    {
        // 正規表現で /book/数字 や /book/detail/数字 にマッチさせる
        matcher: ({ url }) => /^\/book\/(\d+)/.test(url.pathname) || /^\/book\/detail\/(\d+)/.test(url.pathname),
        handler: new StaleWhileRevalidate({
        cacheName: "book-pages-cache",
        plugins: [
            {
            cachedResponseWillBeUsed: async ({ cachedResponse }) => {
                return cachedResponse;
            },
            },
        ],
        }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => {
          const url = new URL(request.url);
          return url.pathname.startsWith("/search");
        },
      },
    ],
  },
});

serwist.addEventListeners();