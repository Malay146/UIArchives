import Link from "next/link";
import { Badge } from "./blog/badge";
import Button1 from "./ui-components/Button1";

export function BlogCTASection() {
  return (
    <section className="w-full max-w-5xl mx-auto mt-24 sm:mt-32 mb-16 px-8 font-sans">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl">
        {/* Glow effect background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-64 bg-zinc-800/20 blur-[100px] rounded-full point-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <Badge
            variant="outline"
            className="px-4 py-1.5 border-zinc-800 text-zinc-300"
          >
            Insights & Guides
          </Badge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white max-w-3xl">
            Level up your UI engineering skills
          </h2>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed tracking-tight">
            Read our engineering blog to discover modern web development
            techniques, architectural deep dives, and component implementation
            guides.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/blog">
              <Button1>Read the Blog</Button1>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
