import Script from "next/script";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata = {
  title: "우리집 전세, 안전할까? | 깡통전세 위험 진단기",
  description:
    "전세보증금과 지역 시세를 비교해 전세가율을 계산하고 위험 등급을 알려드려요. 회원가입 없이 브라우저에서 바로 계산됩니다.",
  verification: {
    google: "THXiWN5dIVJaU-LdhDkU_bhWB1MikL6K9GEBgQkBSxo",
    other: {
      "google-adsense-account": "ca-pub-8120250118911316",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={notoKr.variable}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8120250118911316"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
