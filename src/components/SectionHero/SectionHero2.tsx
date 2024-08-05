"use client";
import React, { FC, useEffect, useState } from "react";
import imagePng from "@/images/6.png";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
// import HeroSearchForm from "@/components/HeroSearchForm/HeroSearchForm";
import Image from "next/image";
import HeroSearchForm from "../HeroSearchForm/HeroSearchForm";
export interface SectionHero2Props {
  children?: React.ReactNode;
  className?: string;
}

const SectionHero2: FC<SectionHero2Props> = ({ className = "", children }) => {
  const [scrolledUp, setScrolledUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        // adjust the scroll threshold as needed
        setScrolledUp(true);
      } else {
        setScrolledUp(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`nc-SectionHero2 flex flex-col-reverse lg:flex-col relative ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 pb-14 lg:pb-36 xl:pb-60 xl:pr-14 lg:mr-10 xl:mr-0">
          <h2 className="font-semibold text-4xl md:text-5xl xl:text-6xl !leading-[114%] ">
            Discover,{" "}
            <span className="bg-gradient-to-r from-[#FFDE59] to-[#FF954C] bg-clip-text text-transparent font-bold">
              collect
            </span>
            ,{" "}
            <span className="bg-gradient-to-r from-[#FFDE59] to-[#FF954C] bg-clip-text text-transparent font-bold">
              Auction
            </span>{" "}
            and{" "}
            <span className="bg-gradient-to-r from-[#FFDE59] to-[#FF954C] bg-clip-text text-transparent font-bold">
              Sell
            </span>{" "}
            NFTs
          </h2>
          <span className="text-base md:text-lg text-neutral-500 dark:text-neutral-400">
            Discover the most outstanding NFTs in all topics of life. <br />{" "}
            Creative your NFTs and sell them
          </span>
          <ButtonPrimary
            className="!py-4 px-8"
            href="/marketplace?category=all"
          >
            <span className="text-xl">Explore More 🚀</span>
          </ButtonPrimary>
          {/* <Image src={} /> */}
        </div>
        <div
          className={`${
            scrolledUp ? "opacity-50 scale-110" : "opacity-100 scale-100"
          } transition duration-500 ease-in-out`}
        >
          <Image className="w-full" src={imagePng} alt="hero" />
        </div>
      </div>
      {/* <div className="z-10 mb-12 lg:mb-0 lg:-mt-20 xl:-mt-48 w-full">
        <HeroSearchForm />
      </div> */}
    </div>
  );
};

export default SectionHero2;
