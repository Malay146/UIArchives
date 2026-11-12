import { NextResponse } from "next/server";
import { getResources } from "@/lib/server/published";
import { resources as staticResources } from "@/lib/resources";

/** Resources approved on /review, for the ⌘K menu (the built-in ones ship with the page). */
export async function GET() {
  const known = new Set(staticResources.map((r) => r.title));
  const approved = (await getResources().catch(() => [])).filter((r) => !known.has(r.title));
  return NextResponse.json(approved, { headers: { "cache-control": "public, max-age=300" } });
}
