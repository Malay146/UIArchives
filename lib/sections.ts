/** Every section of the archive, in navigation order. Client-safe (no data). */
export const SECTIONS = [
  { slug: "resources", href: "/", label: "Resources", blurb: "Tools, libraries and references." },
  { slug: "motion", href: "/motion", label: "Motion", blurb: "Interaction clips worth studying." },
  { slug: "og-images", href: "/og-images", label: "OG Images", blurb: "How sites present themselves when shared." },
  { slug: "app-icons", href: "/app-icons", label: "App Icons", blurb: "iOS and macOS logomarks." },
  { slug: "skills", href: "/skills", label: "Skills", blurb: "Agent skills for design and frontend craft." },
] as const;

export type SectionSlug = (typeof SECTIONS)[number]["slug"];
