/**
 * OG Images — Open Graph cards (the image a link turns into when shared),
 * curated by hand.
 *
 * To add one:
 *  1. Save the image as WebP in /public/og-images/<id>.webp (1200 × 630 is
 *     the standard size; other sizes are shown at their own ratio).
 *  2. Add an entry below. `style`, `theme` and `industry` drive the filters.
 */

export const OG_STYLES = ["Typography", "Product Shot", "Illustration", "3D", "Photography", "Gradient", "Minimal"] as const;
export const OG_THEMES = ["Light", "Dark"] as const;

export type OgImage = {
  id: string;
  /** Product or site name. */
  title: string;
  /** The page the card belongs to. */
  url: string;
  image: string;
  width: number;
  height: number;
  style: string[];
  theme: "Light" | "Dark";
  /** e.g. "SaaS", "Developer Tools", "Design", "AI", "Portfolio". */
  industry: string;
  /** Title and description the page shares alongside the image. */
  pageTitle?: string;
  pageDescription?: string;
  added: string;
};

export const ogImages: OgImage[] = [
  {
    id: "uiarchives",
    title: "UIArchives",
    url: "https://uiarchives.com",
    image: "/og-images/uiarchives.webp",
    width: 1200,
    height: 630,
    style: ["Typography", "Minimal"],
    theme: "Light",
    industry: "Design",
    pageTitle: "UIArchives — An archive for people who make interfaces.",
    pageDescription: "Resources, designs, OG images, app icons and skills.",
    added: "2026-11-13",
  },
  {
    id: "shotbase",
    title: "Shotbase",
    url: "https://shotbase.com",
    image: "/og-images/shotbase.webp",
    width: 1200,
    height: 630,
    style: ["Typography", "Gradient"],
    theme: "Dark",
    industry: "Productivity",
    pageTitle: "Shotbase — Capture, Record, Edit, and Share in One Place",
    pageDescription:
      "Shotbase is a modern screen capture workspace for macOS. Capture, edit, organize, and share screenshots and recordings from one fast, streamlined workflow.",
    added: "2026-11-13",
  },
  {
    id: "dialkit",
    title: "DialKit",
    url: "https://www.dialkit.dev",
    image: "/og-images/dialkit.webp",
    width: 1200,
    height: 765,
    style: ["Typography", "Product Shot"],
    theme: "Dark",
    industry: "Developer Tools",
    pageTitle: "DialKit — Tune interfaces in real time",
    pageDescription: "Make the details feel right. DialKit puts live controls beside the interface you’re building.",
    added: "2026-11-13",
  },
  {
    id: "framer",
    title: "Framer",
    url: "https://www.framer.com",
    image: "/og-images/framer.webp",
    width: 1200,
    height: 630,
    style: ["Product Shot"],
    theme: "Dark",
    industry: "Design",
    pageTitle: "Framer: Free website builder and AI design agent",
    pageDescription:
      "The free website builder with a design agent that takes you from idea to launch. Changes stay editable, with hosting, CMS, analytics, SEO, and AEO built in.",
    added: "2026-11-13",
  },
  {
    id: "cosmos",
    title: "Cosmos",
    url: "https://www.cosmos.so",
    image: "/og-images/cosmos.webp",
    width: 1200,
    height: 630,
    style: ["Minimal", "Photography"],
    theme: "Light",
    industry: "Inspiration",
    pageTitle: "Cosmos",
    pageDescription: "Your space for inspiration",
    added: "2026-11-13",
  },
  {
    id: "interfere-design",
    title: "Interfere Design System",
    url: "https://design.interfere.com",
    image: "/og-images/interfere.webp",
    width: 1200,
    height: 630,
    style: ["Typography", "Product Shot"],
    theme: "Light",
    industry: "Design Systems",
    pageTitle: "Interfere Design System",
    pageDescription: "Components, styles and guidelines for building Interfere products.",
    added: "2026-11-13",
  },
];
