import type { WorkCatalogRepository } from "@/domain/repositories/workCatalogRepository";

const CHARSET_MAP: Record<string, string> = {
  "JIS X 0208": "shift-jis",
  Unicode: "utf-8",
};

export async function fetchWorkContentUseCase(
  repository: WorkCatalogRepository,
  identifier: string,
  fetcher: typeof fetch = (input, init) => fetch(input, init)
): Promise<{ content: string } | null> {
  const work = await repository.findById(identifier);

  if (!work?.htmlFileUrl) {
    return null;
  }

  const response = await fetcher(work.htmlFileUrl, {
    headers: {
      "User-Agent": "BookSkyBlueBlue/1.0",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(String(response.status));
  }

  const buffer = await response.arrayBuffer();
  const charsetLabel = CHARSET_MAP[work.htmlFileCharset ?? ""] ?? "shift-jis";
  const decoder = new TextDecoder(charsetLabel);

  return { content: decoder.decode(buffer) };
}
