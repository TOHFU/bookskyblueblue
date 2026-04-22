import { DownloadScreen } from "@/components/screens/DownloadScreen";

type DownloadPageProps = {
  params: Promise<{ identifier: string }>;
};

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { identifier } = await params;
  return <DownloadScreen identifier={identifier} />;
}
