import type { Metadata } from "next";
import { Inter, Inria_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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

  authors: [{ name: "UIArchives Team", url: "https://uiarchives.com" }],
  creator: "UIArchives",
  publisher: "UIArchives",

  metadataBase: new URL("https://uiarchives.com"),

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://uiarchives.com",
    title: "UIArchives – Curated UI Components, Tools & Design Systems",
    description:
      "Explore the ultimate archive of UI components, design frameworks, and frontend tools. Save time and elevate your projects with curated UI inspiration.",
    siteName: "UIArchives",
    images: [
      {
        url: "https://uiarchives.com/og-image.png",
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
    creator: "@uiarchives", // change if you have a Twitter handle
    images: ["https://uiarchives.com/og-image.png"],
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
    canonical: "https://uiarchives.com",
  },

  verification: {
    google: "your-google-site-verification-code", // replace with actual code from Search Console
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="swpNY2jMYcXF6ZnIj0SgD6LjvdnVXPIOZ8LlWv0w2CA"
        />
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
            url: "https://uiarchives.com",
            description:
              "Curated collection of UI components, frameworks, and design tools for designers and frontend developers.",
            sameAs: [
              "https://twitter.com/uiarchives",
              "https://github.com/uiarchives",
              "https://www.linkedin.com/company/uiarchives/",
            ],
            potentialAction: {
              "@type": "SearchAction",
              target: "https://uiarchives.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>
      </head>
      <body className={`${inter.variable} ${inriaSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
