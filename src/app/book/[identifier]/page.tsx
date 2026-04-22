import { BookReaderScreen } from "@/components/screens/BookReaderScreen";
import { getWorkCatalog } from "@/data/repositories/workCatalogRepository";
import { matchesWorkIdentifier } from "@/domain/entities/workIdentifier";

type BookPageProps = {
  params: Promise<{ identifier: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { identifier } = await params;
  const decodedIdentifier = decodeURIComponent(identifier);
  const initialWork = getWorkCatalog().find((candidate) => matchesWorkIdentifier(candidate, decodedIdentifier)) ?? null;

  return <BookReaderScreen identifier={decodedIdentifier} initialWork={initialWork} />;
}
