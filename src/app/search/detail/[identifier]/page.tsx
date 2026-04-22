import { SearchDetailScreen } from "@/components/screens/SearchDetailScreen";
import { getWorkCatalog } from "@/data/repositories/workCatalogRepository";
import { matchesWorkIdentifier } from "@/domain/entities/workIdentifier";
import { Heading, Text, VStack } from "@chakra-ui/react";

type SearchDetailPageProps = {
  params: Promise<{ identifier: string }>;
};

export default async function SearchDetailPage({ params }: SearchDetailPageProps) {
  const { identifier } = await params;
  const decodedIdentifier = decodeURIComponent(identifier);
  const work = getWorkCatalog().find((candidate) => matchesWorkIdentifier(candidate, decodedIdentifier));

  if (!work) {
    return (
      <VStack as="main" align="start" gap="3" px="6" py="10">
        <Heading size="xl">作品が見つかりませんでした</Heading>
        <Text>識別子: {decodedIdentifier}</Text>
      </VStack>
    );
  }

  return <SearchDetailScreen identifier={decodedIdentifier} work={work} />;
}
