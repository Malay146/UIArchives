"use client";
import React from 'react'
import Silk from "@/components/Silk";
import { motion } from "motion/react";

const Hero = () => {
      // Split text into characters for title and words for paragraph
  const titleText = "All Your Frontend Necessities";
  const titleChars = titleText.split("");

  const paragraphText =
    "Explore a universe of tools, frameworks, and components — all in one place. Just search what you need, and get instant access to the best resources.";
  const paragraphWords = paragraphText.split(" ");
  return (
    <>
    <motion.h1
            className="font-display text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] xl:text-[96px] text-zinc-400 px-2 sm:px-4 text-center"
            initial="hidden"
            animate="visible"
          >
            {titleChars.map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={{
                  hidden: { opacity: 0, y: 40, filter: "blur(25px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.035,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Hero Image */}
          <div className="hero-image -mt-4 sm:-mt-6 md:-mt-8 relative w-[90%] max-w-[320px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[620px] xl:max-w-[822px] h-[60px] sm:h-20 md:h-[100px] lg:h-[110px] xl:h-[126px] rounded-[44px] sm:rounded-[55px] md:rounded-[66px] lg:rounded-[77px] xl:rounded-[88px] overflow-hidden mx-auto">
            <Silk
              speed={20}
              scale={0.9}
              color="#7B7481"
              noiseIntensity={1.5}
              rotation={1.94}
            />
          </div>
          <motion.p
            className="text-[#888888] max-w-4xl font-sans text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] text-center font-extralight tracking-tighter leading-5 sm:leading-9 px-4 sm:px-6 md:px-8"
            initial="hidden"
            animate="visible"
          >
            {paragraphWords.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={{
                  hidden: { opacity: 0, y: 40, filter: "blur(25px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.07,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {word}
                {i < paragraphWords.length - 1 && "\u00A0"}
              </motion.span>
            ))}
          </motion.p>
          </>
  )
}

export default Hero