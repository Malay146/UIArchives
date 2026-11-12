import { CheckGlyph18 } from "@/components/icons";

export type FilterOption = { value: string; label?: string; count?: number; active: boolean; disabled?: boolean };
export type FilterGroup = { key: string; label: string; options: FilterOption[]; active?: number };

/**
 * Filters live directly under search, one row per group, so the question
 * ("what am I looking for?") and the answer ("narrow it like this") read as
 * one line of thought. Rows scroll sideways on phones and wrap on desktop.
 */
export function FilterBar({
  groups,
  onToggle,
  onClear,
}: {
  groups: FilterGroup[];
  onToggle: (key: string, value: string) => void;
  onClear?: (key: string) => void;
}) {
  if (!groups.length) return null;
  return (
    <div className="flex flex-col gap-1 border-b py-2.5">
      {groups.map((g) => (
        <div key={g.key} role="group" aria-label={g.label} className="flex items-start gap-4 px-4 sm:px-6">
          <span className="w-[84px] shrink-0 pt-[5px] text-[13px] text-fg-3">{g.label}</span>
          <div className="scrollbar-none -my-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1 lg:flex-wrap lg:overflow-visible">
            {g.options.map((o) => (
              <button
                key={o.value}
                type="button"
                aria-pressed={o.active}
                disabled={o.disabled}
                onClick={() => onToggle(g.key, o.value)}
                className={`press flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2.5 whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-35 ${
                  o.active
                    ? "bg-fg text-bg"
                    : "text-fg-2 shadow-[inset_0_0_0_1px_var(--line-strong)] hover:text-fg"
                }`}
              >
                {o.active && g.options.length > 1 && o.value !== "All" && (
                  <CheckGlyph18 aria-hidden="true" className="-ml-0.5 size-2.5" />
                )}
                {o.label ?? o.value}
                {o.count !== undefined && (
                  <span className={`text-[12px] tabular-nums ${o.active ? "opacity-60" : "text-fg-3"}`}>{o.count}</span>
                )}
              </button>
            ))}
          </div>
          {onClear && (g.active ?? 0) > 0 && (
            <button
              type="button"
              onClick={() => onClear(g.key)}
              className="shrink-0 pt-[5px] text-[13px] text-fg-3 transition-colors hover:text-fg"
            >
              Clear
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
