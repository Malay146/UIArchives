"use client";

import { useRef } from "react";
import Navbar from "@/components/navbar";
import Background from "@/components/background";
import SunEffect from "@/components/sun-effect";
import FilterSearch from "@/components/filter-search";
import CTA from "@/components/cta";
import Metric from "@/components/metric";
import Hero from "@/components/hero";
import { BlogCTASection } from "@/components/blog-cta-section";

export default function Home() {
  const filterRef = useRef<HTMLDivElement>(null);

  // Smooth Scroll to Filter Section with offset
  const handleExploreClick = () => {
    if (filterRef.current) {
      const elementPosition =
        filterRef.current.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - 20; // 20px top margin

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const paragraphText =
    "Explore a universe of tools, frameworks, and components — all in one place. Just search what you need, and get instant access to the best resources.";
  const paragraphWords = paragraphText.split(" ");

  return (
    <div className="w-full relative min-h-screen">
      <Background />
      <SunEffect />

      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <Navbar />
        <div className="hero-section flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-6 pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24">
          <Hero />
          <CTA onExploreClick={handleExploreClick} />
          <Divider />
          <Metric />
          <FilterSearch ref={filterRef} />
          <BlogCTASection />
        </div>
      </div>
    </div>
  );
}

const Divider = () => {
  return (
    <div className="divider border-t border-zinc-800 w-full max-w-xl h-px mt-3 sm:mt-4" />
  );
};
