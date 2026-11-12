"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/ui/field";
import { CheckGlyph18 } from "@/components/icons";
import { type Field as FieldDef, SECTION_SCHEMAS, type SectionKey } from "@/lib/section-schemas";

type Status = { type: "success" | "error"; text: string } | null;

/** One form, many shapes: the fields come from the section's schema. */
export function SubmitForm({ section }: { section: SectionKey }) {
  const schema = SECTION_SCHEMAS[section];
  const formRef = useRef<HTMLFormElement>(null);
  const [picks, setPicks] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const toggle = (f: FieldDef, value: string) =>
    setPicks((p) => {
      const cur = p[f.key] ?? [];
      const next =
        f.type === "select" ? [value] : cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...p, [f.key]: next };
    });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const fd = new FormData(e.currentTarget);
    fd.set("section", section);
    for (const f of schema.fields) {
      if (f.type === "select") fd.set(f.key, picks[f.key]?.[0] ?? "");
      if (f.type === "multiselect") {
        fd.delete(f.key);
        for (const v of picks[f.key] ?? []) fd.append(f.key, v);
      }
    }
    try {
      const res = await fetch("/api/submit", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus({ type: "success", text: "Received. We review every submission by hand and will email you either way." });
      formRef.current?.reset();
      setPicks({});
    } catch (err) {
      setStatus({ type: "error", text: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  if (status?.type === "success") {
    return (
      <div className="flex flex-col items-start gap-3 py-6">
        <span className="grid size-8 place-items-center rounded-full bg-fg text-bg">
          <CheckGlyph18 className="size-3.5" aria-hidden="true" />
        </span>
        <p className="font-medium">Thanks — your {schema.noun} is in the queue.</p>
        <p className="max-w-[420px] text-fg-2">{status.text}</p>
        <div className="mt-2 flex gap-5">
          <button type="button" className="link text-fg" onClick={() => setStatus(null)}>
            Submit another {schema.noun}
          </button>
          <Link href="/submit" className="link text-fg-2 hover:text-fg">
            Choose another section
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className="flex flex-col gap-7" noValidate>
      {/* Honeypot for bots — hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {schema.fields.map((f) => {
        if (f.type === "textarea")
          return <TextArea key={f.key} name={f.key} label={f.label} hint={f.required ? f.hint : f.hint ?? "Optional"} placeholder={f.placeholder} rows={3} required={f.required} />;
        if (f.type === "select" || f.type === "multiselect")
          return (
            <fieldset key={f.key} className="flex flex-col gap-2.5">
              <legend className="mb-2.5 flex w-full justify-between text-fg-2">
                <span>{f.label}</span>
                <span className="text-fg-3">{f.type === "multiselect" ? "Choose any" : "Choose one"}</span>
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {f.options!.map((o) => {
                  const on = (picks[f.key] ?? []).includes(o);
                  return (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(f, o)}
                      className={`press h-7 rounded-md px-2.5 transition-colors duration-150 ${
                        on ? "bg-fg text-bg" : "text-fg-2 shadow-[inset_0_0_0_1px_var(--line-strong)] hover:text-fg"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        if (f.type === "file")
          return (
            <div key={f.key} className="flex flex-col gap-2">
              <label htmlFor={`f-${f.key}`} className="flex justify-between text-fg-2">
                <span>{f.label}</span>
                <span className="text-fg-3">{f.hint ?? `Up to ${f.maxMb} MB`}</span>
              </label>
              <input
                id={`f-${f.key}`}
                name={f.key}
                type="file"
                accept={f.accept}
                className="text-fg-2 file:mr-3 file:h-7 file:cursor-pointer file:rounded-md file:border-0 file:bg-transparent file:px-2.5 file:text-fg file:shadow-[inset_0_0_0_1px_var(--line-strong)]"
              />
            </div>
          );
        return (
          <Field
            key={f.key}
            name={f.key}
            label={f.label}
            type={f.type === "url" ? "url" : "text"}
            hint={f.required ? f.hint : f.hint ?? "Optional"}
            placeholder={f.placeholder}
            required={f.required}
          />
        );
      })}

      <div className="grid gap-7 border-t pt-7 sm:grid-cols-2">
        <Field name="submitterName" label="Your name" autoComplete="name" required />
        <Field name="submitterEmail" label="Your email" type="email" autoComplete="email" hint="For the review result" required />
      </div>

      <div className="flex items-center justify-between gap-6">
        <p aria-live="polite" className={status?.type === "error" ? "text-fg" : "text-fg-3"}>
          {status?.type === "error" ? `× ${status.text}` : "Reviewed by a person. You'll get an email either way."}
        </p>
        <Button type="submit" disabled={loading}>
          {loading ? "Sending…" : `Submit ${schema.noun}`}
        </Button>
      </div>
    </form>
  );
}
