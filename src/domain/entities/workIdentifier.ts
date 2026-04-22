import type { Work } from "@/domain/entities/work";

export function getWorkIdentifier(work: Work): string {
  const id = normalizePart(work.id);
  if (id) {
    return id;
  }

  const title = normalizePart(work.title);
  const author = normalizePart(work.author);
  const fallback = [title, author].filter(Boolean).join("::");
  return fallback || "unknown-work";
}

export function matchesWorkIdentifier(work: Work, identifier: string): boolean {
  return getWorkIdentifier(work) === identifier;
}

function normalizePart(value: string | undefined): string {
  if (!value) {
    return "";
  }

  return value.trim();
}
