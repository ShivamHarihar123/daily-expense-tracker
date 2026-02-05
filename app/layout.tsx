import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import "./globals.scss";

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
    <html lang="en">
      <body data-theme="dark">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
