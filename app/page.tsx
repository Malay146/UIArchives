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
      {/* Black Basic Grid Background */}
      <div
        className="fixed inset-0 -z-10 h-full w-full min-h-screen bg-grid-responsive"
        style={{
          background: "#000000",
          backgroundImage: `
        linear-gradient(to right, rgba(75, 85, 99, 0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.3) 1px, transparent 1px)
      `,
          backgroundSize: "40px 40px",
          backgroundRepeat: "repeat",
        }}
      />
      {/* Your Content/Components */}

      <svg
        width="959"
        height="800"
        viewBox="0 0 959 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute z-99 pointer-events-none hidden sm:block  h-auto opacity-50 sm:opacity-100"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      >
        <g opacity="0.14" filter="url(#filter0_f_67_2)">
          <path
            d="M107.743 -108.483L-18.1717 31.5653C-32.8453 47.886 -29.6258 73.426 -11.3608 85.5945L712.016 567.521C725.338 576.396 742.921 575.409 755.165 565.098L761.803 559.508C777.829 546.012 778.99 521.736 764.325 506.773L160.225 -109.612C145.682 -124.45 121.634 -123.933 107.743 -108.483Z"
            fill="url(#paint0_linear_67_2)"
          />
        </g>
        <g filter="url(#filter1_f_67_2)">
          <path
            d="M-207.257 -205.483L-333.172 -65.4347C-347.845 -49.114 -344.626 -23.574 -326.361 -11.4055L397.016 470.521C410.338 479.396 427.921 478.409 440.165 468.098L446.803 462.508C462.829 449.012 463.99 424.736 449.325 409.773L-154.775 -206.612C-169.318 -221.45 -193.366 -220.933 -207.257 -205.483Z"
            fill="url(#paint1_linear_67_2)"
            fillOpacity="0.17"
          />
        </g>
        <g opacity="0.82" filter="url(#filter2_f_67_2)">
          <ellipse
            cx="270.735"
            cy="191.403"
            rx="474.781"
            ry="331.285"
            transform="rotate(28 270.735 191.403)"
            fill="#FFEBAA"
            fillOpacity="0.16"
          />
        </g>
        <g filter="url(#filter3_f_67_2)">
          <circle cx="80" cy="48" r="1" fill="#D9D9D9" />
        </g>
        <g filter="url(#filter4_f_67_2)">
          <circle cx="259" cy="234" r="1" fill="#D9D9D9" />
        </g>
        <g filter="url(#filter5_f_67_2)">
          <circle cx="226" cy="386" r="1" fill="#D9D9D9" fillOpacity="0.5" />
        </g>
        <g filter="url(#filter6_f_67_2)">
          <circle cx="436" cy="137" r="1" fill="#D9D9D9" fillOpacity="0.5" />
        </g>
        <g filter="url(#filter7_f_67_2)">
          <circle cx="307" cy="138" r="1" fill="#D9D9D9" fillOpacity="0.5" />
        </g>
        <g filter="url(#filter8_f_67_2)">
          <circle cx="443" cy="198" r="1" fill="#D9D9D9" />
        </g>
        <g filter="url(#filter9_f_67_2)">
          <circle cx="286" cy="300" r="1" fill="#D9D9D9" />
        </g>
        <g filter="url(#filter10_f_67_2)">
          <circle cx="123" cy="183" r="1" fill="#D9D9D9" />
        </g>
        <g filter="url(#filter11_f_67_2)">
          <circle cx="46" cy="298" r="1" fill="#D9D9D9" fillOpacity="0.5" />
        </g>
        <g filter="url(#filter12_f_67_2)">
          <circle cx="339" cy="45" r="1" fill="#D9D9D9" fillOpacity="0.5" />
        </g>
        <defs>
          <filter
            id="filter0_f_67_2"
            x="-80.8034"
            y="-173.814"
            width="908.818"
            height="800.775"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="26.7"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter1_f_67_2"
            x="-395.803"
            y="-270.814"
            width="908.818"
            height="800.775"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="26.7"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter2_f_67_2"
            x="-416.914"
            y="-416.77"
            width="1375.3"
            height="1216.35"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="120.2"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter3_f_67_2"
            x="77"
            y="45"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter4_f_67_2"
            x="256"
            y="231"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter5_f_67_2"
            x="223"
            y="383"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter6_f_67_2"
            x="433"
            y="134"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter7_f_67_2"
            x="304"
            y="135"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter8_f_67_2"
            x="440"
            y="195"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter9_f_67_2"
            x="283"
            y="297"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter10_f_67_2"
            x="120"
            y="180"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter11_f_67_2"
            x="43"
            y="295"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <filter
            id="filter12_f_67_2"
            x="336"
            y="42"
            width="6"
            height="6"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="1"
              result="effect1_foregroundBlur_67_2"
            />
          </filter>
          <linearGradient
            id="paint0_linear_67_2"
            x1="28.9507"
            y1="35.8142"
            x2="690.316"
            y2="516.28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFD95D" />
            <stop
              offset="0.840951"
              stopColor="#FFD95D"
              stopOpacity="0.646417"
            />
            <stop offset="1" stopColor="#FFD95D" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_67_2"
            x1="-286.049"
            y1="-61.1858"
            x2="375.316"
            y2="419.28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFD95D" />
            <stop
              offset="0.840951"
              stopColor="#FFD95D"
              stopOpacity="0.646417"
            />
            <stop offset="1" stopColor="#FFD95D" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div
        ref={goUpButtonRef}
        onClick={handleGoUpClick}
        className="size-15 fixed rounded-full bg-zinc-900 shadow-[inset_4px_4px_4px_rgba(255,255,255,0.04),inset_-4px_-4px_4px_rgba(0,0,0,0.5)] active:shadow-[inset_4px_4px_4px_rgba(0,0,0,0.5),inset_-4px_-4px_4px_rgba(255,255,255,0.05)] bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 right-3 sm:right-6 md:right-8 lg:right-30 flex justify-center items-center cursor-pointer go-up z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-arrow-up-icon lucide-arrow-up text-white"
        >
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </svg>
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

          {/* Divider */}
          <div className="divider border-t border-zinc-800 w-full max-w-xl h-px mt-3 sm:mt-4" />

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
