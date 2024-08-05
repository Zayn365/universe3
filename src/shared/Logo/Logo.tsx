import React from "react";
import logoImg from "@/images/LOGOWIDE.png";
import Link from "next/link";
import Image from "next/image";

export interface LogoProps {
  img?: string;
  imgLight?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  img = logoImg,
  // imgLight = logoLightImg,
  className = "flex-shrink-0",
}) => {
  return (
    <Link
      href="/"
      className={`ttnc-logo inline-block text-slate-600 ${className}`}
    >
      {/* THIS USE FOR MY CLIENT */}
      {/* PLEASE UN COMMENT BELLOW CODE AND USE IT */}
      {/* {img ? (
        <Image
          className={`block h-8 sm:h-10 w-auto ${
            imgLight ? "dark:hidden" : ""
          }`}
          src={img}
          alt="Logo"
          sizes="200px"
          priority
        />
      ) : (
        "Logo Here"
      )} */}
      {/* {imgLight && ( */}
      <h1 className="text-bold text-[28px] flex gap-2 items-center bg-gradient-to-r from-[#FFDE59] to-[#FF954C] bg-clip-text text-transparent font-bold mr-10">
        <Image alt="dogIcon" src="/Image/logo.png" width={40} height={20} />
        Universe3
      </h1>
      {/* <Image
        className="h-8 sm:h-10 w-auto dark:block"
        src={logoImg}
        alt="Logo-Light"
        sizes="200px"
        priority
      /> */}
      {/* )} */}
    </Link>
  );
};

export default Logo;
