"use client";

import { CollectionView } from "@/components/collection/collection-view";
import { PrimaryLink } from "@/components/collection/copy-button";
import { CommandCopy } from "@/components/collection/command-copy";
import { SheetRow, SheetSection, SheetTags } from "@/components/ui/sheet";
import { GithubGlyph32 } from "@/components/icons";
import type { Facet } from "@/lib/use-collection";
import type { Skill } from "@/data/collections/skills";

const facets: Facet<Skill>[] = [
  { key: "topic", label: "Topic", get: (s) => s.topics },
  { key: "agent", label: "Works with", get: (s) => s.agents, order: ["Claude Code", "Cursor", "Codex"] },
];

const text = (s: Skill) =>
  `${s.name} ${s.author.name} ${s.description} ${s.topics.join(" ")} ${s.skills.map((k) => `${k.name} ${k.summary}`).join(" ")}`;

const GRID = "md:grid md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_minmax(0,18rem)] md:items-center md:gap-6";

export function Skills({ items }: { items: Skill[] }) {
  return (
    <CollectionView
      items={items}
      facets={facets}
      text={text}
      getKey={(s) => s.id}
      noun={["skill set", "skill sets"]}
      layout={{
        kind: "list",
        header: (
          <div className={`hidden border-b px-6 py-2 text-fg-3 md:grid ${GRID}`} aria-hidden="true">
            <span>Name</span>
            <span>About</span>
            <span>Install</span>
          </div>
        ),
        row: (s) => (
          <div className={`px-4 py-4 sm:px-6 ${GRID}`}>
            <div className="min-w-0">
              <p className="truncate font-medium">{s.name}</p>
              <p className="truncate text-[12px] text-fg-3">
                {s.author.name} · {s.skills.length} skills
              </p>
            </div>
            <p className="mt-1 line-clamp-2 text-fg-2 md:mt-0">{s.description}</p>
            {/* Sits above the row's button, so copying never opens the row */}
            <div className="mt-3 md:mt-0">
              <CommandCopy command={s.install} />
            </div>
          </div>
        ),
      }}
      empty={{ title: "No skills yet.", body: "Agent skills for design and frontend work will appear here." }}
      detail={(s) => (
        <article className="px-4 pt-8 pb-16 sm:px-8">
          <h2 id="sheet-title" className="text-[17px] font-medium tracking-[-0.01em]">{s.name}</h2>
          <p className="mt-1 text-fg-2">
            by {s.author.name}
            {s.author.handle && <span className="text-fg-3"> · @{s.author.handle}</span>}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <PrimaryLink href={s.repo}>
              <GithubGlyph32 aria-hidden="true" className="size-3.5" /> View repository
            </PrimaryLink>
          </div>

          <SheetSection title="Install">
            <CommandCopy command={s.install} size="md" prompt />
          </SheetSection>

          <SheetSection title="Overview">
            <p className="max-w-[62ch] text-[15px] leading-[1.7] text-fg-2">{s.description}</p>
          </SheetSection>

          <SheetSection title={`Included skills · ${s.skills.length}`}>
            <ul className="border-t">
              {s.skills.map((k) => (
                <li key={k.name} className="flex flex-col gap-0.5 border-b py-3 sm:flex-row sm:gap-6">
                  <code className="shrink-0 font-mono text-[13px] sm:w-56">{k.name}</code>
                  <span className="text-fg-2">{k.summary}</span>
                </li>
              ))}
            </ul>
          </SheetSection>

          <SheetSection title="Details">
            <dl className="border-t">
              <SheetRow label="Topics"><SheetTags tags={s.topics} /></SheetRow>
              <SheetRow label="Works with"><SheetTags tags={s.agents} /></SheetRow>
              <SheetRow label="Repository">
                <a href={s.repo} target="_blank" rel="noopener noreferrer" className="link text-fg">
                  {s.repo.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </SheetRow>
              {s.license && <SheetRow label="License">{s.license}</SheetRow>}
            </dl>
          </SheetSection>
        </article>
      )}
    />
  );
}
