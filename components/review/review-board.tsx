"use client";

import { useCallback, useMemo, useState } from "react";
import { Sheet, SheetSection } from "@/components/ui/sheet";
import { FilterBar } from "@/components/collection/filter-bar";
import { Button } from "@/components/ui/button";
import { ArrowUpRightGlyph18 } from "@/components/icons";
import {
  type Field as FieldDef,
  type ItemData,
  SECTION_ORDER,
  SECTION_SCHEMAS,
  type SectionKey,
} from "@/lib/section-schemas";

/** Mirrors lib/server/db.ts Item (client-safe copy). */
type Item = {
  id: string;
  section: SectionKey;
  status: "pending" | "approved" | "rejected";
  source: "submission" | "automation";
  origin: string | null;
  data: ItemData;
  submitter_name: string | null;
  submitter_email: string | null;
  review_note: string | null;
  created_at: number;
};
type Status = Item["status"];
type Run = { started_at: number; source: string; found: number; queued: number; error: string | null };

const ago = (t: number) => {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
};

const titleOf = (it: Item) => String(it.data[SECTION_SCHEMAS[it.section].titleField] ?? "Untitled");
const linkOf = (it: Item) => String(it.data[SECTION_SCHEMAS[it.section].dedupeField] ?? "");
const hostOf = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
};

/**
 * The private review queue. Pending first; open an item to fix any field,
 * preview its media, add a note for the submitter, and approve or reject.
 * Approved items appear on the site immediately; submitters are emailed.
 */
