import { NextResponse } from "next/server";
import { getWorkCatalog } from "@/data/repositories/workCatalogRepository";
import { matchesWorkIdentifier, getWorkIdentifier } from "@/domain/entities/workIdentifier";

type Params = {
  params: Promise<{ identifier: string }>;
};

export async function GET(_: Request, context: Params) {
  const { identifier } = await context.params;
  const decodedIdentifier = decodeURIComponent(identifier);
  const work = getWorkCatalog().find((candidate) => matchesWorkIdentifier(candidate, decodedIdentifier));

  if (!work) {
    return NextResponse.json({ message: "Work not found" }, { status: 404 });
  }

  return NextResponse.json({ ...work, identifier: getWorkIdentifier(work) });
}
