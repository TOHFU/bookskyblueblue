import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  themeColor: "bg",
};

export const metadata: Metadata = {
  title: "Book Sky, Blue Blue",
  description: "青空文庫の本を検索・ダウンロード・閲覧できるWebアプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Book Sky, Blue Blue",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
