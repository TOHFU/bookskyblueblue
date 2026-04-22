import { NextRequest, NextResponse } from "next/server";
import { getWorkCatalog } from "@/data/repositories/workCatalogRepository";
import { getWorkIdentifier } from "@/domain/entities/workIdentifier";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const offset = parseInteger(searchParams.get("offset"), 0);
  const limit = parseInteger(searchParams.get("limit"), 10);

  const catalog = getWorkCatalog();
  const filtered = query ? catalog.filter((work) => matchesQuery(work, query)) : catalog;

  const items = filtered.slice(offset, offset + limit).map((work) => ({
    ...work,
    identifier: getWorkIdentifier(work),
  }));

  return NextResponse.json({
    items,
    total: filtered.length,
    hasMore: offset + limit < filtered.length,
    nextOffset: offset + items.length,
  });
}

function parseInteger(value: string | null, defaultValue: number): number {
  if (!value) {
    return defaultValue;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultValue;
}

function matchesQuery(work: Record<string, unknown>, query: string): boolean {
  const fields = [
    work.title,
    work.subtitle,
    work.originalTitle,
    work.author,
    work.firstPublishedYear,
    work.writingStyle,
    work.publisher,
    work.sourceBookName,
  ];

  return fields.some((value) => (typeof value === "string" ? value.toLowerCase().includes(query) : false));
}
