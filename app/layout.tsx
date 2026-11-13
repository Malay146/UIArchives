import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SoundProvider } from "@/components/site/sound-provider";
import { CommandMenu } from "@/components/command/command-menu";
import { getAllPosts } from "@/lib/blog";

// -------------------------------
// Fonts — Geist only
// -------------------------------
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Applies the saved or system theme before first paint, so there is no flash.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`;

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
    "UIArchives — An index for people who make interfaces",
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
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "UIArchives — An archive for people who make interfaces.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "UIArchives – Curated UI Components, Tools & Design Systems",
    description:
      "Find the best UI resources, design systems, and frontend components curated for modern developers and designers.",
    creator: "@pmalay694",
    site: "@pmalay694",
    images: [`${SITE_URL}/og.png`],
  },

  icons: {
    icon: [
      { url: "/faviconLight.png", media: "(prefers-color-scheme: light)" },
      { url: "/faviconDark.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* ✅ Manual Meta Description (Visible to Lighthouse) */}
        <meta
          name="description"
          content="Discover the best UI components, frameworks, and design tools for modern developers and designers. Explore curated resources to build beautiful, responsive, and consistent interfaces faster."
        />

        {/* Google Site Verification */}
        <meta name="google-site-verification" content={GOOGLE_VERIFICATION} />

        <meta property="og:image" content="https://uiarchives.com/og.png" />
        <meta name="twitter:image" content="https://uiarchives.com/og.png" />

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

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <SoundProvider />
        <CommandMenu
          posts={getAllPosts().map((p) => ({
            slug: p.slug,
            title: p.frontmatter.title,
            category: p.frontmatter.category,
            date: p.frontmatter.date,
            description: p.frontmatter.description || p.frontmatter.excerpt || "",
            readingTime: p.readingTime,
          }))}
        />
      </body>
    </html>
  );
}
