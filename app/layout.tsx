import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-geist-sans",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "AD Systems - מערכות רכב מתקדמות",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "מערכות רכב מתקדמות - מולטימדיה, מצלמות, חיישנים ואביזרים לרכב",
  keywords: ["מערכות רכב", "מולטימדיה", "GPS", "חיישנים", "מצלמות רכב", "אביזרים לרכב"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
