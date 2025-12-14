"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1️⃣ Initialize Lenis
    const lenis = new Lenis({
      duration: 0.2,
      easing: (t) => t*t,
      smoothWheel: true,
      wheelMultiplier: 4.0,
    });

    // 2️⃣ RAF loop
    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update(); // Sync GSAP
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3️⃣ Sync ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
