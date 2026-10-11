import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";

const CHARSET_MAP: Record<string, string> = {
  "JIS X 0208": "shift-jis",
  Unicode: "utf-8",
};

function validateWorkContentUrl(value: string): URL {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.hostname !== "www.aozora.gr.jp" ||
    url.port !== "" ||
    url.username !== "" ||
    url.password !== "" ||
    !url.pathname.startsWith("/cards/") ||
    !url.pathname.endsWith(".html") ||
    url.search !== "" ||
    url.hash !== ""
  ) {
    throw new Error("作品本文のURLが許可されていません");
  }

  return url;
}

export async function fetchWorkContentUseCase(
  repository: WorkCatalogRepository,
  identifier: string,
  fetcher: typeof fetch = (input, init) => fetch(input, init)
): Promise<{ content: string } | null> {
  const work = await repository.findById(identifier);

  if (!work?.htmlFileUrl) {
    return null;
  }

  const url = validateWorkContentUrl(work.htmlFileUrl);
  const response = await fetcher(url, {
    headers: {
      "User-Agent": "BookSkyBlueBlue/1.0",
    },
    signal: AbortSignal.timeout(10000),
    redirect: "error",
  });

  if (!response.ok) {
    throw new Error(String(response.status));
  }

  const buffer = await response.arrayBuffer();
  const charsetLabel = CHARSET_MAP[work.htmlFileCharset ?? ""] ?? "shift-jis";
  const decoder = new TextDecoder(charsetLabel);

  return { content: decoder.decode(buffer) };
}
