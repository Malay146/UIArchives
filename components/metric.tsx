import { cardData } from "@/data/cardData";
import React from "react";

const Metric = () => {
  return (
    <div className="metrics max-w-xl flex items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24 xl:gap-32 font-[Inter] text-center mt-2 sm:mt-3 text-white px-4">
      <div>
        <p className="text-xl sm:text-2xl md:text-3xl font-extrabold">
          {/* 1000+ */}
          {cardData.length >= 1000
            ? `${(cardData.length / 1000).toFixed(1)}k+`
            : `${cardData.length}+`}
        </p>
        <p className="font-thin text-xs sm:text-sm md:text-base lg:text-lg">
          Resources Shared
        </p>
      </div>
      <div>
        <p className="text-xl sm:text-2xl md:text-3xl font-black">∞</p>
        <p className="font-thin text-xs sm:text-sm md:text-base lg:text-lg">
          Design Inspiration
        </p>
      </div>
    </div>
  );
};

export default Metric;
