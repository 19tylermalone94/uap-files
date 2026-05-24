import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import NoiseOverlay from "@/components/layout/NoiseOverlay";
import ScanlineOverlay from "@/components/layout/ScanlineOverlay";

export const metadata: Metadata = {
  title: "PROJECT LOOKING GLASS // DECLASSIFIED UAP FILES",
  description:
    "Browse declassified UAP government documents released May 2025. Videos, PDFs, and images from official government sources.",
  keywords: ["UAP", "UFO", "declassified", "government", "documents", "Pentagon"],
  openGraph: {
    title: "PROJECT LOOKING GLASS // DECLASSIFIED UAP FILES",
    description: "Browse declassified UAP government documents released May 2025.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-terminal font-mono antialiased">
        <NoiseOverlay />
        <ScanlineOverlay />
        <NavBar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
