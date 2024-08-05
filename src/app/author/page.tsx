"use client";
import CardNFT from "@/components/CardNFT";
import { nftsImgs } from "@/contains/fakeData";
import { useUserContext } from "@/hooks/useUserContext";
import { NftType } from "@/types/Nft";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const page = () => {
  const userId = Cookies.get("userId");
  const load = true;
  const { types, user } = useUserContext();
  const [nfts, setNft] = useState<NftType[]>([]);
  const [row, setRows] = useState<number | null>(null);
  const wallet = user?.wallet;
  const token = Cookies.get("loginToken");
  const { isLoading } = useQuery({
    queryKey: ["nft"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiBaseUrl}/nfts/getAll`);
      console.log(data.data);
      setRows(data.data.length);
      const filter = data.data.filter((val: any) => {
        if (
          val.secondary_owner?.buyer?.wallet
            ? val.secondary_owner?.buyer?.wallet === wallet
            : val.primary_owner === wallet
        ) {
          return val;
        }
      });
      setNft(filter);
      return filter;
    },
    cacheTime: Infinity,
  });

  const filteredNFTs = nfts
    .filter((nft) => {
      switch (types.type) {
        case "sale":
          return (
            nft.secondary_owner?.buyer?.wallet === wallet &&
            nft.primary_owner !== wallet
          );
        case "auction":
          return nft.status.auction === types.status;
        case "stake":
          return nft.status.stake === types.status;
        default:
          return true;
      }
    })
    .map((nft, index) => (
      <CardNFT
        key={nft?.id}
        id={nft?.id}
        img={nft && nft?.img ? nft?.img : ""}
        name={nft?.name}
        fix_price={nft?.fix_price ? nft?.fix_price?.price : ""}
        currentOwner={nft?.secondary_owner?.buyer?.wallet}
        onSale={nft?.status?.sale}
        onAuction={nft?.status?.auction}
        onStake={nft?.status?.stake}
        token_id={nft?.token_id}
        collection_address={nft?.collection_address}
        data={nft}
        isProfile={true}
      />
    ));

  return (
    <>
      {" "}
      {isLoading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div>
          {row === 0 ? (
            <>
              <div className="">
                <h1 className="text-center pt-10">No NFT`s Found</h1>
              </div>
            </>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10  mt-8 lg:mt-10">
                {filteredNFTs.length > 0 ? filteredNFTs : "NO NFTS"}
              </div>
              <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                {/* <Pagination />
            <ButtonPrimary>Show me more</ButtonPrimary> */}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default page;
