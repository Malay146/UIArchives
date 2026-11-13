/**
 * Skills — packaged instructions that teach coding agents a craft.
 * Each entry is a repository; `skills` lists what it contains.
 */

export type Skill = {
  id: string;
  name: string;
  author: { name: string; handle?: string };
  repo: string;
  install: string;
  description: string;
  topics: string[];
  /** Agents the skill is written for. */
  agents: string[];
  skills: { name: string; summary: string }[];
  license?: string;
};

export const skills: Skill[] = [
  {
    id: "emil-design-eng",
    name: "Emil Kowalski — Design Engineering",
    author: { name: "Emil Kowalski", handle: "emilkowalski" },
    repo: "https://github.com/emilkowalski/skills",
    install: "npx skills add emilkowalski/skills",
    description:
      "Emil Kowalski's design-engineering judgement as agent skills: when to animate and when not to, which easing and duration to use, and the small component details that make an interface feel right.",
    topics: ["Animation", "Interaction", "Components"],
    agents: ["Claude Code", "Cursor", "Codex"],
    skills: [
      { name: "emil-design-eng", summary: "Philosophy on UI polish, component design and animation decisions." },
      { name: "review-animations", summary: "Reviews motion code against a high craft bar." },
      { name: "remove-animations", summary: "Finds and removes animations an interface doesn't need." },
      { name: "prototype", summary: "Builds several genuinely different versions of a UI piece behind a live picker; run it by name." },
      { name: "apple-design", summary: "Apple's approach to fluid, physical motion and interface design from WWDC talks, translated for the web." },
      { name: "animation-vocabulary", summary: "Turns a vague description of a motion effect into its exact name, so you can prompt for it." },
    ],
    license: "MIT",
  },
  {
    id: "anthropic-canvas-design",
    name: "Anthropic — Canvas Design",
    author: { name: "Anthropic", handle: "anthropics" },
    repo: "https://github.com/anthropics/skills",
    install: "npx skills add anthropics/skills --skill canvas-design",
    description:
      "Anthropic's official skill for static visual design: the agent first writes a short design philosophy, then expresses it as an original poster or artwork, exported as PNG or PDF.",
    topics: ["Graphics", "Typography", "Layout"],
    agents: ["Claude Code", "Cursor", "Codex"],
    skills: [
      { name: "canvas-design", summary: "Creates posters and static artwork as PNG or PDF from a written design philosophy." },
    ],
  },
  {
    id: "apple-hig-skills",
    name: "Apple Human Interface Guidelines",
    author: { name: "Raintree Technology", handle: "raintree-technology" },
    repo: "https://github.com/raintree-technology/apple-hig-skills",
    install: "npx skills add raintree-technology/apple-hig-skills",
    description:
      "Apple's Human Interface Guidelines as fourteen agent skills — foundations, patterns, components, inputs and platforms — so agents design with Apple's conventions for colour, type, layout, motion and accessibility.",
    topics: ["Guidelines", "Accessibility", "Typography", "Layout"],
    agents: ["Claude Code", "Cursor", "Codex"],
    skills: [
      { name: "hig-foundations", summary: "Colour, typography, layout, motion, dark mode, accessibility, writing." },
      { name: "hig-patterns", summary: "Onboarding, loading, search, feedback, modality and more." },
      { name: "hig-components-search", summary: "Search fields, page controls and path controls." },
      { name: "hig-components-layout", summary: "Navigation, sidebars, split views and tab bars." },
    ],
  },
  {
    id: "jakubkrehel-skills",
    name: "Jakub Krehel — Interface Skills",
    author: { name: "Jakub Krehel", handle: "jakubkrehel" },
    repo: "https://github.com/jakubkrehel/skills",
    install: "npx skills add jakubkrehel/skills",
    description:
      "Fourteen agent skills from the author of Interfaces magazine for building and reviewing interfaces: UI polish with exact values, typography, colour systems, accessibility, layout and product writing, plus review, stress-test and variant workflows.",
    topics: ["Components", "Typography", "Color", "Accessibility", "Layout", "Writing"],
    agents: ["Claude Code", "Cursor", "Codex", "OpenCode"],
    skills: [
      { name: "better-interface", summary: "Reviews a screen, flow or whole interface and returns one ranked report." },
      { name: "better-ui", summary: "Polishes border radius, optical alignment, shadows, icon states and animation with exact values." },
      { name: "better-typography", summary: "Type scale, spacing, font features, wrapping, truncation and punctuation." },
      { name: "better-colors", summary: "Generates palettes, names semantic tokens, converts formats and measures contrast." },
      { name: "better-accessibility", summary: "Keyboard and focus, ARIA, accessible names, forms, motion and zoom against WCAG 2.2." },
      { name: "better-layout", summary: "Grouping, alignment, reading order, responsive structure and room for translated text." },
      { name: "better-writing", summary: "Labels, errors, empty states and confirmations in the product's voice." },
      { name: "interface-review", summary: "Reviews a branch, pull request or uncommitted change for interface regressions." },
      { name: "explain-interface", summary: "Explains how a site, effect or animation was built from a URL or screenshot." },
      { name: "break", summary: "Stress-tests a component under every scenario that can reach it." },
      { name: "build-design", summary: "Builds UI from a Figma file or design image using the project's tokens and components." },
      { name: "state-machine", summary: "Renders every state of a component on a throwaway page with mock data." },
      { name: "variant", summary: "Builds several variants of a component to iterate on and pick from." },
      { name: "afk", summary: "Works through a project while you're away and leaves a report of improvements." },
    ],
    license: "MIT",
  },
  {
    id: "reanimate",
    name: "reanimate",
    author: { name: "Niaz Morshed", handle: "NiazMorshed2007" },
    repo: "https://github.com/NiazMorshed2007/reanimate",
    install: "npx skills add NiazMorshed2007/reanimate -g",
    description:
      "Reverse-engineers an animation frame by frame — from a live site, screen recording, mp4, gif or Lottie file — rebuilds it in your code with CSS, Framer Motion, GSAP or three.js, then films the copy and compares timing, easing and pixels until it moves the same.",
    topics: ["Animation", "Motion", "WebGL"],
    agents: ["Claude Code"],
    skills: [
      { name: "reanimate", summary: "Captures, specs, builds and verifies a clone of any animation, with frame-by-frame comparison and easing fits." },
    ],
    license: "MIT",
  },
];
