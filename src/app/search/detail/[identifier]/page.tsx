import { notFound } from "next/navigation";
import { getWorkCatalog } from "@/data/repositories/workCatalogRepository";
import { SearchDetailScreen } from "@/components/screens/SearchDetailScreen";

type SearchDetailPageProps = {
  params: Promise<{ identifier: string }>;
};

export default async function SearchDetailPage({ params }: SearchDetailPageProps) {
  const { identifier } = await params;
  const catalog = getWorkCatalog();
  const work = catalog.find((w) => w.id === identifier);

  if (!work) {
    notFound();
  }

  return <SearchDetailScreen work={work} />;
}