export function ReviewBoard({
  admin,
  initial,
  counts,
  runs,
}: {
  admin: string;
  initial: Record<Status, Item[]>;
  counts: Record<string, number>;
  runs: Run[];
}) {
  const [items, setItems] = useState(initial);
  const [status, setStatus] = useState<Status>("pending");
  const [section, setSection] = useState<SectionKey | "all">("all");
  const [open, setOpen] = useState<Item | null>(null);
  const [frozen, setFrozen] = useState<Item[]>([]);
  const [addUrl, setAddUrl] = useState("");
  const [addMsg, setAddMsg] = useState<string | null>(null);

  const list = useMemo(
    () => items[status].filter((i) => section === "all" || i.section === section),
    [items, status, section],
  );

  const sectionCounts = useMemo(() => {
    const c: Record<string, number> = { all: items[status].length };
    for (const k of SECTION_ORDER) c[k] = items[status].filter((i) => i.section === k).length;
    return c;
  }, [items, status]);

  const openItem = useCallback(
    (it: Item) => {
      setFrozen((f) => (open && f.includes(it) ? f : list));
      setOpen(it);
    },
    [list, open],
  );

  /** After a decision: move the item between lists and advance to the next pending one. */
  const decided = (updated: Item, from: Status) => {
    setItems((s) => ({
      ...s,
      [from]: s[from].filter((i) => i.id !== updated.id),
      [updated.status]: [updated, ...s[updated.status as Status].filter((i) => i.id !== updated.id)],
    }));
    const idx = frozen.findIndex((i) => i.id === updated.id);
    const next = frozen.filter((i) => i.id !== updated.id)[idx] ?? null;
    setFrozen((f) => f.filter((i) => i.id !== updated.id));
    setOpen(next);
  };

  const quickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddMsg("Looking it up…");
    const res = await fetch("/api/review/add", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: addUrl }) });
    const body = (await res.json().catch(() => ({}))) as { error?: string; item?: Item };
    if (!res.ok || !body.item) return setAddMsg(body.error ?? "Couldn't add that link.");
    setItems((s) => ({ ...s, pending: [body.item!, ...s.pending] }));
    setAddUrl("");
    setAddMsg(`Queued in ${SECTION_SCHEMAS[body.item.section].label}.`);
  };

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* Header row */}
      <section className="grid gap-8 border-b px-4 pt-10 pb-8 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <h1 className="font-medium">Review</h1>
          <p className="mt-1 text-fg-2">
            Approved items go live immediately; submitters are emailed either way.
          </p>
          <form onSubmit={quickAdd} className="mt-6 flex max-w-[520px] items-center gap-2">
            <input
              value={addUrl}
              onChange={(e) => setAddUrl(e.target.value)}
              placeholder="Add by link — X post, App Store, GitHub or any site"
              className="h-9 min-w-0 flex-1 rounded-md bg-hover px-3 outline-none placeholder:text-fg-3 focus-visible:shadow-[inset_0_0_0_1px_var(--fg)]"
            />
            <Button type="submit" variant="secondary" disabled={!addUrl}>
              Add
            </Button>
          </form>
          {addMsg && <p className="mt-2 text-[13px] text-fg-3" aria-live="polite">{addMsg}</p>}
        </div>
        <dl className="flex gap-8">
          {(["pending", "approved", "rejected"] as Status[]).map((s) => (
            <div key={s} className="flex flex-col">
              <dt className="text-fg-3 capitalize">{s}</dt>
              <dd className="tabular-nums">{items[s].length}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Filters */}
      <FilterBar
        groups={[
          {
            key: "status",
            label: "Status",
            options: (["pending", "approved", "rejected"] as Status[]).map((s) => ({
              value: s,
              label: s[0].toUpperCase() + s.slice(1),
              count: items[s].length,
              active: s === status,
            })),
          },
          {
            key: "section",
            label: "Section",
            options: [
              { value: "all", label: "All", count: sectionCounts.all, active: section === "all" },
              ...SECTION_ORDER.map((k) => ({
                value: k,
                label: SECTION_SCHEMAS[k].label,
                count: sectionCounts[k],
                active: section === k,
                disabled: section !== k && sectionCounts[k] === 0,
              })),
            ],
          },
        ]}
        onToggle={(key, value) => (key === "status" ? setStatus(value as Status) : setSection(value as SectionKey | "all"))}
      />

      {/* Queue */}
      {list.length === 0 ? (
        <div className="px-4 py-16 sm:px-6">
          <p>{status === "pending" ? "All caught up." : `Nothing ${status} yet.`}</p>
          <p className="mt-1 text-fg-2">
            {status === "pending" ? "New submissions and automation finds will appear here." : ""}
          </p>
        </div>
      ) : (
        <ul>
          {list.map((it) => (
            <li key={it.id} className="group relative border-b transition-colors hover:bg-hover">
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => openItem(it)}
                className="absolute inset-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-fg"
              >
                <span className="sr-only">Review {titleOf(it)}</span>
              </button>
              <div className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-4 px-4 py-3 sm:px-6 md:grid-cols-[48px_minmax(0,1fr)_9rem_12rem_6rem]">
                <Thumb item={it} />
                <div className="min-w-0">
                  <p className="truncate font-medium">{titleOf(it)}</p>
                  <p className="truncate text-[13px] text-fg-3">{hostOf(linkOf(it))}</p>
                </div>
                <span className="hidden text-fg-2 md:block">{SECTION_SCHEMAS[it.section].label}</span>
                <span className="hidden truncate text-fg-2 md:block">
                  {it.source === "submission" ? (it.submitter_name ?? "Submission") : `Auto · ${it.origin ?? "—"}`}
                </span>
                <span className="hidden text-right text-fg-3 tabular-nums md:block">{ago(it.created_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Automation status */}
      {runs.length > 0 && (
        <section className="px-4 py-10 sm:px-6">
          <h2 className="mb-3 text-fg-3">Automation</h2>
          <ul className="border-t text-[13px]">
            {runs.map((r) => (
              <li key={`${r.started_at}-${r.source}`} className="flex justify-between gap-6 border-b py-2">
                <span>{r.source}</span>
                <span className="text-fg-2">
                  {r.error ? `× ${r.error}` : `${r.queued} queued of ${r.found} found`}
                </span>
                <span className="text-fg-3">{ago(r.started_at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Sheet item={open} list={frozen} onSelect={openItem} onClose={() => setOpen(null)}>
        {(it) => <Editor key={it.id} item={it} onDecided={decided} />}
      </Sheet>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Thumb({ item }: { item: Item }) {
  const img = (item.data.image ?? item.data.poster) as string | undefined;
  const round = item.section === "app-icons" ? "rounded-[22%]" : "rounded-md";
  if (img)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={img} alt="" loading="lazy" className={`size-12 object-cover ${round} bg-hover shadow-[0_0_0_1px_var(--line)]`} />;
  return (
    <span className="grid size-12 place-items-center rounded-md bg-hover text-[11px] text-fg-3">
      {SECTION_SCHEMAS[item.section].label.slice(0, 2)}
    </span>
  );
}

function Editor({ item, onDecided }: { item: Item; onDecided: (updated: Item, from: Status) => void }) {
  const schema = SECTION_SCHEMAS[item.section];
  const [data, setData] = useState<ItemData>(item.data);
  const [note, setNote] = useState(item.review_note ?? "");
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string | string[]) => setData((d) => ({ ...d, [k]: v }));

  const decide = async (action: "approve" | "reject") => {
    setBusy(action);
    setError(null);
    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: item.id, action, data, note }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string; item?: Item };
    setBusy(null);
    if (!res.ok || !body.item) return setError(body.error ?? "Something went wrong.");
    onDecided(body.item, item.status);
  };

  const link = linkOf({ ...item, data });
  const video = data.video as string | undefined;
  const image = data.image as string | undefined;

  return (
    <article className="px-4 pt-8 pb-16 sm:px-8">
      <p className="text-[12px] text-fg-3">
        {schema.label} · {item.source === "submission" ? "Submitted" : `Found by ${item.origin ?? "automation"}`} · {ago(item.created_at)}
      </p>
      <h2 id="sheet-title" className="mt-1 text-[17px] font-medium tracking-[-0.01em]">
        {titleOf({ ...item, data })}
      </h2>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-fg-2 hover:text-fg">
          {hostOf(link)} <ArrowUpRightGlyph18 aria-hidden="true" className="size-2.5" />
        </a>
      )}

      {/* Media preview */}
      {(video || image) && (
        <div className="mt-6 overflow-hidden rounded-lg bg-hover shadow-[0_0_0_1px_var(--line-strong)]">
          {video ? (
            <video src={video} poster={data.poster as string | undefined} controls muted loop playsInline className="block w-full" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className={item.section === "app-icons" ? "mx-auto my-8 block size-40 rounded-[22%]" : "block w-full"}
            />
          )}
        </div>
      )}

      {item.source === "submission" && (
        <SheetSection title="From">
          <p>
            {item.submitter_name} <span className="text-fg-3">· {item.submitter_email}</span>
          </p>
        </SheetSection>
      )}

      <SheetSection title="Details">
        <div className="flex flex-col gap-5">
          {schema.fields
            .filter((f) => f.type !== "file")
            .map((f) => (
              <EditField key={f.key} field={f} value={data[f.key]} onChange={(v) => set(f.key, v)} />
            ))}
        </div>
      </SheetSection>

      <SheetSection title={item.submitter_email ? "Note to submitter" : "Note"}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder={item.submitter_email ? "Optional — included in the email" : "Optional"}
          className="field-sizing-content min-h-16 w-full resize-none border-0 border-b border-line-strong bg-transparent py-2 outline-none placeholder:text-fg-3 focus:border-fg"
        />
      </SheetSection>

      <div className="sticky bottom-0 -mx-4 mt-10 flex items-center justify-between gap-4 border-t bg-bg px-4 py-4 sm:-mx-8 sm:px-8">
        <p className="min-w-0 text-[13px]" aria-live="polite">
          {error ? `× ${error}` : <span className="text-fg-3">{item.status === "pending" ? "Not live yet." : `Currently ${item.status}.`}</span>}
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" data-sound="toggle-off" disabled={!!busy || item.status === "rejected"} onClick={() => decide("reject")}>
            {busy === "reject" ? "Rejecting…" : "Reject"}
          </Button>
          <Button data-sound="toggle-on" disabled={!!busy || item.status === "approved"} onClick={() => decide("approve")}>
            {busy === "approve" ? "Approving…" : item.status === "approved" ? "Approved" : "Approve"}
          </Button>
        </div>
      </div>
    </article>
  );
}

function EditField({
  field: f,
  value,
  onChange,
}: {
  field: FieldDef;
  value: ItemData[string];
  onChange: (v: string | string[]) => void;
}) {
  const label = (
    <span className="flex justify-between text-fg-2">
      <span>{f.label}</span>
      {f.required && !value?.length && <span className="text-fg">Needed to approve</span>}
    </span>
  );

  if (f.type === "select" || f.type === "multiselect") {
    const cur = Array.isArray(value) ? value : value ? [String(value)] : [];
    return (
      <div className="flex flex-col gap-2">
        {label}
        <div className="flex flex-wrap gap-1.5">
          {f.options!.map((o) => {
            const on = cur.includes(o);
            return (
              <button
                key={o}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  onChange(f.type === "select" ? o : on ? cur.filter((v) => v !== o) : [...cur, o])
                }
                className={`press h-7 rounded-md px-2.5 transition-colors duration-150 ${
                  on ? "bg-fg text-bg" : "text-fg-2 shadow-[inset_0_0_0_1px_var(--line-strong)] hover:text-fg"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const text = Array.isArray(value) ? value.join(", ") : String(value ?? "");
  const common =
    "w-full border-0 border-b border-line-strong bg-transparent py-1.5 outline-none placeholder:text-fg-3 focus:border-fg";
  return (
    <label className="flex flex-col gap-1">
      {label}
      {f.type === "textarea" ? (
        <textarea value={text} onChange={(e) => onChange(e.target.value)} rows={2} className={`field-sizing-content min-h-12 resize-none ${common}`} />
      ) : (
        <input
          value={text}
          onChange={(e) => onChange(f.type === "tags" ? e.target.value.split(",").map((s) => s.trim()) : e.target.value)}
          className={common}
          placeholder={f.placeholder}
        />
      )}
    </label>
  );
}
