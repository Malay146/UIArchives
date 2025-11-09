import type { Metadata } from "next";
import { Inter, Inria_Serif } from "next/font/google";
import "./globals.css";

// Define your fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  variable: "--font-inria-serif",
  weight: ["300", "400", "700"], // optional
  display: "swap",
});

export const metadata: Metadata = {
  title: "UIArchives - Your Ultimate UI Resource Hub",
  description:
    "A curated collection of UI resources, tools, and components for designers and developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inriaSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
