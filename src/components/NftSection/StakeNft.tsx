import React, { useEffect, useState } from "react";
import { NftHome } from "@/types/Nft";
import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";

function NFTGallery() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
  const wallet = Cookies.get("wallet");
  const userId = Cookies.get("userId");
  const [nfts, setNfts] = useState<NftHome[]>([]);
  const [Like, setLike] = useState(false);
  const [Likes, setLikes] = useState(0);

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

  const stakedNfts = nfts.filter((val: any) => val?.status?.stake === true);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl pb-6 text-bold max-md:text-center">
        Stake NFT's
      </h1>
      {stakedNfts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stakedNfts.slice(0, 4).map((nft, idx) => (
            <div
              key={idx}
              className="dark:bg-gray-800 rounded-lg shadow-2xl p-4 m-4"
            >
              <img
                src={nft.img}
                alt="NFT IMG"
                className="rounded-lg w-full h-48 object-cover transform transition-transform duration-300 hover:scale-110"
              />
              <div className="mt-4">
                <div className="flex items-center mt-2">
                  <img
                    src={nft.img}
                    alt="Creator"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="dark:text-gray-400 text-black">Creator</p>
                    <p className="dark:text-gray-400 text-black">
                      {nft.primary_owner.slice(0, 7)}
                    </p>
                  </div>
                </div>
                <div className="w-full h-[1px] dark:bg-gray-600 bg-white my-4"></div>
                <div className="flex justify-between">
                  <div>
                    <Link
                      href={{
                        pathname: "/nft-detail",
                        query: {
                          id: nft?.id,
                          // onSale: nft?.status?.sale,
                        },
                      }}
                    >
                      <p className="text-[16px] dark:text-gray-400 text-black font-bold hover:bg-gradient-to-r hover:from-[#FFD757] hover:to-[#FF954D] hover:bg-clip-text hover:text-transparent dark:hover:bg-gradient-to-r dark:hover:from-[#FFD757] dark:hover:to-[#FF954D] dark:hover:bg-clip-text dark:hover:text-transparent">
                        {nft?.name}
                      </p>
                    </Link>
                    {nft.status.auction && (
                      <>
                        <p className="text-[13px] dark:text-gray-400 text-black">
                          TIME
                        </p>
                        <p className="text-[13px] dark:text-gray-400 text-black">
                          {nft?.open_auction?.auctionEndTime}
                        </p>
                      </>
                    )}
                  </div>
                  {/* <div className="flex cursor-pointer items-center">
                    {Like ? (
                      <img src="/Image/Like.svg" alt="Unlike" className="w-5" />
                    ) : (
                      <img
                        src="/Image/Unliked.svg"
                        alt="Unlike"
                        className="w-5"
                      />
                    )}
                    <span className="ml-1 dark:text-gray-400 text-black">
                      {Likes}
                    </span>
                  </div> */}
                </div>
                <div className="flex flex-col mt-3">
                  <p className="dark:text-gray-400 text-black">Price</p>
                  <p className="bg-gradient-to-r from-[#FFDE59] to-[#FF954C] bg-clip-text text-transparent font-bold">
                    {nft?.fix_price?.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 m-4">No NFT's On Stake</div>
      )}
    </div>
  );
}

export default NFTGallery;
