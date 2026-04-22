import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Provider } from "@/components/ui/provider";

export const metadata: Metadata = {
  title: "Book Sky, Blue Blue",
  description: "青空文庫の本を検索・ダウンロード・閲覧できるWebアプリ",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/pwa-512x512.png",
    apple: "/icons/pwa-512x512.png",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
