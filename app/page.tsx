"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import UiCard, { UiCardData } from "@/components/UiCard";
import Silk from "@/components/Silk";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import Fuse from "fuse.js";
import Button1 from "@/components/ui-components/Button1";
import Button2 from "@/components/ui-components/Button2";
import Navbar from "@/components/Navbar";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

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
    tag: ["CSS Framework", "Utility-First", "Frontend", "Technologies"],
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
    tag: ["Theme Editor", "UI Experiments", "Shadcn/UI", "Frontend", "Tools"],
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
    tag: [
      "Animation Library",
      "React",
      "Framer Motion",
      "UI Animation",
      "Animation",
    ],
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
    tag: ["Retro UI", "Pixel Art", "Frontend", "Component Library"],
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
    tag: ["Box Shadows", "Frontend", "UI Design Tool", "Design Tool", "Tools"],
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
    tag: ["Design Blog", "Design Inspiration", "UI Experiments", "Animation"],
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
      twitter: "https://x.com/loxtmozzi",
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

  // Icons
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
  {
    title: "Font Awesome",
    description:
      "Font Awesome is one of the most popular icon libraries offering thousands of free and pro icons that can be easily customized with CSS for websites and applications.",
    tag: ["Icon Library", "Web Icons", "SVG", "UI Design", "Icons"],
    image: "/Fontawesome.png",
    links: {
      website: "https://fontawesome.com/",
      github: "https://github.com/FortAwesome/Font-Awesome",
      twitter: "https://twitter.com/fontawesome",
    },
  },
  {
    title: "Remix Icon",
    description:
      "Remix Icon is a set of open-source, neutral-style system icons designed for web and mobile interfaces, providing easy customization and integration with CSS or SVG.",
    tag: ["Icon Library", "Open Source", "SVG", "UI Design", "Icons"],
    image: "/remixicon.png",
    links: {
      website: "https://remixicon.com/",
      github: "https://github.com/Remix-Design/RemixIcon",
    },
  },
  {
    title: "Flaticon",
    description:
      "Flaticon offers the world’s largest collection of free and premium icons, stickers, and animated icons available in multiple formats such as SVG, PNG, EPS, and PSD.",
    tag: [
      "Icon Resource",
      "Free Icons",
      "Premium Icons",
      "Design Assets",
      "Icons",
    ],
    image: "/Flaticon.png",
    links: {
      website: "https://www.flaticon.com/",
      twitter: "https://twitter.com/flaticon",
    },
  },
  {
    title: "Lucide",
    description:
      "Lucide is a beautifully consistent open-source icon library crafted by the community as an improved fork of Feather Icons, offering scalable and modern SVG icons for web apps.",
    tag: ["Icon Library", "Open Source", "Feather Icons", "SVG", "Icons"],
    image: "/lucide.png",
    links: {
      website: "https://lucide.dev/",
      github: "https://github.com/lucide-icons/lucide",
      twitter: "https://twitter.com/lucide_icons",
    },
  },
  {
    title: "The Noun Project",
    description:
      "The Noun Project is a massive collection of icons and symbol-graphics curated by a global community; perfect for designers and developers seeking royalty-free or licensed icons in multiple formats.",
    tag: ["Icon Library", "Symbols", "Design Assets", "Royalty-Free", "Icons"],
    image: "/thenounproject.png", // Place your image in /public folder
    links: {
      website: "https://thenounproject.com/",
      twitter: "https://twitter.com/nounproject",
    },
  },

  // Fonts
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
  {
    title: "Free Faces",
    description:
      "Free Faces is a curated collection of typefaces available under a variety of free licences, categorized by style (cursive, display, monospace, sans serif, serif, slab) for web designers and developers. :contentReference[oaicite:1]{index=1}",
    tag: [
      "Font Gallery",
      "Free Fonts",
      "Typography Resources",
      "Design Assets",
      "Fonts",
    ],
    image: "/freefaces.png", // Place your image in /public folder
    links: {
      website: "https://www.freefaces.gallery/",
    },
  },

  // Tools
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
  {
    title: "Lighthouse",
    description:
      "Lighthouse is an open-source tool by Google that audits website performance, accessibility, SEO, and best practices — helping developers build faster, more optimized web experiences.",
    tag: [
      "Performance",
      "SEO",
      "Accessibility",
      "Developer Tools",
      "Chrome Extension",
      "Tools",
    ],
    image: "/Lighthouse.png",
    links: {
      website:
        "https://chromewebstore.google.com/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk",
      github: "https://github.com/GoogleChrome/lighthouse",
    },
  },
  {
    title: "Unlighthouse",
    description:
      "Unlighthouse is an automated, fast, and developer-friendly tool that scans your entire website using Lighthouse to identify performance, accessibility, SEO, and best-practice issues—optimized for modern frameworks.",
    tag: [
      "Performance",
      "SEO",
      "Accessibility",
      "Developer Tools",
      "Auditing",
      "Tools",
    ],
    image: "/Unlighthouse.png",
    links: {
      website: "https://unlighthouse.dev/",
      github: "https://github.com/harlan-zw/unlighthouse",
    },
  },
  {
    title: "Spline",
    description:
      "Spline is a powerful browser-based 3D design tool that allows creators to build, animate, and export interactive 3D experiences for the web — without needing deep 3D or WebGL expertise.",
    tag: [
      "3D Design",
      "WebGL",
      "Interactive 3D",
      "Browser-based",
      "Collaboration",
      "Animation",
      "UI/UX",
      "Front-end",
      "Web Development",
      "Spline",
      "Tools",
      "Animation",
    ],
    image: "/spline.png",
    links: {
      website: "https://spline.design/",
      twitter: "https://x.com/splinetool",
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
  {
    title: "Skiper UI",
    description:
      "Skiper UI is a modern component library built on top of shadcn/ui, providing “un-common” React/Next.js components (animations, interactions, premium & free) designed with Tailwind CSS & Motion for high-impact UIs. :contentReference[oaicite:1]{index=1}",
    tag: [
      "Component Library",
      "Design Inspiration",
      "Creative Designs",
      "Frontend",
      "Shadcn/UI",
    ],
    image: "/skiper-ui.png",
    links: {
      website: "https://skiper-ui.com",
      twitter: "https://x.com/Gur__vi",
    },
  },

  //technologies
  {
    title: "React",
    description:
      "React is a JavaScript library for building fast, interactive user interfaces using a component-based architecture. It offers features like hooks, JSX, and a virtual DOM to simplify state management and improve performance.",
    tag: [
      "JavaScript",
      "Frontend",
      "UI Library",
      "Open Source",
      "Web Development",
      "React.js",
      "Technologies",
    ],
    image: "/reactjs.png",
    links: {
      website: "https://react.dev",
      twitter: "https://x.com/reactjs",
    },
  },
  {
    title: "Next.js",
    description:
      "Next.js is a React framework for building fast, scalable web applications with features like server-side rendering, static site generation, routing, and API endpoints.",
    tag: [
      "React",
      "Framework",
      "Frontend",
      "Fullstack",
      "Web Development",
      "Next.js",
      "Technologies",
    ],
    image: "/nextjs.png",
    links: {
      website: "https://nextjs.org",
      twitter: "https://x.com/nextjs",
    },
  },
  {
    title: "Framer Motion",
    description:
      "Motion is a powerful animation library for React, offering smooth, high-performance animations with an intuitive and flexible API.",
    tag: [
      "Animation",
      "React",
      "Framer Motion",
      "UI/UX",
      "Frontend",
      "Web Development",
      "Technologies",
    ],
    image: "/motion.png",
    links: {
      website: "https://motion.dev",
      twitter: "https://x.com/framer",
      github: "https://github.com/motiondivision/motion",
    },
  },
  {
    title: "GSAP",
    description:
      "GSAP is a powerful, high-performance JavaScript animation library used to create smooth, complex, and professional-grade web animations.",
    tag: [
      "Animation",
      "JavaScript",
      "Frontend",
      "UI/UX",
      "Web Development",
      "GSAP",
      "Technologies",
    ],
    image: "/gsap.png",
    links: {
      website: "https://gsap.com",
      twitter: "https://x.com/greensock",
      github: "https://github.com/greensock/GSAP",
    },
  },
  {
    title: "Three.js",
    description:
      "Three.js is a popular open-source JavaScript 3D library that makes WebGL easier to use — enabling developers to create immersive 3D graphics, animations and visualizations in the browser.",
    tag: [
      "3D",
      "JavaScript",
      "WebGL",
      "Graphics",
      "Animations",
      "Visualization",
      "Three.js",
      "Front-end",
      "Web Development",
      "Open Source",
      "Technologies",
    ],
    image: "/threejs.png",
    links: {
      website: "https://threejs.org/",
      twitter: "https://x.com/threejs",
      github: "https://github.com/mrdoob/three.js",
    },
  },

  //Socials
  {
    title: "Olivier Larose",
    description:
      "Olivier Larose is a web-developer and content creator who shares high-quality tutorials on web animations, frontend technologies, and real-world developer journeys.",
    tag: [
      "Web Animation",
      "Frontend",
      "JavaScript",
      "React",
      "Next.js",
      "GSAP",
      "Tutorials",
      "Web Development",
      "Socials",
      "Inspiration",
      "Olivier Larose",
    ],
    image: "/olivierlarose.png",
    imageLink: "https://www.youtube.com/@olivierlarose1",
    links: {
      website: "https://www.olivierlarose.com/",
      twitter: "https://x.com/olivierlarose_",
      youtube: "https://www.youtube.com/@olivierlarose1",
    },
  },
  {
    title: "Manu Arora",
    description:
      "Manu Arora is a full-stack developer, educator, and content creator known for sharing high-quality tutorials on React, Next.js, UI/UX, and modern frontend engineering practices.",
    tag: [
      "Frontend",
      "Full Stack",
      "React",
      "Next.js",
      "TailwindCSS",
      "UI/UX",
      "Web Development",
      "Tutorials",
      "Inspiration",
      "Manu Arora",
      "Socials",
    ],
    image: "/manuarora.png",
    imageLink: "https://www.youtube.com/@manuarora",
    links: {
      website: "https://manuarora.in",
      twitter: "https://x.com/mannupaaji",
      github: "https://github.com/manuarora700",
      youtube: "https://www.youtube.com/@manuarora",
    },
  },
  {
    title: "Rauno Freiberg",
    description:
      "Rauno Freiberg is a designer and developer known for crafting highly polished UI interactions, sharing insights on design systems, frontend engineering, and intuitive product experiences.",
    tag: [
      "Designer",
      "UI/UX",
      "Frontend",
      "React",
      "Design Systems",
      "Interaction Design",
      "Web Development",
      "Inspiration",
      "Rauno Freiberg",
      "Socials",
    ],
    image: "/raunofreiberg.png",
    links: {
      website: "https://raunofreiberg.com",
      twitter: "https://x.com/raunofreiberg",
    },
  },
  {
    title: "Huy Nguyen",
    description:
      "Huy Nguyen is a developer and creator known for building elegant tools like PillarStack and sharing insights on frontend engineering, indie hacking, and developer productivity.",
    tag: [
      "Frontend",
      "Indie Hacking",
      "React",
      "Next.js",
      "UI/UX",
      "Web Development",
      "Productivity",
      "Developer",
      "Inspiration",
      "Huy Nguyen",
      "Socials",
    ],
    image: "/huynguyen.png",
    imageLink: "https://www.youtube.com/@by_huy",
    links: {
      twitter: "https://x.com/by_huy",
      youtube: "https://www.youtube.com/@by_huy",
    },
  },
  {
    title: "CodeGrid",
    description:
      "CodeGrid shares the ‘sauce’ behind top-tier websites — high-quality tutorials on HTML, CSS, JavaScript, animations, scroll effects and UI engineering.",
    tag: [
      "Animation",
      "HTML",
      "CSS",
      "JavaScript",
      "Web Animation",
      "GSAP",
      "ScrollTrigger",
      "Front-end",
      "Tutorials",
      "Web Development",
      "CodeGrid",
      "Socials",
    ],
    image: "/codegrid.png",
    imageLink: "https://www.youtube.com/@codegrid",
    links: {
      twitter: "https://x.com/codegridweb", // from video descriptions :contentReference[oaicite:1]{index=1}
      youtube: "https://www.youtube.com/@codegrid",
    },
  },
  {
    title: "Syntax",
    description:
      "Syntax is a podcast-style YouTube channel hosted by Wes Bos and Scott Tolinski that delivers high-energy, practical conversations on full-stack web development—covering JavaScript, CSS, frameworks, tooling, and developer careers.",
    tag: [
      "Podcast",
      "Web Development",
      "Full Stack",
      "JavaScript",
      "CSS",
      "Frameworks",
      "Developer Careers",
      "Tooling",
      "Tutorials",
      "Syntax",
      "Socials",
      "Inspiration",
    ],
    image: "/syntax.png",
    imageLink: "https://www.youtube.com/@syntaxfm",
    links: {
      website: "https://syntax.fm/",
      twitter: "https://x.com/syntaxfm",
      youtube: "https://www.youtube.com/@syntaxfm",
    },
  },
  {
    title: "jhey ʕ•ᴥ•ʔ",
    description:
      "jhey is a Staff Design Engineer at Shopify (formerly at Google and Vercel) who shares insights on design systems, frontend architecture, accessibility and converting ideas into real products.",
    tag: [
      "Design Systems",
      "Frontend",
      "Accessibility",
      "UI/UX",
      "Engineering",
      "Web Development",
      "Shopify",
      "Tutorials",
      "Inspiration",
      "Socials",
      "jhey",
    ],
    image: "/jhey.png",
    imageLink: "https://x.com/jh3yy",
    links: {
      website: "https://www.jhey.dev/",
      twitter: "https://x.com/jh3yy",
    },
  },
  {
    title: "Guri",
    description:
      "Guri is a design engineer building @SkiperUi and sharing thoughts on frontend architecture, UI engineering and component libraries.",
    tag: [
      "Frontend",
      "Design Engineering",
      "UI Engineering",
      "Component Library",
      "Web Development",
      "React",
      "Building in Public",
      "Guri",
      "Socials",
    ],
    image: "/guri.png",
    imageLink: "https://x.com/Gur__vi",
    links: {
      website: "https://gxuri.in",
      twitter: "https://x.com/Gur__vi",
    },
  },
];

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

  const handleGoUpClick = () => {
    if (filterRef.current) {
      gsap.to(window, {
        duration: 0.1,
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
        className="size-15 fixed rounded-full bg-zinc-900 shadow-[inset_4px_4px_4px_rgba(255,255,255,0.04),inset_-4px_-4px_4px_rgba(0,0,0,0.5)] bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 right-3 sm:right-6 md:right-8 lg:right-30 flex justify-center items-center cursor-pointer go-up z-50"
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
          <h1 className="font-[Inria_Serif] text-[32px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[88px] font-bold bg-clip-text text-center text-transparent bg-linear-to-r from-[#3F3F3F] via-[#FFFFFF] to-[#3F3F3F] tracking-tighter px-2 sm:px-4 text-balance">
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
          <p className="text-[#888888] max-w-4xl font-[Inria_Serif] text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] text-center font-extralight tracking-tighter leading-5 sm:leading-7 px-4 sm:px-6 md:px-8">
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
