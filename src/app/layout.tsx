import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { weddingData } from "@/data/wedding";
import "./globals.css";

const { groom, bride } = weddingData;

export const metadata: Metadata = {
  title: `Thiệp cưới ${groom.shortName} & ${bride.shortName}`,
  description: `Trân trọng kính mời quý khách đến dự lễ cưới của ${groom.fullName} & ${bride.fullName}.`,
  openGraph: {
    title: `Thiệp cưới ${groom.shortName} & ${bride.shortName}`,
    description: "Trân trọng kính mời!",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#800000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={fontVariables}>
      <body suppressHydrationWarning className="bg-[#e8dfd0] antialiased">
        {children}
      </body>
    </html>
  );
}
