import { DownloadScreen } from "@/components/screens/DownloadScreen";
import { getWorkCatalog } from "@/data/repositories/workCatalogRepository";
import { matchesWorkIdentifier } from "@/domain/entities/workIdentifier";

type DownloadPageProps = {
  params: Promise<{ identifier: string }>;
};

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { identifier } = await params;
  const decodedIdentifier = decodeURIComponent(identifier);
  const initialWork = getWorkCatalog().find((candidate) => matchesWorkIdentifier(candidate, decodedIdentifier)) ?? null;

  return <DownloadScreen identifier={decodedIdentifier} initialWork={initialWork} />;
}
