import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Daily Expense Tracker - AI-Powered SaaS",
  description: "Track, analyze, and optimize your expenses with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body data-theme="dark" className={inter.className}>
        {children}
      </body>
    </html>
  );
}
