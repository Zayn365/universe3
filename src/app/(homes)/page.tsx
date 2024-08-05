"use client";
import BgGlassmorphism from "@/components/BgGlassmorphism/BgGlassmorphism";
import SectionHowItWork from "@/components/SectionHowItWork/SectionHowItWork";
import SectionLargeSlider from "./SectionLargeSlider";
import BackgroundSection from "@/components/BackgroundSection/BackgroundSection";
import SectionHero2 from "@/components/SectionHero/SectionHero2";
import SectionSliderCollections2 from "@/components/SectionSliderCollections2";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useUserContext } from "@/hooks/useUserContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PomsSection1 from "@/components/PomsSection/PomsSection1";
import PomsSection2 from "@/components/PomsSection/PomsSection2";
import NftSection from "@/components/NftSection/NftSection";
import StakeNft from "@/components/NftSection/StakeNft";
import AuctionNft from "@/components/NftSection/AuctionNft";
import MintNfts from "@/components/NftSection/MintNft";

declare let window: any;

function PageHome() {
  // const { user, setUser } = useUserContext();

  // const getWalletFunction = () => {
  //   if (typeof window !== "undefined" && window.ethereum) {
  //     window.ethereum
  //       .request({ method: "eth_requestAccounts" })
  //       .then((res: string[]) => {
  //         const wallet = res.length > 0 ? String(res[0]) : null;
  //         if (wallet) {
  //           Cookies.set("wallet", wallet, {
  //             expires: 1 / 24,
  //           });
  //           // ...user,
  //           setUser({
  //             wallet: wallet,
  //           });
  //           toast.success("Wallet connected");
  //         }
  //       })
  //       .catch((err: Error) => {
  //         console.log(err);
  //       });
  //   } else {
  //     toast.error("Please install metamask extension");
  //   }
  // };
  // useEffect(() => {
  //   getWalletFunction();
  // }, []);
  return (
    <div className="nc-PageHome relative overflow-hidden">
      <BgGlassmorphism />

      <div className="container relative mt-5 mb-20 sm:mb-24 lg:mt-20 lg:mb-32">
        <SectionHero2 />
        {/* <SectionHowItWork className="" /> */}
      </div>

      <div className="w-full">
        <div className="container mx-auto relative mt-5  h-full min-h-[100vh] ">
          <MintNfts />
          <NftSection />
          {/* <StakeNft /> */}
          <AuctionNft />
        </div>
      </div>

      {/* <div className="w-full bg-gradient-to-r from-[#FFDC59] to-[#FF954C] dark:from-[#FFDC59] dark:to-[#FF954C]">
        <div className="container mx-auto relative mt-5  h-full min-h-[100vh] ">
          <PomsSection1 />
        </div>
      </div>
      <div
        className="w-full"
        style={{
          backgroundImage: "url('/Image/footbg.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container py-32 justify-center mx-auto relative h-full min-h-[100vh] ">
          <PomsSection2 />
        </div>
      </div> */}
      {/* <div className="bg-neutral-100/70 dark:bg-black/20 py-20 lg:py-32 flex-wrap items-center justify-center flex gap-4">
        <div
          className="container"
          // style={{ backgroundSize: "21rem" }}  bg-[url(/Image/BG-NFT.png)] bg-no-repeat bg-right
        >
          <SectionLargeSlider />
        </div>
      </div> */}

      <div className="container relative space-y-24 lg:space-y-32">
        <div className="relative py-20 lg:py-28">
          <BackgroundSection />
          <SectionSliderCollections2 cardStyle="style1" />
        </div>
      </div>
    </div>
  );
}

export default PageHome;
