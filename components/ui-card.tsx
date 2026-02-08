"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import Link from "next/link";
import CrossArrow from "./Icons/cross-arrow";
import WebIcon from "./Icons/web-icon";
import GithubIcon from "./Icons/github-icon";
import TwitterIcon from "./Icons/twitter-icon";
import YoutubeIcon from "./Icons/youtube-icon";

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
      // ref={cardRef}
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
              <CrossArrow />
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
                <WebIcon />
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
                <GithubIcon />
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
                <TwitterIcon />
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
                <YoutubeIcon />
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
