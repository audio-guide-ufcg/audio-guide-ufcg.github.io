import type { Metadata, Viewport } from "next";
import "./globals.css";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#087f78",
};
export const metadata: Metadata = {
  title: "AudioGuide · Descubra Campina Grande",
  description:
    "Explore lugares, ouça histórias e descubra Campina Grande no seu ritmo.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
