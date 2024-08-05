"use client";
import { FC, useEffect, useState } from "react";
import CardLarge1 from "@/components/CardLarge1/CardLarge1";
import axios from "axios";
import Cookies from "js-cookie";
import { NftHome } from "@/types/Nft";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

export interface SectionLargeSliderProps {
  className?: string;
}

const SectionLargeSlider: FC<SectionLargeSliderProps> = ({
  className = "",
}) => {
  const [nfts, setNfts] = useState<NftHome[]>([]);
  const [indexActive, setIndexActive] = useState(0);
  const token = Cookies.get("loginToken");

  const fetchNfts = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/nfts/getAll`);
      setNfts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch NFTs", error);
    }
  };
  useEffect(() => {
    fetchNfts();
  }, []);
  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= 2) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return 2;
      }
      return state - 1;
    });
  };

  return (
    <div className={`nc-SectionLargeSlider relative ${className}`}>
      {nfts.length > 0 &&
        nfts?.slice(0, 4).map((nft) => {
          return (
            <CardLarge1
              key={nft.id}
              id={nft.id}
              featuredImgUrl={nft.img}
              nftName={nft.name}
              creatorName={nft.primary_owner.slice(0, 7)}
              userImageUrl={nft.creator_image_url}
              collectionName={nft.collection_name}
              nftPrice={nft.fix_price?.price}
              onSale={nft.on_sale}
              onClickNext={handleClickNext}
              onClickPrev={handleClickPrev}
              isShowing={true}
            />
          );
        })}
    </div>
  );
};

export default SectionLargeSlider;
