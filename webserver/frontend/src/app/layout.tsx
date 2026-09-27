import type { Metadata } from "next";

import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "ReelFinder";

export const metadata: Metadata = {
  title: appName,
  description: "Find your next movie with natural-language search and recommendations shaped by your taste."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
