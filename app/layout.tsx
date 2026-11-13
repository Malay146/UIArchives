import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL(SITE_URL),
  // Pages set their own title; the brand is appended once, here.
  title: {
    default: "UIArchives — Curated design resources for people who make interfaces",
    template: "%s | UIArchives",
  },
  description:
    "A hand-picked archive of UI resources, design videos, OG images, app icons and agent skills for designers and frontend developers. Every entry chosen by hand.",
  applicationName: "UIArchives",
  authors: [{ name: "Malay Patel", url: "https://x.com/pmalay694" }],
  creator: "UIArchives",
  publisher: "UIArchives",
  // No site-wide canonical: every page declares its own (a shared one would
  // point all pages at the homepage).
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "UIArchives",
    title: "UIArchives — Curated design resources for people who make interfaces",
    description:
      "Resources, design videos, OG images, app icons and agent skills — hand-picked for designers and frontend developers.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "UIArchives — a curated archive for people who make interfaces." }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@pmalay694",
    site: "@pmalay694",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: [
      { url: "/faviconLight.png", media: "(prefers-color-scheme: light)" },
      { url: "/faviconDark.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  category: "Design",
  ...(GOOGLE_VERIFICATION ? { verification: { google: GOOGLE_VERIFICATION } } : {}),
};

/** Site-wide structured data: who publishes the site, and the site itself. */
const SITE_JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "UIArchives",
    url: SITE_URL,
    logo: `${SITE_URL}/faviconLight.png`,
    sameAs: ["https://x.com/pmalay694", "https://github.com/Malay146/UIArchives"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "UIArchives",
    url: SITE_URL,
    description:
      "A hand-picked archive of UI resources, design videos, OG images, app icons and agent skills for designers and frontend developers.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  },
];

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD).replace(/</g, "\\u003c") }}
        />
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
