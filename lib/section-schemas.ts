/**
 * One definition per section, used in three places so they never drift:
 *  - the public submit form (/submit/<section>),
 *  - the review editor (/review), where you can fix anything before approving,
 *  - server-side validation (/api/submit, /api/ingest, /api/review).
 *
 * Client-safe: no server imports.
 */
import { CATEGORIES } from "@/types/resource";
import { MOTION_KINDS, MOTION_PLATFORMS } from "@/data/collections/motion";
import { ICON_COLORS, ICON_STYLES } from "@/data/collections/app-icons";
import { OG_STYLES, OG_THEMES } from "@/data/collections/og-images";

export type SectionKey = "resources" | "motion" | "og-images" | "app-icons" | "skills";

export type FieldType = "text" | "url" | "textarea" | "select" | "multiselect" | "tags" | "file";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: readonly string[];
  /** For files: accepted MIME types and max size in MB. */
  accept?: string;
  maxMb?: number;
  /** A file field may be satisfied by a URL field instead (e.g. icon from App Store). */
  orKey?: string;
};

export type SectionSchema = {
  key: SectionKey;
  label: string;
  /** Form title and button text. */
  noun: string;
  intro: string;
  fields: Field[];
  /** Field whose value identifies duplicates (normalised). */
  dedupeField: string;
  /** Field shown as the item's name in the review queue. */
  titleField: string;
};

export const SECTION_SCHEMAS: Record<SectionKey, SectionSchema> = {
  resources: {
    key: "resources",
    label: "Resources",
    noun: "resource",
    intro: "A tool, library, typeface, icon set or reference worth knowing. Socials link to an X profile.",
    dedupeField: "url",
    titleField: "title",
    fields: [
      { key: "title", label: "Name", type: "text", required: true, placeholder: "e.g. Radix UI" },
      { key: "url", label: "Website", type: "url", required: true, placeholder: "https://", hint: "For people, their X profile" },
      { key: "category", label: "Category", type: "select", required: true, options: CATEGORIES },
      { key: "description", label: "What it is", type: "textarea", required: true, placeholder: "One or two sentences, in plain words." },
      { key: "tags", label: "Tags", type: "tags", hint: "Comma separated, e.g. React, Open Source" },
    ],
  },
  motion: {
    key: "motion",
    label: "Motion",
    noun: "clip",
    intro: "An interaction or animation worth studying. Paste the X post — the video and maker are pulled in for you.",
    dedupeField: "post",
    titleField: "title",
    fields: [
      { key: "post", label: "X post", type: "url", required: true, placeholder: "https://x.com/…/status/…" },
      { key: "title", label: "What it shows", type: "text", required: true, placeholder: "e.g. Morphing toolbar" },
      { key: "authorName", label: "Maker", type: "text", placeholder: "Filled from the post if empty" },
      { key: "authorHandle", label: "Maker's X handle", type: "text", placeholder: "@handle" },
      { key: "kind", label: "Interaction", type: "multiselect", required: true, options: MOTION_KINDS },
      { key: "platform", label: "Platform", type: "multiselect", required: true, options: MOTION_PLATFORMS },
      { key: "stack", label: "Built with", type: "tags", hint: "If known, e.g. Motion, GSAP, SwiftUI" },
      { key: "note", label: "Why it works", type: "textarea", placeholder: "Optional — what makes it good" },
      { key: "video", label: "Video file", type: "file", accept: "video/mp4,video/webm", maxMb: 10, hint: "Optional if the X post has the video" },
    ],
  },
  "og-images": {
    key: "og-images",
    label: "OG Images",
    noun: "OG image",
    intro: "An Open Graph card that introduces its product well — the image a link becomes when shared.",
    dedupeField: "url",
    titleField: "title",
    fields: [
      { key: "title", label: "Product", type: "text", required: true },
      { key: "url", label: "Page it belongs to", type: "url", required: true, placeholder: "https://" },
      { key: "image", label: "OG image", type: "file", accept: "image/png,image/jpeg,image/webp", maxMb: 5, orKey: "url", hint: "Leave empty to use the page's own og:image" },
      { key: "style", label: "Style", type: "multiselect", required: true, options: OG_STYLES },
      { key: "theme", label: "Theme", type: "select", required: true, options: OG_THEMES },
      { key: "industry", label: "Industry", type: "text", required: true, placeholder: "e.g. Developer Tools" },
    ],
  },
  "app-icons": {
    key: "app-icons",
    label: "App Icons",
    noun: "app icon",
    intro: "An iOS or macOS icon with a strong mark. Paste the App Store link and the icon is fetched for you.",
    dedupeField: "link",
    titleField: "name",
    fields: [
      { key: "link", label: "App Store link", type: "url", required: true, placeholder: "https://apps.apple.com/…" },
      { key: "name", label: "App name", type: "text", required: true },
      { key: "developer", label: "Developer", type: "text", required: true },
      { key: "category", label: "Category", type: "text", required: true, placeholder: "e.g. Productivity" },
      { key: "style", label: "Style", type: "multiselect", required: true, options: ICON_STYLES },
      { key: "color", label: "Colour", type: "multiselect", required: true, options: ICON_COLORS },
      { key: "platform", label: "Platform", type: "multiselect", required: true, options: ["iOS", "macOS"] },
      { key: "image", label: "Icon (1024 px)", type: "file", accept: "image/png,image/webp", maxMb: 3, orKey: "link", hint: "Leave empty to use the App Store artwork" },
    ],
  },
  skills: {
    key: "skills",
    label: "Skills",
    noun: "skill",
    intro: "An agent skill that teaches design or frontend craft. Link the repository and its install command.",
    dedupeField: "repo",
    titleField: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "repo", label: "Repository", type: "url", required: true, placeholder: "https://github.com/…" },
      { key: "install", label: "Install command", type: "text", required: true, placeholder: "npx skills add owner/repo" },
      { key: "authorName", label: "Author", type: "text", required: true },
      { key: "description", label: "What it teaches", type: "textarea", required: true },
      { key: "topics", label: "Topics", type: "tags", required: true, hint: "e.g. Animation, Accessibility" },
      { key: "agents", label: "Works with", type: "multiselect", options: ["Claude Code", "Cursor", "Codex", "Windsurf", "Copilot"] },
      { key: "skills", label: "Included skills", type: "textarea", hint: "One per line: name — what it does" },
    ],
  },
};

