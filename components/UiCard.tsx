"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import Link from "next/link";

export interface UiCardData {
  title: string;
  description: string;
  tag: string | string[];
  image?: string;
  imageLink?: string; // Custom link for the image click
  links?: {
    website?: string;
    github?: string;
    twitter?: string;
    youtube?: string;
  };
}

export default function UiCard({
  title,
  description,
  tag,
  image,
  imageLink,
  links,
}: UiCardData) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const anim = gsap.from(cardRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.7,
        filter: "blur(25px)",
        duration: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 95%", // earlier trigger
          end: "bottom 95%",
          scrub: false, // smoother reveal without dragging
          toggleActions: "play none none reverse",
          markers: false,
        },
      });

      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300"
    > 
      {/* Image Section */}
      <Link
        href={imageLink || links?.website || "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${title} website (opens in a new tab)`}
      >
        <div className="relative w-full aspect-video bg-black overflow-hidden group cursor-pointer sm:aspect-4/3 md:aspect-3/2 lg:aspect-video">
          {/* Background Image */}
          <Image
            src={image ?? "/graphic.jpg"}
            alt={title}
            fill
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[5px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-10">
            <h1 className="font-[Inter] text-white font-bold text-3xl sm:text-4xl tracking-tighter">
              Visit
            </h1>
            <span className="p-2 rounded-full bg-zinc-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up-right-icon"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="px-5 pt-5 pb-3 text-white">
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold mr-3 truncate">{title}</h2>
          <span className="w-px h-6 rounded-full bg-zinc-500" />
          <div className="flex gap-3 text-zinc-400 mx-3">
            {links?.website && (
              <a
                href={links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
                aria-label={`Open ${title} website (opens in a new tab)`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-globe-icon lucide-globe hover:stroke-zinc-400 hover:scale-110 transition-all duration-200"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </a>
            )}
            {links?.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
                aria-label={`Open ${title} on GitHub (opens in a new tab)`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github-icon lucide-github hover:stroke-zinc-400 hover:scale-110 transition-all duration-200"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            )}
            {links?.twitter && (
              <a
                href={links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
                aria-label={`Open ${title} on X/Twitter (opens in a new tab)`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter-icon lucide-twitter hover:stroke-zinc-400 hover:scale-110 transition-all duration-200"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            )}
            {links?.youtube && (
              <a
                href={links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
                aria-label={`Open ${title} on YouTube (opens in a new tab)`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-youtube-icon lucide-youtube hover:stroke-zinc-400 hover:scale-110 transition-all duration-200"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
            )}
          </div>
          <span className="text-sm text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-lg ml-auto shadow-[inset_2px_2px_2px_rgba(255,255,255,0.03),inset_-2px_-2px_2px_rgba(0,0,0,0.3)] truncate">
            {Array.isArray(tag) ? tag[0] || "Untitled" : tag}
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
