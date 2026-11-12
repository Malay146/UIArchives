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
    repo: "https://github.com/emilkowalski/skill",
    install: "npx skills add emilkowalski/skill",
    description:
      "Emil Kowalski's design-engineering judgement as agent skills: when to animate and when not to, which easing and duration to use, and the small component details that make an interface feel right.",
    topics: ["Animation", "Interaction", "Components"],
    agents: ["Claude Code", "Cursor", "Codex"],
    skills: [
      { name: "emil-design-eng", summary: "Philosophy on UI polish, component design and animation decisions." },
      { name: "review-animations", summary: "Reviews motion code against a high craft bar." },
      { name: "remove-animations", summary: "Finds and removes animations an interface doesn't need." },
      { name: "prototype", summary: "Builds several versions of a UI piece behind a live picker." },
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
];
