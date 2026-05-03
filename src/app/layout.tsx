import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

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
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <Script id="gtm" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MFM4MWH4');`}
        </Script>
      </head>
      <body>
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
