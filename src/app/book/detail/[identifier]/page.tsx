import { TopDetailScreen } from "@/components/screens/TopDetailScreen";

type TopDetailPageProps = {
  params: Promise<{ identifier: string }>;
};

export default async function TopDetailPage({ params }: TopDetailPageProps) {
  const { identifier } = await params;
  return <TopDetailScreen identifier={identifier} />;
}