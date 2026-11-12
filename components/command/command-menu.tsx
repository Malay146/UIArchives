"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { resources as staticResources } from "@/lib/resources";
import { createSearch } from "@/lib/search/useProductSearch";
import { OPEN_COMMAND, requestCategory } from "@/lib/command";
import { SECTIONS } from "@/lib/sections";
import { getTheme, toggleTheme } from "@/lib/theme";
import { isSoundOn, setSoundOn } from "@/lib/sound";
import {
  CATEGORIES,
  type UiCardData,
  categoriesOf,
  isSocial,
  linkLabel,
  primaryCategory,
  primaryHref,
} from "@/types/resource";
import { Logo as ResourceLogo } from "@/components/directory/logo";
import {
  ArrowDownGlyph18,
  ArrowUpGlyph18,
  BookGlyph18,
  EnterKeyGlyph18,
  GithubGlyph32,
  GridGlyph18,
  HashtagGlyph18,
  MagnifierGlyph18,
  MoonGlyph18,
  PlusGlyph18,
  SunGlyph18,
  VolumeGlyph18,
} from "@/components/icons";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type CommandPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  description: string;
  readingTime: string;
};

type Group = "Recent" | "Resources" | "Categories" | "Journal" | "Actions";

type Item =
  | { kind: "resource"; id: string; group: Group; resource: UiCardData }
  | { kind: "post"; id: string; group: Group; post: CommandPost }
  | { kind: "category"; id: string; group: Group; category: string; count: number }
  | {
      kind: "action";
      id: string;
      group: Group;
      title: string;
      hint: string;
      keywords: string;
      icon: React.ReactNode;
      run: () => void;
    };

const GROUP_ORDER: Group[] = ["Recent", "Resources", "Categories", "Journal", "Actions"];
const RECENT_KEY = "cmdk-recent";
const SITE = "https://uiarchives.com";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const norm = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

const words = (q: string) => norm(q).split(/\s+/).filter(Boolean);

const matchesAll = (haystack: string, q: string) => {
  const h = norm(haystack);
  return words(q).every((w) => h.includes(w));
};

/** Brightens the parts of `text` that match the query; the rest stays muted. */
function Highlight({ text, query }: { text: string; query: string }) {
  const terms = words(query);
  if (!terms.length) return <>{text}</>;
  const n = norm(text);
  const marks = new Array(text.length).fill(false);
  for (const t of terms) {
    let i = n.indexOf(t);
    while (i !== -1) {
      for (let k = i; k < i + t.length; k++) marks[k] = true;
      i = n.indexOf(t, i + t.length);
    }
  }
  const parts: { s: string; on: boolean }[] = [];
  for (let i = 0; i < text.length; i++) {
    const last = parts[parts.length - 1];
    if (last && last.on === marks[i]) last.s += text[i];
    else parts.push({ s: text[i], on: marks[i] });
  }
  return (
    <>
      {parts.map((p, i) =>
        p.on ? (
          <span key={i} className="text-fg">
            {p.s}
          </span>
        ) : (
          <span key={i} className="text-fg-3">
            {p.s}
          </span>
        ),
      )}
    </>
  );
}

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function pushRecent(title: string) {
  try {
    const next = [title, ...readRecent().filter((t) => t !== title)].slice(0, 4);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-grid h-[18px] min-w-[18px] place-items-center rounded-[4px] border border-line-strong px-1 font-sans text-[11px] leading-none text-fg-2">
      {children}
    </kbd>
  );
}

