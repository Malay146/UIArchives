/** The same quiet opening for every section: what it is, and a few facts. */
export function SectionIntro({
  title,
  blurb,
  facts,
  children,
}: {
  title: string;
  blurb: string;
  facts: { label: string; value: React.ReactNode }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="grid gap-8 border-b px-4 pt-10 pb-10 sm:px-6 sm:pt-14 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div className="max-w-[460px]">
        <h1 className="rise font-medium">{title}</h1>
        {/* Three lines reserved on desktop so every section opens at the same height. */}
        <p className="rise mt-3 text-fg-2 md:min-h-[3lh]" style={{ "--i": 1 } as React.CSSProperties}>
          {blurb}
        </p>
        {children && (
          <div className="rise mt-6 flex items-center gap-5" style={{ "--i": 2 } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
      <dl className="rise flex gap-10" style={{ "--i": 3 } as React.CSSProperties}>
        {facts.map((f) => (
          <div key={f.label} className="flex flex-col">
            <dt className="text-fg-3">{f.label}</dt>
            <dd className="tabular-nums">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
