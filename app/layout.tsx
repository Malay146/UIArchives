import type { Metadata } from "next";
import { Inter, Inria_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

// -------------------------------
// Fonts
// -------------------------------
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  variable: "--font-inria-serif",
  weight: ["300", "400", "700"],
  display: "swap",
});

// -------------------------------
// Environment Variables
// -------------------------------
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://uiarchives.com";
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;

// -------------------------------
// SEO Metadata
// -------------------------------
export const metadata: Metadata = {
  title:
    "UIArchives – Curated UI Components, Design Tools & Frontend Resources",
  description:
    "Discover the best UI components, frameworks, and design tools for modern developers and designers. Explore curated resources to build beautiful, responsive, and consistent interfaces faster.",

  keywords: [
    "UI components",
    "UI resources",
    "UI design tools",
    "frontend libraries",
    "React UI components",
    "Tailwind components",
    "design systems",
    "component libraries",
    "UI inspiration",
    "developer resources",
    "frontend tools",
    "open source UI kits",
    "Next.js UI components",
  ],

  authors: [{ name: "UIArchives Team", url: SITE_URL }],
  creator: "UIArchives",
  publisher: "UIArchives",

  metadataBase: new URL(SITE_URL),

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "UIArchives – Curated UI Components, Tools & Design Systems",
    description:
      "Explore the ultimate archive of UI components, design frameworks, and frontend tools. Save time and elevate your projects with curated UI inspiration.",
    siteName: "UIArchives",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "UIArchives – Curated UI Components and Design Tools",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "UIArchives – Curated UI Components, Tools & Design Systems",
    description:
      "Find the best UI resources, design systems, and frontend components curated for modern developers and designers.",
    creator: "@uiarchives",
    images: [`${SITE_URL}/og-image.png`],
  },

  icons: {
    icon: [
      { url: "/favicon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  category: "Web Development",

  alternates: {
    canonical: SITE_URL,
  },

  verification: {
    google: GOOGLE_VERIFICATION,
  },
};

// -------------------------------
// Layout Component
// -------------------------------
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* ✅ Manual Meta Description (Visible to Lighthouse) */}
        <meta
          name="description"
          content="Discover the best UI components, frameworks, and design tools for modern developers and designers. Explore curated resources to build beautiful, responsive, and consistent interfaces faster."
        />

        {/* Google Site Verification */}
        <meta name="google-site-verification" content={GOOGLE_VERIFICATION} />

        {/* Light & Dark Favicons */}
        <link
          rel="icon"
          href="/favicon-light.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/favicon-dark.png"
          media="(prefers-color-scheme: dark)"
        />

        {/* JSON-LD Structured Data for Google */}
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "UIArchives",
            url: SITE_URL,
            description:
              "Curated collection of UI components, frameworks, and design tools for designers and frontend developers.",
            sameAs: [
              "https://twitter.com/uiarchives",
              "https://github.com/uiarchives",
              "https://www.linkedin.com/company/uiarchives/",
            ],
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>
      </head>

      <body className={`${inter.variable} ${inriaSerif.variable} antialiased selection:bg-zinc-300 selection:text-zinc-950`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
