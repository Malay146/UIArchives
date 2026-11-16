// "Featured on" badges from directories that list UIArchives. Most of them only keep the listing (and
// its dofollow link) while their badge links back from our site, so each badge stays a plain <a>
// with the exact img src the directory's verifier looks for.
// The strip is as wide as one badge and scrolls in a loop: the track holds the list twice and
// slides by half its width, so the second copy lands exactly where the first began.
// Pauses on hover and focus, and holds still under reduced motion.

type Badge = { name: string; href: string; src: string; width: number; height: number };

const BADGES: Badge[] = [
  {
    name: "Startup Fame",
    href: "https://startupfa.me/s/uiarchives?utm_source=uiarchives.com",
    src: "https://startupfa.me/badge?t=classic&theme=default",
    width: 171,
    height: 54,
  },
  {
    name: "Findly.tools",
    href: "https://findly.tools/uiarchives?utm_source=uiarchives",
    src: "https://findly.tools/badges/findly-tools-badge-light.svg",
    width: 175,
    height: 55,
  },
  {
    name: "Twelve Tools",
    href: "https://twelve.tools",
    src: "https://twelve.tools/badge1-light.svg",
    width: 148,
    height: 40,
  },
  {
    name: "Fazier",
    href: "https://fazier.com/launches/uiarchives.com",
    src: "https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light",
    width: 120,
    height: 40,
  },
  {
    name: "neeed.directory",
    href: "https://neeed.directory/products/uiarchives?utm_source=uiarchives",
    src: "https://neeed.directory/badges/neeed-badge-light.svg",
    width: 139,
    height: 40,
  },
  {
    name: "OpenHunts",
    href: "https://openhunts.com",
    src: "https://cdn.openhunts.com/badges/club.webp",
    width: 486,
    height: 105,
  },
  {
    name: "Smol Launch",
    href: "https://smollaunch.com",
    src: "https://smollaunch.com/badges/featured.svg",
    width: 250,
    height: 60,
  },
];

// Every badge is drawn at this height so the strip reads as one row whatever size each site ships.
const H = 40;

function Row({ copy }: { copy: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={copy || undefined}>
      {BADGES.map((b) => (
        <li key={b.name} className="shrink-0">
          <a
            href={b.href}
            target="_blank"
            rel="noopener"
            tabIndex={copy ? -1 : undefined}
            className="block rounded-lg opacity-60 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
          >
            {/* third-party badge, kept as a plain img so each verifier sees its exact src */}
            <img
              src={b.src}
              alt={copy ? "" : `Featured on ${b.name}`}
              width={Math.round((b.width / b.height) * H)}
              height={H}
              // Eager but low priority: lazy loading skips images clipped sideways by the strip,
              // which left blank gaps as the loop scrolled them in. The copy hits the cache.
              fetchPriority="low"
              decoding="async"
              style={{ height: H, width: "auto" }}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function BadgeMarquee({ className = "" }: { className?: string }) {
  return (
    <div
      className={`badge-marquee w-[15.5rem] max-w-full overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)] ${className}`}
    >
      <div className="badge-marquee-track flex w-max">
        <Row copy={false} />
        <Row copy />
      </div>
    </div>
  );
}
