import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { GtmLoader } from "./GtmLoader";
import { getInterpolatedColor } from "@/utils/timeBgColor";

export const viewport: Viewport = {
  themeColor: "bg",
};

export const metadata: Metadata = {
  title: "Book Sky, Blue Blue",
  description: "青空文庫の本を検索・ダウンロード・閲覧できるWebアプリ",
  manifest: "/manifest.json",
  openGraph: {
    title: "Book Sky, Blue Blue",
    description: "青空文庫の本を検索・ダウンロード・閲覧できるWebアプリ",
    images: [
      {
        url: "/images/ogp-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Book Sky, Blue Blue OGP image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Sky, Blue Blue",
    description: "青空文庫の本を検索・ダウンロード・閲覧できるWebアプリ",
    images: ["/images/ogp-1200x630.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Book Sky, Blue Blue",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const initialBgColor = getInterpolatedColor(new Date());
  const htmlStyle = {
    "--time-bg-gradient": initialBgColor,
  } as CSSProperties;

  return (
    <html lang="ja" suppressHydrationWarning style={htmlStyle}>
      <head />
      <body suppressHydrationWarning>
        <GtmLoader gtmId="GTM-MFM4MWH4" />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MFM4MWH4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
