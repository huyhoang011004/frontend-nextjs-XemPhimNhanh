import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { YoutubeLayoutWrapper } from "@/components/ui/youtube-layout-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XemPhimNhanh - Nền tảng xem phim trực tuyến chuẩn YouTube Dark UI",
  description: "Thưởng thức hàng ngàn bộ phim bom tấn, phim bộ, phim lẻ, anime chất lượng Full HD, cập nhật liên tục với tốc độ cao.",
  keywords: ["xem phim", "phim nhanh", "phim hay", "phim vietsub", "xem phim youtube"],
  openGraph: {
    title: "XemPhimNhanh - Nền tảng xem phim trực tuyến chuẩn YouTube",
    description: "Kho phim khổng lồ, xem phim không giật lag với giao diện YouTube Dark Mode hiện đại.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#0f0f0f] text-[#f1f1f1]">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <YoutubeLayoutWrapper>
              {children}
            </YoutubeLayoutWrapper>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
