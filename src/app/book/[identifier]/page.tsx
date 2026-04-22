import { BookScreen } from "@/components/screens/BookScreen";

type BookPageProps = {
  params: Promise<{ identifier: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { identifier } = await params;
  return <BookScreen identifier={identifier} />;
}
