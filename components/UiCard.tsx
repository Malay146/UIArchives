import Image from "next/image";

export interface UiCardData {
  title: string;
  description: string;
  tag: string;
  image: string;
  links?: {
    website?: string;
    github?: string;
    twitter?: string;
  };
}

export default function UiCard({
  title,
  description,
  tag,
  image,
  links,
}: UiCardData) {
  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-zinc-800">
      {/* Image Section */}
      <div className="relative w-full h-[250px] bg-zinc-950 flex items-center justify-center overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={400}
          height={200}
          className="object-cover w-full h-full "
        />
      </div>

      {/* Content Section */}
      <div className="px-5 pt-5 pb-3 text-white">
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold mr-3">{title}</h2>
          <div className="flex gap-4 text-zinc-400">
            {links?.website && (
              <a
                href={links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe-icon lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </a>
            )}
            {links?.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github-icon lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            )}
            {links?.twitter && (
              <a
                href={links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter-icon lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            )}
          </div>
          <span className="text-sm text-zinc-400 border border-zinc-800 bg-zinc-800 px-2 py-0.5 rounded-lg ml-auto shadow-[inset_2px_2px_2px_rgba(255,255,255,0.04),inset_-2px_-2px_2px_rgba(0,0,0,0.5)]">
            {tag}
          </span>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed text-justify">
          {description}
        </p>

        {/* Links */}
      </div>
    </div>
  );
}
