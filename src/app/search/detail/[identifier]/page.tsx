import { notFound } from "next/navigation";
import { SearchDetailScreen } from "@/components/screens/SearchDetailScreen";
import { serverWorkCatalogRepository } from "@/application/containers/serverWorkContainer";
import { getWorkByIdentifierUseCase } from "@/application/usecases/getWorkByIdentifierUseCase";

type SearchDetailPageProps = {
  params: Promise<{ identifier: string }>;
};

export default async function SearchDetailPage({ params }: SearchDetailPageProps) {
  const { identifier } = await params;
  const work = await getWorkByIdentifierUseCase(
    serverWorkCatalogRepository,
    identifier
  );

  if (!work) {
    notFound();
  }

  return <SearchDetailScreen work={work} />;
}
