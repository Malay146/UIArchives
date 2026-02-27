import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Blog | Modern Next.js 14",
  description:
    "Read the latest engineering articles on web development, system architecture, and modern scalable applications.",
  openGraph: {
    title: "Engineering Blog | Modern Next.js 14",
    description:
      "Read the latest engineering articles on web development, system architecture, and modern scalable applications.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Blog | Modern Next.js 14",
    description:
      "Read the latest engineering articles on web development, system architecture, and modern scalable applications.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
