"use client";
import NcImage from "@/shared/NcImageSmall/NcImage";
import collectionBanner from "@/images/nfts/collectionBanner.png";
import { nftsImgs } from "@/contains/fakeData";
import { useState } from "react";
import axios from "axios";
import CardNFT from "@/components/CardNFT";
import { useQuery } from "@tanstack/react-query";
import Loading from "../loading";
import { useSearchParams } from "next/navigation";
import { NftType } from "@/types/Nft";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const PageCollection = ({}) => {
  const params = useSearchParams();
  const [nfts, setNfts] = useState<NftType[]>([]);
  const { isLoading } = useQuery({
    queryKey: ["nft"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${apiBaseUrl}/nfts/getNftsbycollection/${params.get("id")}`
      );
      console.log(data.response);
      setNfts(data.response);
      return data;
    },
    cacheTime: Infinity,
  });
  const img = params.get("image");
  const bannerImage = params.get("banner_img");
  console.log(img);
  return (
    <>
      {" "}
      {isLoading ? (
        <Loading />
      ) : (
        <div className={`nc-PageCollection`}>
          <div className="w-full">
            <div className="relative w-full h-40 md:h-60 2xl:h-72">
              <NcImage
                containerClassName="absolute inset-0"
                src={bannerImage ? bannerImage : collectionBanner}
                className="object-cover"
                fill
                sizes="100vw"
              />
            </div>
            <div className="relative container -mt-14 lg:-mt-20">
              <div className=" bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row lg:items-center">
                <div className="flex flex-col sm:flex-row md:block sm:items-start sm:justify-between">
                  <div className="w-40 sm:w-48 md:w-56 xl:w-60">
                    <NcImage
                      src={img ? img : nftsImgs[2]}
                      containerClassName="aspect-w-1 aspect-h-1 relative rounded-full overflow-hidden z-0"
                      width={100}
                      height={100}
                      // sizes="300px"
                    />
                  </div>
                </div>
                <div className="mt-5 md:mt-0 md:ml-8 xl:ml-14 flex-grow">
                  <div className="max-w-screen-sm ">
                    <h2 className="inline-block text-2xl sm:text-3xl lg:text-4xl font-semibold">
                      {params.get("name")}
                    </h2>
                    <span className="block mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                      {params.get("description")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container py-16 lg:pb-28 lg:pt-20 space-y-20 lg:space-y-28">
            <main>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
                {nfts.length > 0 ? (
                  nfts.map((nft) => (
                    <CardNFT
                      key={nft.id}
                      id={nft.id}
                      name={nft.name}
                      currentOwner={
                        nft?.secondary_owner?.buyer
                          ? nft?.secondary_owner?.buyer?.wallet
                          : nft?.primary_owner
                      }
                      img={nft.img}
                      fix_price={nft?.fix_price ? nft?.fix_price?.price : ""}
                      onSale={nft.status.sale}
                      onAuction={nft?.status?.auction}
                      onStake={nft?.status?.stake}
                      token_id={nft.token_id}
                      collection_address={nft.collection_address}
                      blockChain={nft.blockchain}
                    />
                  ))
                ) : (
                  <h1 className="text-[20px] text-center">
                    No NFT`s In This Collection
                  </h1>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default PageCollection;
