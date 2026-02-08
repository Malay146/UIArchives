"use client"
import React, { useRef, useState, useEffect, forwardRef } from 'react'
import CardGrid from './card-grid'
import Button1 from './ui-components/Button1'
import { motion } from "motion/react"
import GoUpArrowIcon from './Icons/GoUpArrowIcon';

const FilterSearch = forwardRef<HTMLDivElement>((props, ref) => {

      const [selectedTag, setSelectedTag] = useState<string>("All");
      const [searchQuery, setSearchQuery] = useState<string>("");
      const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
      const [showGoUpButton, setShowGoUpButton] = useState(false);
      const internalRef = useRef<HTMLDivElement>(null);
      
      // Use the forwarded ref if provided, otherwise use internal ref
      const scrollTargetRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;

        // Debounce search query to prevent excessive re-renders
        useEffect(() => {
          const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
          }, 300); // 300ms delay

          return () => clearTimeout(timer);
        }, [searchQuery]);

        // Handle scroll to show/hide go-up button
        useEffect(() => {
          const handleScroll = () => {
            const targetElement = scrollTargetRef.current;
            if (!targetElement) return;
      
            const scrollY = window.scrollY || window.pageYOffset;
      
            // Get the absolute bottom position of the filter section
            const filterTop = targetElement.offsetTop;
            const filterHeight = targetElement.offsetHeight;
            const filterBottom = filterTop + filterHeight;
      
            // Check if scrolled past the filter section (with a small threshold)
            const isPastFilter = scrollY > filterBottom - 50;
      
            setShowGoUpButton(isPastFilter);
          };
      
          window.addEventListener("scroll", handleScroll, { passive: true });
          handleScroll(); // Check initial state
      
          return () => {
            window.removeEventListener("scroll", handleScroll);
          };
        }, [scrollTargetRef]);
      
        // Smooth Scroll to Top of Filter Section with offset
        const handleGoUpClick = () => {
          const targetElement = scrollTargetRef.current;
          if (targetElement) {
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - 20; // 80px top margin

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        };

  return (
    <>
    <motion.div
        onClick={handleGoUpClick}
        className="size-15 fixed rounded-full bg-zinc-900 shadow-[inset_4px_4px_4px_rgba(255,255,255,0.04),inset_-4px_-4px_4px_rgba(0,0,0,0.5)] active:shadow-[inset_4px_4px_4px_rgba(0,0,0,0.5),inset_-4px_-4px_4px_rgba(255,255,255,0.05)] bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 right-3 sm:right-6 md:right-8 lg:right-30 flex justify-center items-center cursor-pointer go-up z-50"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{
          opacity: showGoUpButton ? 1 : 0,
          filter: showGoUpButton ? "blur(0px)" : "blur(10px)",
          pointerEvents: showGoUpButton ? "auto" : "none",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <GoUpArrowIcon />
      </motion.div>
    {/* Filter & Search */}
          <div
            ref={scrollTargetRef}
            className="max-w-7xl tracking-tighter mt-8 sm:mt-10 md:mt-12 flex flex-col items-center px-4 sm:px-6 md:px-0"
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2 md:gap-2">
              {[
                "All",
                "Component Library",
                "Technologies",
                "Fonts",
                "Icons",
                "Tools",
                "Socials",
                "Animation",
                "Inspiration",
              ].map((tag) => (
                <Button1
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={
                    selectedTag === tag
                      ? "shadow-[inset_-4px_-4px_4px_rgba(255,255,255,0.08),inset_4px_4px_4px_rgba(0,0,0,0.5)] text-zinc-200 font-normal whitespace-nowrap shrink-0"
                      : "whitespace-nowrap shrink-0"
                  }
                >
                  {tag}
                </Button1>
              ))}
            </div>
            <Search
              type="text"
              placeholder="Search..."
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full mt-3 sm:mt-4 outline-none transition-all duration-300 ease-out focus:scale-[1.02] focus:shadow-lg"
            />
          </div>

          {/* Cards */}
          <CardGrid selectedTag={selectedTag} searchQuery={debouncedSearchQuery} />
          </>
  )
})

FilterSearch.displayName = 'FilterSearch';

export default FilterSearch

type SearchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Search = ({ className = "", ...props }: SearchProps) => {
  return (
    <input
      {...props}
      className={`noise font-[Inter] px-4 py-2.5 sm:px-5 sm:py-3 bg-[#BDBDBD] rounded-xl sm:rounded-2xl 
      shadow-[inset_-2px_-2px_2px_rgba(0,0,0,0.5),inset_2px_2px_2px_rgba(255,255,255,0.5)] sm:shadow-[inset_-4px_-4px_4px_rgba(0,0,0,0.5),inset_4px_4px_4px_rgba(255,255,255,0.5)]
      focus:shadow-[inset_2px_2px_2px_rgba(0,0,0,0.5),inset_-2px_-2px_2px_rgba(255,255,255,0.5)] sm:focus:shadow-[inset_4px_4px_4px_rgba(0,0,0,0.5),inset_-4px_-4px_4px_rgba(255,255,255,0.5)]
      transition-shadow duration-300 font-light text-zinc-800 placeholder:text-zinc-500 text-sm sm:text-base
      ${className}`}
    />
  );
};