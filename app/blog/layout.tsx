import { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export const metadata: Metadata = {
  title: "Journal — UIArchives",
  description:
    "Notes on interface design, frontend tooling and the resources worth knowing.",
  openGraph: {
    title: "Journal — UIArchives",
    description:
      "Notes on interface design, frontend tooling and the resources worth knowing.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Journal — UIArchives",
    description:
      "Notes on interface design, frontend tooling and the resources worth knowing.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
