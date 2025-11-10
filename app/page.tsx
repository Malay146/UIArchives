"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import UiCard, { UiCardData } from "@/components/UiCard";
import Silk from "@/components/Silk";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import Fuse from "fuse.js";

const cardData: UiCardData[] = [
  {
    title: "Shadcn",
    description:
      "Shadcn (often written as shadcn/ui) is a popular component library for React and Next.js projects that provides beautifully designed, accessible, and customizable UI components built using Tailwind CSS and Radix UI.",
    tag: "Component Library",
    image: "/shadcn.webp", // Place your image in /public folder
    links: {
      website: "https://ui.shadcn.com",
      github: "https://github.com/shadcn/ui",
      twitter: "https://twitter.com/shadcn",
    },
  },
  {
    title: "Tailwind CSS",
    description:
      "Tailwind CSS is a utility-first CSS framework for rapidly building custom designs without leaving your HTML.",
    tag: "CSS Framework",
    image: "/tailwindcss.png",
    links: {
      website: "https://tailwindcss.com",
      github: "https://github.com/tailwindlabs/tailwindcss",
    },
  },
  {
    title: "Radix UI",
    description:
      "Radix UI provides accessible, unstyled UI primitives for building high-quality design systems and web apps.",
    tag: ["UI Primitives", "Component Library"],
    image: "/radix-ui.png",
    links: {
      website: "https://www.radix-ui.com",
      github: "https://github.com/radix-ui",
    },
  },
  {
    title: "ReactBits",
    description:
      "ReactBits is a curated collection of reusable React patterns, techniques, tips, and best practices designed to help developers write cleaner, more efficient, and scalable React code.",
    tag: "Component Library",
    image: "/reactbits.png", // Place this image inside your /public folder
    links: {
      website: "https://reactbits.dev",
      github: "https://github.com/DavidHDev/react-bits",
      twitter: "https://x.com/davidhdev",
    },
  },
  {
    title: "TweakCN",
    description:
      "TweakCN offers a collection of visual and motion design experiments, interactive components, and UI concepts for developers and designers looking to enhance creativity.",
    tag: ["Theme Editor", "UI Experiments", "Shadcn/UI", "Frontend"],
    image: "/tweakcn.png",
    links: {
      website: "https://tweakcn.com",
      github: "https://github.com/jnsahaj/tweakcn",
    },
  },
  {
    title: "Motion Primitives",
    description:
      "Motion Primitives provides beautiful, composable motion utilities for React — helping you create elegant animations and transitions easily.",
    tag: ["Animation Library", "React", "Framer Motion", "UI Animation"],
    image: "/motion-primitives.png",
    links: {
      website: "https://motion-primitives.com",
      github: "https://github.com/ibelick/motion-primitives",
      twitter: "https://x.com/Ibelick",
    },
  },
  {
    title: "Pattern Craft",
    description:
      "Pattern Craft is a playground for generative art, interactive patterns, and creative coding. It’s ideal for designers exploring algorithmic visuals and Background Patterns.",
    tag: ["Pattern Design", "Background Patterns", "Pattern"],
    image: "/patterncraft.png",
    links: {
      website: "https://patterncraft.fun",
      github: "https://github.com/megh-bari/pattern-craft",
      twitter: "https://x.com/meghtrix",
    },
  },
  {
    title: "Evil Charts",
    description:
      "Evil Charts provides unconventional, creative, and visually striking chart examples that break the mold of traditional data visualization.",
    tag: ["Data Visualization", "Graphs", "Charts", "Frontend", "UI"],
    image: "/evilcharts.png",
    links: {
      website: "https://evilcharts.com",
      github: "https://github.com/legions-developer/evilcharts",
      twitter: "https://x.com/legionsdev",
    },
  },
  {
    title: "8bitCN",
    description:
      "8bitCN showcases pixel-art inspired UI, retro designs, and nostalgic web aesthetics that bring a vintage touch to modern frontend projects.",
    tag: ["Retro UI", "Pixel Art", "Frontend"],
    image: "/8bitcn.png",
    links: {
      website: "https://www.8bitcn.com",
      github: "https://github.com/TheOrcDev/8bitcn-ui",
      twitter: "https://x.com/theorcdev",
    },
  },
  {
    title: "Box Shadows",
    description:
      "Box Shadows by Aceternity UI is a handy tool to generate soft, realistic shadows for modern UI elements — perfect for glassmorphism and neumorphism effects.",
    tag: ["Box Shadows", "Frontend", "UI Design Tool", "Design Tool"],
    image: "/boxshadows.png",
    links: {
      website: "https://ui.aceternity.com/tools/box-shadows",
      twitter: "https://x.com/mannupaaji",
    },
  },
  {
    title: "Recipes Build UI",
    description:
      "Build UI’s Recipes section features practical, real-world examples of interactive UI patterns and animations using React and Framer Motion.",
    tag: ["UI Recipes", "Frontend", "UI Patterns"],
    image: "/buildui.png",
    links: {
      website: "https://buildui.com/recipes",
    },
  },
  {
    title: "Tympanus Codrops",
    description:
      "Codrops is a well-known design and development blog that shares tutorials, experiments, and inspirational UI interactions for creative developers.",
    tag: ["Design Blog", "Design Inspiration", "UI Experiments"],
    image: "/codrops.png",
    links: {
      website: "https://tympanus.net/codrops",
    },
  },
  {
    title: "React Scan",
    description:
      "React Scan is a powerful tool to visualize React component performance in real time, helping you debug and optimize your React applications efficiently.",
    tag: ["Developer Tool", "React", "Performance Tool", "Tools"],
    image: "/reactscan.png",
    links: {
      website: "https://react-scan.com",
      github: "https://github.com/aidenybai/react-scan",
      twitter: "https://x.com/aidenybai",
    },
  },
  {
    title: "Pinterest",
    description:
      "Pinterest is a global visual discovery platform where designers can find inspiration, moodboards, and references for UI, UX, and branding projects.",
    tag: ["Design Inspiration", "UI Inspiration", "Moodboards"],
    image: "/pinterest.png",
    links: {
      website: "https://www.pinterest.com",
    },
  },
  {
    title: "Shader Gradient",
    description:
      "Shader Gradient is an online tool for creating animated 3D gradients using WebGL and Three.js — perfect for interactive, eye-catching backgrounds.",
    tag: ["Gradient Generator", "Backgrounds", "Design Tool"],
    image: "/shadergradient.avif",
    links: {
      website: "https://www.shadergradient.co/customize",
      github: "https://github.com/ruucm/shadergradient",
      twitter: "https://x.com/ruucm",
    },
  },
  {
    title: "Shadway",
    description:
      "Shadway curates a collection of websites built using Shadcn/UI, showcasing creative and production-ready examples of this modern React component library.",
    tag: ["Component Gallery", "Shadcn/UI", "Design Inspiration"],
    image: "/shadway.png",
    links: {
      website: "https://shadway.online",
      github: "https://github.com/moazamtech/shadway",
    },
  },
  {
    title: "Minimal Gallery",
    description:
      "Minimal Gallery curates a collection of beautifully minimal and aesthetically pleasing websites, offering inspiration for clean and balanced web design.",
    tag: ["Design Inspiration", "Minimalist Design", "UI Inspiration"],
    image: "/minimalgallery.png",
    links: {
      website: "https://www.minimal.gallery",
      github: "https://x.com/minimal_gallery",
    },
  },
  {
    title: "StackSorted",
    description:
      "StackSorted is a curated directory of modern UI elements, components, and websites — a perfect place to explore and gather interface inspiration.",
    tag: ["UI Elements", "Design Inspiration", "UI Inspiration", "Frontend"],
    image: "/stacksorted.png",
    links: {
      website: "https://stacksorted.com",
      github: "https://github.com/juxtopposed/stacksorted",
      twitter: "https://x.com/juxtopposed",
    },
  },

  // // 🧩 Icons
  {
    title: "Tabler Icons",
    description:
      "Tabler Icons offers over 5,000 beautifully consistent, open-source icons for web and product interfaces — all customizable and MIT licensed.",
    tag: ["Icons", "Icon Library"],
    image: "/tabler.png",
    links: {
      website: "https://tabler.io/icons",
      github: "https://github.com/tabler/tabler-icons",
      twitter: "https://x.com/tabler_io",
    },
  },
  {
    title: "Nucleo App",
    description:
      "Nucleo provides a curated collection of pixel-perfect icons with a clean and cohesive style. It also includes a free set for personal and commercial use.",
    tag: ["Icons", "Icon Library"],
    image: "/nucleo.png",
    links: {
      website: "https://nucleoapp.com/free-icons",
      twitter: "https://x.com/nucleoicons",
    },
  },

  // // ✍️ Typography – Free Fonts
  {
    title: "FontShare",
    description:
      "FontShare by the Indian Type Foundry offers high-quality, modern fonts completely free for both personal and commercial projects.",
    tag: ["Fonts", "Typography", "Free Fonts"],
    image: "/fontshare.png",
    links: {
      website: "https://www.fontshare.com",
      twitter: "https://x.com/fontshare_com",
    },
  },
  {
    title: "Google Fonts",
    description:
      "Google Fonts hosts thousands of open-source typefaces, enabling designers and developers to integrate beautiful typography into web and mobile apps easily.",
    tag: ["Fonts", "Typography", "Free Fonts", "Font Library"],
    image: "/googlefonts.png",
    links: {
      website: "https://fonts.google.com",
      github: "https://github.com/google/fonts",
    },
  },
  {
    title: "Uncut.wtf",
    description:
      "Uncut.wtf is a creative type foundry offering free, experimental, and unique fonts — perfect for expressive typography in modern web projects.",
    tag: ["Fonts", "Typography", "Free Fonts", "Type Foundry"],
    image: "/uncutwtf.png",
    links: {
      website: "https://uncut.wtf",
    },
  },

  // // 🧠 Typography – Helpful Tools
  {
    title: "TypeScale",
    description:
      "TypeScale helps you visualize and generate harmonious typographic scales for your website — perfect for setting consistent font sizes and rhythm.",
    tag: [
      "Typography Tool",
      "Font Scale",
      "Type Scale",
      "typography",
      "fonts",
      "tools",
    ],
    image: "/typescale.png",
    links: {
      website: "https://typescale.com",
    },
  },

  //components
  {
    title: "Aceternity UI",
    description:
      "Aceternity UI offers a collection of modern, animated, and beautifully designed UI components built with React, Framer Motion, and Tailwind CSS — perfect for building sleek web interfaces quickly.",
    tag: [
      "Component Library",
      "UI Components",
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Design System",
      "Frontend",
    ],
    image: "/aceternityui.png",
    links: {
      website: "https://ui.aceternity.com/components",
      twitter: "https://x.com/mannupaaji",
    },
  },
];

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <Navbar />

        {/* Hero Section */}
        <div className="hero-section flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-6 pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24">
          <h1 className="font-[Inria_Serif] text-[32px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[88px] font-bold bg-clip-text text-center text-transparent bg-linear-to-r from-[#3F3F3F] via-[#FFFFFF] to-[#3F3F3F] tracking-tighter px-2 sm:px-4">
            All Your Frontend Necessities
          </h1>

          {/* Hero Image */}
          <div className="hero-image -mt-4 sm:-mt-6 md:-mt-8 relative w-[90%] max-w-[320px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[822px] h-[60px] sm:h-[80px] md:h-[100px] lg:h-[110px] xl:h-[126px] rounded-[44px] sm:rounded-[55px] md:rounded-[66px] lg:rounded-[77px] xl:rounded-[88px] overflow-hidden mx-auto">
            <Silk
              speed={20}
              scale={0.9}
              color="#7B7481"
              noiseIntensity={1.5}
              rotation={1.94}
            />
          </div>
          <p className="text-[#888888] max-w-4xl font-[Inria_Serif] text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] text-center font-extralight tracking-tigher leading-5 sm:leading-6 px-4 sm:px-6 md:px-8">
            Explore a universe of tools, frameworks, and components — all in one
            place. Just search what you need, and get instant access to the best
            resources.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-5 w-full sm:w-auto px-4 sm:px-0">
            <Link href="#filter" className="w-full sm:w-auto">
              <Button1 className="tracking-tighter w-full sm:w-auto text-center">
                Explore Resources
              </Button1>
            </Link>
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
                Github
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
            className="filter scroll-mt-5 max-w-7xl tracking-tighter mt-8 sm:mt-10 md:mt-12 flex flex-col items-center px-4 sm:px-6 md:px-0"
            id="filter"
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2 md:gap-2">
              {[
                "All",
                "Component Library",
                "Framework",
                "Fonts",
                "Icons",
                "Tools",
                "X/Twitter",
                "Youtube",
                "Inspiration",
              ].map((tag) => (
                <Button1
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={
                    selectedTag === tag
                      ? "shadow-[inset_-4px_-4px_4px_rgba(255,255,255,0.08),inset_4px_4px_4px_rgba(0,0,0,0.5)] text-zinc-200 font-normal whitespace-nowrap flex-shrink-0"
                      : "whitespace-nowrap flex-shrink-0"
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
              className="pl-10 w-full mt-3 sm:mt-4 outline-none"
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

const Navbar = () => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const handleShare = async () => {
    const url = window.location.href;
    const title = "UIArchives – All Your Frontend Necessities";
    const text =
      "Check out this amazing collection of UI components and design resources!";

    try {
      // Check if Web Share API is available (mostly on mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } else {
        // Fallback to clipboard API
        await navigator.clipboard.writeText(url);
        setToastMessage("Link copied to clipboard!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      // User cancelled the share or error occurred
      // If it's not a user cancellation, try clipboard as fallback
      if ((error as Error).name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(url);
          setToastMessage("Link copied to clipboard!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } catch (clipboardError) {
          setToastMessage("Failed to share. Please try again.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }
    }
  };

  return (
    <>
      <div className="navbar pt-6 sm:pt-8 md:pt-10 flex items-center justify-between gap-4 sm:gap-6">
        <Link href="/" className="flex-shrink-0" aria-label="Home">
          <svg
            width="265"
            height="55"
            viewBox="0 0 265 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[140px] h-[29px] sm:w-[180px] sm:h-[37px] md:w-[220px] md:h-[45px] lg:w-[265px] lg:h-[55px]"
          >
            <path
              d="M22.6 5.70001V27.2L17.7 24.4C9 19.4 3.59999 10.1 3.59999 0H0V24.6C0 32.6 4.59999 40 11.9 43.5L22.7 48.7V27.2L27.6 30C36.3 35 41.7 44.3 41.7 54.4H45.3V29.8C45.3 21.8 40.7 14.4 33.4 10.9L22.6 5.70001Z"
              fill="white"
            />
            <path
              d="M84.4732 11.5182H91.5812V28.2909C91.5812 30.2852 91.1039 32.0111 90.1494 33.4685C89.2033 34.9173 87.8823 36.0381 86.1863 36.8307C84.4903 37.6148 82.5215 38.0068 80.28 38.0068C78.0215 38.0068 76.0442 37.6148 74.3482 36.8307C72.6522 36.0381 71.3312 34.9173 70.3852 33.4685C69.4477 32.0111 68.9789 30.2852 68.9789 28.2909V11.5182H76.0869V27.6773C76.0869 28.4869 76.2658 29.2114 76.6238 29.8506C76.9817 30.4813 77.4761 30.9756 78.1067 31.3335C78.746 31.6915 79.4704 31.8705 80.28 31.8705C81.0982 31.8705 81.8227 31.6915 82.4533 31.3335C83.084 30.9756 83.5783 30.4813 83.9363 29.8506C84.2942 29.2114 84.4732 28.4869 84.4732 27.6773V11.5182ZM100.267 11.5182V37.7H93.1594V11.5182H100.267ZM108.637 37.7H100.967L109.609 11.5182H119.325L127.967 37.7H120.296L114.569 18.7284H114.364L108.637 37.7ZM107.205 27.3705H121.626V32.6886H107.205V27.3705ZM128.791 37.7V18.0636H135.643V21.7966H135.847C136.205 20.4159 136.772 19.406 137.548 18.7668C138.332 18.1276 139.248 17.808 140.296 17.808C140.603 17.808 140.906 17.8335 141.204 17.8847C141.511 17.9273 141.805 17.9912 142.086 18.0764V24.0977C141.737 23.9784 141.306 23.8889 140.795 23.8293C140.283 23.7696 139.845 23.7398 139.478 23.7398C138.788 23.7398 138.166 23.8975 137.612 24.2128C137.066 24.5196 136.636 24.9543 136.32 25.5168C136.005 26.0708 135.847 26.7227 135.847 27.4727V37.7H128.791ZM150.935 38.058C148.804 38.058 146.981 37.6361 145.464 36.7923C143.947 35.9401 142.783 34.7554 141.974 33.2384C141.164 31.7128 140.759 29.9443 140.759 27.933C140.759 25.9216 141.164 24.1574 141.974 22.6404C142.783 21.1148 143.947 19.9301 145.464 19.0864C146.981 18.2341 148.804 17.808 150.935 17.808C152.861 17.808 154.527 18.1574 155.934 18.8563C157.349 19.5466 158.444 20.5267 159.219 21.7966C159.995 23.058 160.387 24.5409 160.395 26.2455H153.85C153.756 25.2142 153.458 24.4301 152.955 23.8932C152.461 23.3477 151.822 23.075 151.037 23.075C150.424 23.075 149.887 23.254 149.427 23.6119C148.966 23.9614 148.608 24.494 148.353 25.21C148.097 25.9173 147.969 26.808 147.969 27.8818C147.969 28.9557 148.097 29.8506 148.353 30.5665C148.608 31.2739 148.966 31.8065 149.427 32.1645C149.887 32.5139 150.424 32.6886 151.037 32.6886C151.557 32.6886 152.018 32.5693 152.418 32.3307C152.819 32.0835 153.143 31.7256 153.39 31.2568C153.645 30.7796 153.799 30.2 153.85 29.5182H160.395C160.37 31.2483 159.974 32.7568 159.206 34.0438C158.439 35.3222 157.353 36.3108 155.947 37.0097C154.549 37.7085 152.878 38.058 150.935 38.058ZM168.564 26.6546V37.7H161.507V11.5182H168.308V21.7966H168.513C168.956 20.5438 169.693 19.5679 170.724 18.869C171.756 18.1617 172.996 17.808 174.444 17.808C175.834 17.808 177.04 18.1233 178.062 18.754C179.094 19.3847 179.89 20.254 180.453 21.3619C181.024 22.4699 181.305 23.7398 181.297 25.1716V37.7H174.24V26.6546C174.248 25.683 174.006 24.9202 173.511 24.3662C173.025 23.8122 172.331 23.5352 171.427 23.5352C170.856 23.5352 170.354 23.6631 169.919 23.9188C169.493 24.1659 169.16 24.5239 168.922 24.9926C168.692 25.4529 168.572 26.0068 168.564 26.6546ZM182.98 37.7V18.0636H190.037V37.7H182.98ZM186.509 16.0182C185.554 16.0182 184.736 15.7029 184.054 15.0722C183.372 14.4415 183.032 13.683 183.032 12.7966C183.032 11.9102 183.372 11.1517 184.054 10.521C184.736 9.89035 185.554 9.57501 186.509 9.57501C187.472 9.57501 188.29 9.89035 188.963 10.521C189.645 11.1517 189.986 11.9102 189.986 12.7966C189.986 13.683 189.645 14.4415 188.963 15.0722C188.29 15.7029 187.472 16.0182 186.509 16.0182ZM211.623 18.0636L205.026 37.7H196.844L190.248 18.0636H197.662L200.833 31.0523H201.037L204.208 18.0636H211.623ZM220.641 38.058C218.544 38.058 216.738 37.6574 215.221 36.8563C213.712 36.0466 212.549 34.8875 211.731 33.379C210.921 31.8619 210.516 30.0466 210.516 27.933C210.516 25.9046 210.925 24.1318 211.743 22.6148C212.562 21.0977 213.716 19.9173 215.208 19.0736C216.699 18.2298 218.459 17.808 220.488 17.808C221.971 17.808 223.313 18.0381 224.515 18.4983C225.716 18.9585 226.743 19.6276 227.596 20.5054C228.448 21.3747 229.104 22.4315 229.564 23.6759C230.025 24.9202 230.255 26.3222 230.255 27.8818V29.5182H212.715V25.6318H223.76C223.752 25.0693 223.607 24.575 223.326 24.1489C223.053 23.7142 222.682 23.3776 222.214 23.1389C221.753 22.8918 221.229 22.7682 220.641 22.7682C220.07 22.7682 219.546 22.8918 219.069 23.1389C218.591 23.3776 218.208 23.71 217.918 24.1361C217.637 24.5622 217.488 25.0608 217.471 25.6318V29.825C217.471 30.4557 217.603 31.0182 217.867 31.5125C218.131 32.0068 218.51 32.3946 219.005 32.6759C219.499 32.9571 220.096 33.0977 220.794 33.0977C221.28 33.0977 221.723 33.0296 222.124 32.8932C222.533 32.7568 222.883 32.5608 223.172 32.3051C223.462 32.0409 223.675 31.7256 223.812 31.3591H230.255C230.033 32.7227 229.509 33.9074 228.682 34.9131C227.856 35.9102 226.76 36.6858 225.397 37.2398C224.042 37.7852 222.456 38.058 220.641 38.058ZM249.283 24.4557H242.789C242.755 24.0551 242.614 23.71 242.367 23.4202C242.12 23.1304 241.8 22.9088 241.408 22.7554C241.025 22.5935 240.599 22.5125 240.13 22.5125C239.525 22.5125 239.005 22.6233 238.57 22.8449C238.135 23.0665 237.922 23.3818 237.931 23.7909C237.922 24.0807 238.046 24.3492 238.302 24.5963C238.566 24.8435 239.073 25.0352 239.823 25.1716L243.812 25.8875C245.823 26.254 247.319 26.8719 248.299 27.7412C249.287 28.602 249.786 29.7568 249.795 31.2057C249.786 32.6034 249.368 33.8179 248.542 34.8492C247.724 35.8719 246.603 36.6645 245.179 37.227C243.765 37.781 242.15 38.058 240.334 38.058C237.334 38.058 234.986 37.4443 233.29 36.2171C231.603 34.9898 230.661 33.3705 230.465 31.3591H237.471C237.564 31.9813 237.871 32.4628 238.391 32.8037C238.92 33.1361 239.584 33.3023 240.385 33.3023C241.033 33.3023 241.566 33.1915 241.983 32.9699C242.41 32.7483 242.627 32.433 242.635 32.0239C242.627 31.6489 242.439 31.3506 242.073 31.129C241.715 30.9074 241.152 30.7284 240.385 30.5921L236.908 29.9784C234.905 29.629 233.405 28.9642 232.408 27.9841C231.411 27.004 230.917 25.7426 230.925 24.2C230.917 22.8364 231.275 21.6815 231.999 20.7355C232.732 19.781 233.776 19.0565 235.131 18.5622C236.495 18.0594 238.11 17.808 239.976 17.808C242.814 17.808 245.052 18.396 246.688 19.5722C248.333 20.7483 249.198 22.3761 249.283 24.4557Z"
              fill="white"
            />
          </svg>
          <span className="sr-only">Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button1
            onClick={handleShare}
            className="font-extralight tracking-tighter text-xs sm:text-sm md:text-base px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 whitespace-nowrap"
            aria-label="Share this page"
          >
            <span className="sm:inline">Share</span>
          </Button1>
          <Button1 className="font-extralight tracking-tighter text-xs sm:text-sm md:text-base px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 whitespace-nowrap">
            <span className="hidden sm:inline">Add your Resource</span>
            <span className="sm:hidden">Add</span>
          </Button1>
        </div>
      </div>

      {/* Toast Notification */}
      {/* {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast-animation">
          <div className="bg-zinc-800 text-white px-4 py-3 rounded-xl shadow-lg border border-zinc-700 flex items-center gap-2 backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-400 flex-shrink-0"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )} */}
    </>
  );
};

type Button1Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button1 = ({ children, className = "", ...props }: Button1Props) => {
  return (
    <button
      {...props}
      className={twMerge(
        clsx(
          "noise font-[Inter] px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 bg-[#171717] cursor-pointer rounded-xl sm:rounded-2xl transition-shadow duration-300 font-light text-zinc-400 text-xs sm:text-sm md:text-base",
          "shadow-[inset_4px_4px_4px_rgba(255,255,255,0.04),inset_-4px_-4px_4px_rgba(0,0,0,0.5)]",
          "hover:shadow-[inset_-2px_-2px_2px_rgba(255,255,255,0.08),inset_2px_2px_2px_rgba(0,0,0,0.5)] sm:hover:shadow-[inset_-4px_-4px_4px_rgba(255,255,255,0.08),inset_4px_4px_4px_rgba(0,0,0,0.5)]",
          className
        )
      )}
    >
      {children}
    </button>
  );
};

type Button2Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button2 = ({ children, className = "", ...props }: Button2Props) => {
  return (
    <button
      {...props}
      className={`noise font-[Inter] px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 bg-[#BDBDBD] cursor-pointer rounded-xl sm:rounded-2xl   
      shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.5),inset_2px_2px_2px_rgba(255,255,255,0.5)] sm:shadow-[inset_-4px_-4px_4px_rgba(0,0,0,0.5),inset_4px_4px_4px_rgba(255,255,255,0.5)]
      hover:shadow-[inset_2px_2px_2px_rgba(0,0,0,0.5),inset_-2px_-2px_2px_rgba(255,255,255,0.5)] sm:hover:shadow-[inset_4px_4px_4px_rgba(0,0,0,0.5),inset_-4px_-4px_4px_rgba(255,255,255,0.5)]
      transition-shadow duration-300 font-light text-zinc-800 text-xs sm:text-sm md:text-base ${className}`}
    >
      {children}
    </button>
  );
};

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
