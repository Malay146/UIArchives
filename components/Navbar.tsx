"use client";

import React, { useState } from "react";
import Link from "next/link";
import Button1 from "@/components/ui-components/Button1";
import Image from "next/image";
import { gsap } from "gsap";
import { useEffect } from "react";
import Logo from "./Logo";

type NavbarProps = {
  showShareButton?: boolean;
  showAddResourceButton?: boolean;
};

const Navbar = ({
  showShareButton = true,
  showAddResourceButton = true,
}: NavbarProps) => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const handleShare = async () => {
    const url = window.location.href;
    const title = "UIArchives – All Your Frontend Necessities";
    const text =
      "Check out this amazing collection of UI components and design resources!";

    try {
      // Check if Web Share API is available (mostly on mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } else {
        // Fallback to clipboard API
        await navigator.clipboard.writeText(url);
        setToastMessage("Link copied to clipboard!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      // User cancelled the share or error occurred
      // If it's not a user cancellation, try clipboard as fallback
      if ((error as Error).name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(url);
          setToastMessage("Link copied to clipboard!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } catch (clipboardError) {
          setToastMessage("Failed to share. Please try again.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }
    }
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".Logo, .Banner, .Links", {
        opacity: 0,
        y: 50,
        duration: 1.8,
        filter: "blur(10px)",
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="navbar pt-6 sm:pt-8 md:pt-10 flex items-center justify-between gap-4 sm:gap-6">
        <Link href="/" className="shrink-0" aria-label="Home">
          <Logo />
          <span className="sr-only">Home</span>
        </Link>

        <Link
          href="https://www.producthunt.com/products/uiarchives?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-uiarchives"
          target="_blank"
          className="Banner hidden lg:inline-block"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1038113&theme=dark&t=1764408195700"
            alt="UIArchives - Curated&#0032;ui&#0032;components&#0044;&#0032;design&#0032;tools&#0032;&#0038;&#0032;frontend&#0032;resources | Product Hunt"
            style={{ width: "250px", height: "54px" }}
            width="250"
            height="54"
          />
        </Link>

        <div className="Links flex items-center gap-3">
          {showShareButton && (
            <Button1
              onClick={handleShare}
              className="font-extralight tracking-tighter text-xs sm:text-sm md:text-base px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 whitespace-nowrap"
              aria-label="Share this page"
            >
              <span className="sm:inline">Share</span>
            </Button1>
          )}

          {showAddResourceButton && (
            <Link href="/add-resource">
              <Button1
                className="noise font-extralight tracking-tighter font-[Inter] px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 bg-[#171717] rounded-xl text-zinc-400 text-xs sm:text-sm md:text-base shadow-[inset_4px_4px_4px_rgba(255,255,255,0.04),inset_-4px_-4px_4px_rgba(0,0,0,0.5)]"
                aria-label="Add your resource"
              >
                <span className="hidden sm:inline">Add your Resource</span>
                <span className="sm:hidden">Add</span>
              </Button1>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
