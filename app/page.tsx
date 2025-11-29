"use client";

import React, { useMemo, useState, useRef, useEffect, use } from "react";
import UiCard, { UiCardData } from "@/components/UiCard";
import Silk from "@/components/Silk";
import Link from "next/link";
import Fuse from "fuse.js";
import Button1 from "@/components/ui-components/Button1";
import Button2 from "@/components/ui-components/Button2";
import Navbar from "@/components/Navbar";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { cardData } from "../data/cardData";
import Background from "@/components/Background";
import GoUpArrowIcon from "@/components/Icons/GoUpArrowIcon";
import SunEffect from "@/components/SunEffect";

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filterRef = useRef<HTMLDivElement>(null);
  const goUpButtonRef = useRef<HTMLDivElement>(null);

  // Register GSAP ScrollToPlugin on mount
  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);

    // Initially hide the go-up button
    if (goUpButtonRef.current) {
      gsap.set(goUpButtonRef.current, {
        opacity: 0,
        filter: "blur(10px)",
        pointerEvents: "none",
      });
    }
  }, []);

  // Handle scroll to show/hide go-up button
  useEffect(() => {
    const handleScroll = () => {
      if (!filterRef.current || !goUpButtonRef.current) return;

      const scrollY = window.scrollY || window.pageYOffset;

      // Get the absolute bottom position of the filter section
      const filterTop = filterRef.current.offsetTop;
      const filterHeight = filterRef.current.offsetHeight;
      const filterBottom = filterTop + filterHeight;

      // Check if scrolled past the filter section (with a small threshold)
      const isPastFilter = scrollY > filterBottom - 50;

      if (isPastFilter) {
        // Show button with fade and blur animation
        gsap.to(goUpButtonRef.current, {
          opacity: 1,
          filter: "blur(0px)",
          pointerEvents: "auto",
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        // Hide button with fade and blur animation
        gsap.to(goUpButtonRef.current, {
          opacity: 0,
          filter: "blur(10px)",
          pointerEvents: "none",
          duration: 0.5,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  // GSAP Text Animation
  useEffect(() => {
    gsap.registerPlugin(SplitText);

    const titleChars = new SplitText(titleRef.current, {
      type: "words, chars",
    });
    const pChars = new SplitText(pRef.current, { type: "words" });
    const ctx = gsap.context(() => {
      gsap.from(titleChars.chars, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.07,
        filter: "blur(25px)",
        ease: "power3.out",
      });
      gsap.from(pChars.words, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.07,
        filter: "blur(25px)",
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  // Smooth Scroll to Filter Section
  const handleExploreClick = () => {
    if (filterRef.current) {
      gsap.to(window, {
        duration: 0.1,
        scrollTo: {
          y: filterRef.current,
          offsetY: 15, // Offset from top
        },
        ease: "power3.inOut",
      });
    }
  };

  // Smooth Scroll to Top of Filter Section
  const handleGoUpClick = () => {
    if (filterRef.current) {
      gsap.to(window, {
        duration: 0.1,
        delay: 0.1,
        scrollTo: {
          y: filterRef.current,
          offsetY: 15, // Offset from top
        },
        ease: "power2.inOut",
      });
    }
  };

  const fuseOptions = {
    keys: [
      { name: "title", weight: 0.6 },
      { name: "description", weight: 0.3 },
      { name: "tag", weight: 0.1 },
    ],
    threshold: 0.4, // lower = stricter, higher = fuzzier
    includeScore: true,
  };

  // Initialize Fuse once
  const fuse = useMemo(() => new Fuse(cardData, fuseOptions), []);

  const filteredCards = useMemo(() => {
    let results = cardData;

    // Tag filtering
    if (selectedTag !== "All") {
      results = results.filter((card) => {
        const tags = Array.isArray(card.tag) ? card.tag : [card.tag];
        return tags.some((t) =>
          t.toLowerCase().includes(selectedTag.toLowerCase())
        );
      });
    }

    // Advanced fuzzy search
    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery.trim());

      // Keep only matching cards and maintain tag filter
      results = fuseResults
        .map((r) => r.item)
        .filter((item) => results.includes(item));
    }

    return results;
  }, [selectedTag, searchQuery, fuse]);

  return (
    <div className="w-full relative min-h-screen">
      <Background />
      <SunEffect />
      <div
        ref={goUpButtonRef}
        onClick={handleGoUpClick}
        className="size-15 fixed rounded-full bg-zinc-900 shadow-[inset_4px_4px_4px_rgba(255,255,255,0.04),inset_-4px_-4px_4px_rgba(0,0,0,0.5)] active:shadow-[inset_4px_4px_4px_rgba(0,0,0,0.5),inset_-4px_-4px_4px_rgba(255,255,255,0.05)] bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 right-3 sm:right-6 md:right-8 lg:right-30 flex justify-center items-center cursor-pointer go-up z-50"
      >
        <GoUpArrowIcon />
      </div>

      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <Navbar />

        {/* Hero Section */}
        <div className="hero-section flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-6 pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24">
          <h1
            ref={titleRef}
            className="font-[Inria_Serif] text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[88px] font-bold text-zinc-400 tracking-tighter px-2 sm:px-4 text-center"
          >
            All Your Frontend Necessities
          </h1>

          {/* Hero Image */}
          <div className="hero-image -mt-4 sm:-mt-6 md:-mt-8 relative w-[90%] max-w-[320px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[822px] h-[60px] sm:h-20 md:h-[100px] lg:h-[110px] xl:h-[126px] rounded-[44px] sm:rounded-[55px] md:rounded-[66px] lg:rounded-[77px] xl:rounded-[88px] overflow-hidden mx-auto">
            <Silk
              speed={20}
              scale={0.9}
              color="#7B7481"
              noiseIntensity={1.5}
              rotation={1.94}
            />
          </div>
          <p
            ref={pRef}
            className="text-[#888888] max-w-4xl font-[Inria_Serif] text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] text-center font-extralight tracking-tighter leading-5 sm:leading-7 px-4 sm:px-6 md:px-8"
          >
            Explore a universe of tools, frameworks, and components — all in one
            place. Just search what you need, and get instant access to the best
            resources.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-5 w-full sm:w-auto px-4 sm:px-0">
            <Button1
              onClick={handleExploreClick}
              className="tracking-tighter w-full sm:w-auto text-center"
            >
              Explore Resources
            </Button1>
            <Link
              href="https://github.com/Malay146/UIArchives"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button2 className="flex items-center justify-center gap-2 tracking-tighter w-full sm:w-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github-icon lucide-github sm:w-5 sm:h-5 md:w-6 md:h-6"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                Star on Github
              </Button2>
            </Link>
          </div>

          <Divider />

          {/* Metrics */}
          <div className="metrics max-w-xl flex items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24 xl:gap-32 font-[Inter] text-center mt-2 sm:mt-3 text-white px-4">
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold">
                {/* 1000+ */}
                {cardData.length >= 1000
                  ? `${(cardData.length / 1000).toFixed(1)}k+`
                  : `${cardData.length}+`}
              </p>
              <p className="font-thin text-xs sm:text-sm md:text-base lg:text-lg">
                Resources Shared
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-black">∞</p>
              <p className="font-thin text-xs sm:text-sm md:text-base lg:text-lg">
                Design Inspiration
              </p>
            </div>
          </div>

          {/* Filter & Search */}
          <div
            ref={filterRef}
            className="max-w-7xl tracking-tighter mt-8 sm:mt-10 md:mt-12 flex flex-col items-center px-4 sm:px-6 md:px-0"
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2 md:gap-2">
              {[
                "All",
                "Component Library",
                "Technologies",
                "Fonts",
                "Icons",
                "Tools",
                "Socials",
                "Animation",
                "Inspiration",
              ].map((tag) => (
                <Button1
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={
                    selectedTag === tag
                      ? "shadow-[inset_-4px_-4px_4px_rgba(255,255,255,0.08),inset_4px_4px_4px_rgba(0,0,0,0.5)] text-zinc-200 font-normal whitespace-nowrap shrink-0"
                      : "whitespace-nowrap shrink-0"
                  }
                >
                  {tag}
                </Button1>
              ))}
            </div>
            <Search
              type="text"
              placeholder="Search..."
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full mt-3 sm:mt-4 outline-none transition-all duration-300 ease-out focus:scale-[1.02] focus:shadow-lg"
            />
          </div>

          {/* Cards */}
          <div className="Cards w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-3 mt-5 sm:mt-6 md:mt-8 font-[Inter] tracking-tight mb-3 sm:mb-6 md:mb-8 px-4 sm:px-6 md:px-0">
            {filteredCards.length > 0 ? (
              filteredCards.map((card, index) => (
                <UiCard key={index} {...card} />
              ))
            ) : (
              <p className="text-zinc-500 text-center text-balance col-span-1 sm:col-span-2 lg:col-span-3 mt-5 mb-14 py-3 bg-zinc-900 rounded-2xl mx-auto px-5">
                No results found. Try a different keyword or filter.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type SearchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Search = ({ className = "", ...props }: SearchProps) => {
  return (
    <input
      {...props}
      className={`noise font-[Inter] px-4 py-2.5 sm:px-5 sm:py-3 bg-[#BDBDBD] rounded-xl sm:rounded-2xl 
      shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.5),inset_2px_2px_2px_rgba(255,255,255,0.5)] sm:shadow-[inset_-4px_-4px_4px_rgba(0,0,0,0.5),inset_4px_4px_4px_rgba(255,255,255,0.5)]
      focus:shadow-[inset_2px_2px_2px_rgba(0,0,0,0.5),inset_-2px_-2px_2px_rgba(255,255,255,0.5)] sm:focus:shadow-[inset_4px_4px_4px_rgba(0,0,0,0.5),inset_-4px_-4px_4px_rgba(255,255,255,0.5)]
      transition-shadow duration-300 font-light text-zinc-800 placeholder:text-zinc-500 text-sm sm:text-base
      ${className}`}
    />
  );
};

const Divider = () => {
  return (
    <div className="divider border-t border-zinc-800 w-full max-w-xl h-px mt-3 sm:mt-4" />
  );
};
