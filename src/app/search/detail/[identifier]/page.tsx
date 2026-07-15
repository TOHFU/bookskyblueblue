import { SearchDetailScreen } from "@/components/screens/SearchDetailScreen";

type SearchDetailPageProps = {
  params: Promise<{ identifier: string }>;
};

/**
 * 詳細はクライアントで session キャッシュ / API から即時表示する。
 * サーバーでの findById 待ちをナビゲーションのクリティカルパスから外す。
 */
export default async function SearchDetailPage({ params }: SearchDetailPageProps) {
  const { identifier } = await params;
  return <SearchDetailScreen identifier={identifier} />;
}