export const SECTION_ORDER: SectionKey[] = ["resources", "motion", "og-images", "app-icons", "skills"];

export const isSectionKey = (v: unknown): v is SectionKey =>
  typeof v === "string" && v in SECTION_SCHEMAS;

/** Normalise a URL-ish value for duplicate detection. */
export function dedupeKey(value: string): string {
  try {
    const u = new URL(value.trim());
    const host = u.hostname.replace(/^www\./, "").replace(/^twitter\.com$/, "x.com");
    // X posts are identified by their status id alone.
    const status = u.pathname.match(/\/status\/(\d+)/);
    if (status) return `x:${status[1]}`;
    // App Store apps by their numeric id.
    const app = u.pathname.match(/\/id(\d+)/);
    if (host === "apps.apple.com" && app) return `appstore:${app[1]}`;
    return `${host}${u.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}

export type ItemData = Record<string, string | string[] | undefined>;

/**
 * Validate and normalise submitted values against a section's fields.
 * Returns clean data or a list of human-readable problems.
 */
export function validate(
  schema: SectionSchema,
  input: Record<string, unknown>,
  { hasFile = {} as Record<string, boolean> } = {},
): { data: ItemData; errors: string[] } {
  const data: ItemData = {};
  const errors: string[] = [];

  for (const f of schema.fields) {
    const raw = input[f.key];
    if (f.type === "file") {
      if (f.required && !hasFile[f.key] && !(f.orKey && input[f.orKey])) errors.push(`${f.label} is required.`);
      if (typeof raw === "string" && raw) data[f.key] = raw; // existing stored path
      continue;
    }
    if (f.type === "multiselect" || f.type === "tags") {
      const list = (Array.isArray(raw) ? raw : String(raw ?? "").split(","))
        .map((v) => String(v).trim())
        .filter(Boolean)
        .slice(0, 12);
      const clean = f.type === "multiselect" && f.options ? list.filter((v) => f.options!.includes(v)) : list;
      if (f.required && !clean.length) errors.push(`Choose at least one ${f.label.toLowerCase()}.`);
      if (clean.length) data[f.key] = [...new Set(clean)];
      continue;
    }
    const value = String(raw ?? "").trim().slice(0, f.type === "textarea" ? 2000 : 300);
    if (!value) {
      if (f.required) errors.push(`${f.label} is required.`);
      continue;
    }
    if (f.type === "url") {
      try {
        const u = new URL(value);
        if (!/^https?:$/.test(u.protocol)) throw 0;
      } catch {
        errors.push(`${f.label} must be a valid https:// link.`);
        continue;
      }
    }
    if (f.type === "select" && f.options && !f.options.includes(value)) {
      errors.push(`${f.label} must be one of: ${f.options.join(", ")}.`);
      continue;
    }
    data[f.key] = value;
  }
  return { data, errors };
}