const iconClass = "size-[14px] shrink-0 text-fg-2";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function CommandMenu({ posts }: { posts: CommandPost[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);
  const [mod, setMod] = useState("⌘");
  const [tick, setTick] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const pointerMoved = useRef(false);

  // Built-in resources ship with the page; ones approved on /review are
  // fetched once, the first time the menu opens.
  const [approved, setApproved] = useState<UiCardData[]>([]);
  const fetchedApproved = useRef(false);
  useEffect(() => {
    if (!open || fetchedApproved.current) return;
    fetchedApproved.current = true;
    fetch("/api/resources/approved")
      .then((r) => (r.ok ? (r.json() as Promise<UiCardData[]>) : []))
      .then((list: UiCardData[]) => Array.isArray(list) && list.length && setApproved(list))
      .catch(() => {});
  }, [open]);
  const cardData = useMemo(() => [...staticResources, ...approved], [approved]);

  const search = useMemo(() => createSearch(cardData), [cardData]);
  const byTitle = useMemo(
    () => new Map(cardData.map((r) => [r.title, r])),
    [cardData],
  );

  /* ---------- open / close ---------- */

  const show = useCallback(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    setRecent(readRecent());
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setScope(null);
    setFlash(null);
    restoreRef.current?.focus?.();
  }, []);

  useEffect(() => {
    setMod(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl");
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (o) {
            setQuery("");
            setScope(null);
            return false;
          }
          restoreRef.current = document.activeElement as HTMLElement | null;
          setRecent(readRecent());
          return true;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND, show);
    };
  }, [show]);

  // Lock page scroll and focus the input while open.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      html.style.overflow = prev;
    };
  }, [open]);

  /* ---------- actions ---------- */

  const goToCategory = useCallback(
    (category: string) => {
      if (pathname === "/") {
        requestCategory(category);
        document.getElementById("index")?.scrollIntoView({ block: "start" });
      } else {
        router.push(`/?c=${encodeURIComponent(category)}#index`);
      }
    },
    [pathname, router],
  );

  const actions = useMemo<Item[]>(() => {
    const dark = open && getTheme() === "dark";
    const soundOn = open && isSoundOn();
    return [
      {
        kind: "action",
        id: "a-theme",
        group: "Actions",
        title: dark ? "Switch to light theme" : "Switch to dark theme",
        hint: "Change how the archive looks. Your choice is remembered.",
        keywords: "theme dark light mode appearance contrast",
        icon: dark ? <SunGlyph18 className={iconClass} /> : <MoonGlyph18 className={iconClass} />,
        run: toggleTheme,
      },
      {
        kind: "action",
        id: "a-sound",
        group: "Actions",
        title: soundOn ? "Turn sounds off" : "Turn sounds on",
        hint: "A single soft click when you press something.",
        keywords: "sound audio click mute volume",
        icon: <VolumeGlyph18 className={iconClass} />,
        run: () => setSoundOn(!isSoundOn()),
      },
      {
        kind: "action",
        id: "a-index",
        group: "Actions",
        title: "Go to Resources",
        hint: "Every resource, in one list.",
        keywords: "home index browse all resources",
        icon: <GridGlyph18 className={iconClass} />,
        run: () => router.push("/#index"),
      },
      ...SECTIONS.filter((x) => x.slug !== "resources").map(
        (x): Item => ({
          kind: "action",
          id: `a-section-${x.slug}`,
          group: "Actions",
          title: `Go to ${x.label}`,
          hint: x.blurb,
          keywords: `${x.label} ${x.blurb} section`,
          icon: <GridGlyph18 className={iconClass} />,
          run: () => router.push(x.href),
        }),
      ),
      {
        kind: "action",
        id: "a-journal",
        group: "Actions",
        title: "Read the journal",
        hint: "Notes on interface design and tooling.",
        keywords: "journal blog posts articles notes",
        icon: <BookGlyph18 className={iconClass} />,
        run: () => router.push("/blog"),
      },
      {
        kind: "action",
        id: "a-submit",
        group: "Actions",
        title: "Submit a resource",
        hint: "Suggest something worth adding.",
        keywords: "submit add suggest resource contribute",
        icon: <PlusGlyph18 className={iconClass} />,
        run: () => router.push("/submit"),
      },
      {
        kind: "action",
        id: "a-github",
        group: "Actions",
        title: "View source on GitHub",
        hint: "UIArchives is open source.",
        keywords: "github source code repository star",
        icon: <GithubGlyph32 className={iconClass} />,
        run: () => window.open("https://github.com/Malay146/UIArchives", "_blank", "noopener"),
      },
    ];
  }, [open, router, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- results ---------- */

  const items = useMemo<Item[]>(() => {
    if (!open) return [];
    const q = query.trim();
    const out: Item[] = [];
    const resourceItem = (r: UiCardData, group: Group): Item => ({
      kind: "resource",
      id: `${group}-${r.title}`,
      group,
      resource: r,
    });

    // Scoped: only that category's resources.
    if (scope) {
      const pool = (q ? search(q) : cardData).filter((r) =>
        (categoriesOf(r) as string[]).includes(scope),
      );
      return pool.map((r) => resourceItem(r, "Resources"));
    }

    if (!q) {
      recent
        .map((t) => byTitle.get(t))
        .filter((r): r is UiCardData => !!r)
        .forEach((r) => out.push(resourceItem(r, "Recent")));
      CATEGORIES.forEach((c) =>
        out.push({
          kind: "category",
          id: `c-${c}`,
          group: "Categories",
          category: c,
          count: cardData.filter((r) => (categoriesOf(r) as string[]).includes(c)).length,
        }),
      );
      posts.slice(0, 3).forEach((p) =>
        out.push({ kind: "post", id: `p-${p.slug}`, group: "Journal", post: p }),
      );
      out.push(...actions);
      return out;
    }

    search(q)
      .slice(0, 8)
      .forEach((r) => out.push(resourceItem(r, "Resources")));
    CATEGORIES.filter((c) => matchesAll(c, q)).forEach((c) =>
      out.push({
        kind: "category",
        id: `c-${c}`,
        group: "Categories",
        category: c,
        count: cardData.filter((r) => (categoriesOf(r) as string[]).includes(c)).length,
      }),
    );
    posts
      .filter((p) => matchesAll(`${p.title} ${p.category} ${p.description}`, q))
      .slice(0, 4)
      .forEach((p) => out.push({ kind: "post", id: `p-${p.slug}`, group: "Journal", post: p }));
    actions
      .filter((a) => a.kind === "action" && matchesAll(`${a.title} ${a.keywords}`, q))
      .forEach((a) => out.push(a));

    return out.sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));
  }, [open, query, scope, search, recent, byTitle, posts, actions, cardData]);

  // Keep a valid selection; reset to the top whenever the results change shape.
  useEffect(() => {
    setActiveId(items[0]?.id ?? null);
  }, [query, scope, open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeId && !items.some((i) => i.id === activeId)) {
      setActiveId(items[0]?.id ?? null);
    }
  }, [items, activeId]);

  const activeIndex = items.findIndex((i) => i.id === activeId);
  const active = items[activeIndex] ?? null;

  useEffect(() => {
    if (!activeId) return;
    document
      .getElementById(`cmd-${activeId}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  /* ---------- run ---------- */

  const linkOf = (item: Item | null): string | null => {
    if (!item) return null;
    if (item.kind === "resource") return primaryHref(item.resource);
    if (item.kind === "post") return `${SITE}/blog/${item.post.slug}`;
    if (item.kind === "category") return `${SITE}/?c=${encodeURIComponent(item.category)}`;
    return null;
  };

  const run = (item: Item | null) => {
    if (!item) return;
    switch (item.kind) {
      case "resource":
        pushRecent(item.resource.title);
        window.open(primaryHref(item.resource), "_blank", "noopener,noreferrer");
        close();
        break;
      case "post":
        close();
        router.push(`/blog/${item.post.slug}`);
        break;
      case "category":
        close();
        goToCategory(item.category);
        break;
      case "action":
        // Toggles keep the menu open so the change can be seen and undone.
        if (item.id === "a-theme" || item.id === "a-sound") {
          item.run();
          setTick((t) => t + 1);
          setFlash(item.id === "a-theme" ? "Theme changed" : "Sound setting changed");
        } else {
          close();
          item.run();
        }
        break;
    }
  };

  const copy = async (item: Item | null) => {
    const link = linkOf(item);
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setFlash("Link copied");
    } catch {
      setFlash("Couldn’t copy");
    }
  };

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 1400);
    return () => clearTimeout(t);
  }, [flash]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const move = (d: number) => {
      if (!items.length) return;
      const next = (activeIndex + d + items.length) % items.length;
      setActiveId(items[next].id);
    };
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Home":
        if (!query) {
          e.preventDefault();
          setActiveId(items[0]?.id ?? null);
        }
        break;
      case "End":
        if (!query) {
          e.preventDefault();
          setActiveId(items[items.length - 1]?.id ?? null);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (e.metaKey || e.ctrlKey) void copy(active);
        else run(active);
        break;
      case "Tab":
        e.preventDefault();
        if (active?.kind === "category") {
          setScope(active.category);
          setQuery("");
        }
        break;
      case "Backspace":
        if (!query && scope) {
          e.preventDefault();
          setScope(null);
        }
        break;
      case "Escape":
        e.preventDefault();
        if (scope) setScope(null);
        else close();
        break;
    }
  };

  if (!open) return null;

  /* ---------- render ---------- */

  let lastGroup: Group | null = null;
  const placeholder = scope
    ? `Search ${scope.toLowerCase()}…`
    : "Search resources, journal and actions…";

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/25 dark:bg-black/60"
        onPointerDown={close}
        data-sound="close"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="absolute top-[12vh] left-1/2 flex max-h-[min(560px,76vh)] w-[min(760px,calc(100vw-24px))] -translate-x-1/2 flex-col overflow-hidden rounded-xl bg-bg shadow-[0_0_0_1px_var(--line-strong),0_24px_64px_-16px_rgb(0_0_0/0.35)]"
      >
        {/* Input */}
        <div className="flex h-[52px] shrink-0 items-center gap-2.5 border-b px-4">
          <MagnifierGlyph18 aria-hidden="true" className="size-[15px] shrink-0 text-fg-3" />
          {scope && (
            <button
              type="button"
              onClick={() => {
                setScope(null);
                inputRef.current?.focus();
              }}
              className="flex h-6 shrink-0 items-center gap-1.5 rounded-md bg-fg px-2 text-[12px] font-medium text-bg"
              aria-label={`Remove ${scope} scope`}
            >
              <HashtagGlyph18 aria-hidden="true" className="size-3" />
              {scope}
            </button>
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={activeId ? `cmd-${activeId}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-fg-3 focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={close}
            data-sound="close"
            className="shrink-0"
            aria-label="Close command menu"
          >
            <Kbd>esc</Kbd>
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1">
          <div
            ref={listRef}
            id="cmd-list"
            role="listbox"
            aria-label="Results"
            className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 md:max-w-[420px] md:border-r"
            onPointerMove={() => (pointerMoved.current = true)}
          >
            {items.length === 0 && (
              <div className="px-3 py-10 text-center">
                <p>No results for “{query}”.</p>
                <p className="mt-1 text-fg-3">
                  {scope ? "Press ⌫ to search everything." : "Try a shorter or different word."}
                </p>
              </div>
            )}

            {items.map((item) => {
              const header = item.group !== lastGroup ? item.group : null;
              lastGroup = item.group;
              const selected = item.id === activeId;
              return (
                <Fragment key={item.id}>
                  {header && (
                    <div
                      role="presentation"
                      className="flex items-center justify-between px-2.5 pt-3 pb-1.5 text-[12px] text-fg-3 first:pt-1"
                    >
                      <span>{scope ? `${scope}` : header}</span>
                      {scope && <span className="tabular-nums">{items.length}</span>}
                    </div>
                  )}
                  <div
                    id={`cmd-${item.id}`}
                    role="option"
                    aria-selected={selected}
                    onPointerMove={() => {
                      if (pointerMoved.current && !selected) setActiveId(item.id);
                    }}
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => run(item)}
                    className={`relative flex h-9 cursor-pointer items-center gap-2.5 rounded-md px-2.5 ${
                      selected ? "bg-hover text-fg" : "text-fg-2"
                    }`}
                  >
                    {selected && (
                      <span
                        aria-hidden="true"
                        className="absolute top-2.5 bottom-2.5 left-0 w-[2px] rounded-full bg-fg"
                      />
                    )}
                    <ItemRow item={item} query={query} selected={selected} scoped={!!scope} />
                  </div>
                </Fragment>
              );
            })}
          </div>

          <aside className="scrollbar-none hidden min-h-0 w-[340px] shrink-0 overflow-y-auto md:block" aria-live="polite">
            {active && <Preview item={active} />}
          </aside>
        </div>

        {/* Footer */}
        <div className="flex h-10 shrink-0 items-center gap-4 border-t px-4 text-[12px] text-fg-3">
          <span className="flex items-center gap-1.5">
            <Kbd>
              <ArrowUpGlyph18 className="size-2.5" />
            </Kbd>
            <Kbd>
              <ArrowDownGlyph18 className="size-2.5" />
            </Kbd>
            Move
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>
              <EnterKeyGlyph18 className="size-2.5" />
            </Kbd>
            {active?.kind === "resource" ? "Open site" : active?.kind === "category" ? "Filter" : "Open"}
          </span>
          {linkOf(active) && (
            <span className="hidden items-center gap-1.5 sm:flex">
              <Kbd>{mod}</Kbd>
              <Kbd>
                <EnterKeyGlyph18 className="size-2.5" />
              </Kbd>
              Copy link
            </span>
          )}
          {active?.kind === "category" && !scope && (
            <span className="hidden items-center gap-1.5 sm:flex">
              <Kbd>tab</Kbd>
              Search within
            </span>
          )}
          {scope && (
            <span className="hidden items-center gap-1.5 sm:flex">
              <Kbd>⌫</Kbd>
              Leave {scope}
            </span>
          )}
          <span className="ml-auto text-fg-2" aria-live="polite">
            {flash}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rows                                                                */
/* ------------------------------------------------------------------ */

function ItemRow({
  item,
  query,
  selected,
  scoped,
}: {
  item: Item;
  query: string;
  selected: boolean;
  scoped: boolean;
}) {
  const trailing = (text: string) => (
    <span className={`ml-auto shrink-0 pl-3 text-[12px] ${selected ? "text-fg-2" : "text-fg-3"}`}>
      {text}
    </span>
  );

  switch (item.kind) {
    case "resource": {
      const r = item.resource;
      return (
        <>
          <ResourceLogo resource={r} className="size-[18px]" />
          <span className="truncate">
            {query ? <Highlight text={r.title} query={query} /> : r.title}
          </span>
          {trailing(scoped ? linkLabel(r) : primaryCategory(r))}
        </>
      );
    }
    case "post":
      return (
        <>
          <BookGlyph18 className={iconClass} />
          <span className="truncate">
            {query ? <Highlight text={item.post.title} query={query} /> : item.post.title}
          </span>
          {trailing(item.post.readingTime.replace(" read", ""))}
        </>
      );
    case "category":
      return (
        <>
          <HashtagGlyph18 className={iconClass} />
          <span className="truncate">
            {query ? <Highlight text={item.category} query={query} /> : item.category}
          </span>
          {trailing(String(item.count))}
        </>
      );
    case "action":
      return (
        <>
          {item.icon}
          <span className="truncate">
            {query ? <Highlight text={item.title} query={query} /> : item.title}
          </span>
        </>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Preview                                                             */
/* ------------------------------------------------------------------ */

function Preview({ item }: { item: Item }) {
  if (item.kind === "resource") {
    const r = item.resource;
    const links = [
      { label: isSocial(r) ? "X" : "Website", value: linkLabel(r) },
    ];

    return (
      <div className="p-4">
        {r.image && (
          <div className="overflow-hidden rounded-lg shadow-[0_0_0_1px_var(--line)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={r.image}
              src={r.image}
              alt=""
              className="block aspect-[16/10] w-full object-cover object-top grayscale"
            />
          </div>
        )}
        <div className="mt-4 flex items-center gap-2.5">
          <ResourceLogo resource={r} className="size-5" />
          <span className="truncate font-medium">{r.title}</span>
        </div>
        <p className="mt-2 text-fg-2">{r.description}</p>
        <dl className="mt-4 flex flex-col border-t text-[13px]">
          <div className="flex justify-between gap-4 border-b py-2">
            <dt className="text-fg-3">Category</dt>
            <dd className="truncate">{categoriesOf(r).join(", ") || primaryCategory(r)}</dd>
          </div>
          {links.map((l) => (
            <div key={l.label} className="flex justify-between gap-4 border-b py-2">
              <dt className="text-fg-3">{l.label}</dt>
              <dd className="truncate">{l.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  if (item.kind === "post") {
    const p = item.post;
    return (
      <div className="p-4">
        <p className="text-[12px] text-fg-3">
          {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(p.date))}
          {" · "}
          {p.readingTime}
          {" · "}
          {p.category}
        </p>
        <p className="mt-2 font-medium">{p.title}</p>
        <p className="mt-2 text-fg-2">{p.description}</p>
      </div>
    );
  }

  if (item.kind === "category") {
    const sample = staticResources
      .filter((r) => (categoriesOf(r) as string[]).includes(item.category))
      .slice(0, 6);
    return (
      <div className="p-4">
        <p className="font-medium">{item.category}</p>
        <p className="mt-1 text-fg-2">
          {item.count} resources. Press ↵ to filter the index, or tab to search within.
        </p>
        <ul className="mt-4 flex flex-col border-t">
          {sample.map((r) => (
            <li key={r.title} className="flex items-center gap-2.5 border-b py-2">
              <ResourceLogo resource={r} className="size-4" />
              <span className="truncate text-[13px]">{r.title}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2.5">
        {item.icon}
        <p className="font-medium">{item.title}</p>
      </div>
      <p className="mt-2 text-fg-2">{item.hint}</p>
    </div>
  );
}

export function CommandTrigger({ className = "" }: { className?: string }) {
  const [mod, setMod] = useState("⌘");
  useEffect(() => {
    setMod(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl");
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND))}
      className={`press group flex h-7 items-center gap-2 rounded-md pr-1 pl-2 text-fg-2 shadow-[0_0_0_1px_var(--line-strong)] transition-colors hover:text-fg ${className}`}
      aria-label="Open command menu"
      aria-haspopup="dialog"
      aria-keyshortcuts="Meta+K Control+K"
    >
      <MagnifierGlyph18 aria-hidden="true" className="size-3" />
      <span className="hidden sm:inline">Search</span>
      <span className="hidden items-center gap-0.5 sm:flex">
        <Kbd>{mod}</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}
