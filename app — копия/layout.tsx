import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Hideaway | Holiday Home in Bundoran, Donegal",
  description:
    "A private two-bedroom chalet for up to five guests in Bundoran, County Donegal. Explore real photos and request your stay at The Hideaway.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
