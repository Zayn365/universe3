import React, { useEffect, useState } from "react";
import { NftHome } from "@/types/Nft"; // Assuming you have defined this type
import axios from "axios";
import Link from "next/link";

function BulkNftCard() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
  const [nfts, setNfts] = useState<NftHome[]>([]);

  const fetchNfts = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/nfts/getAll`);
      const filteredData = response.data.data.filter(
        (val: any) =>
          val?.status?.stake === false &&
          val?.status?.sale === false &&
          val?.status?.auction === false &&
          !val?.token_id
      );;
      setNfts(filteredData);
    } catch (error) {
      console.error("Failed to fetch NFTs", error);
    }
  };

  useEffect(() => {
    fetchNfts();
  }, []);
  const handleDownload = async (nft: any) => {
    const downloadImage = await fetch(`/api/download?url=${nft}`).then(r => r.blob());
    const fileName = nft?.split("/")[nft?.split("/").length - 1];
    var el = document.createElement("a");
    el.setAttribute("href", URL.createObjectURL(downloadImage));
    el.setAttribute("download", fileName);
    document.body.appendChild(el);
    el.click();
    el.remove();
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nfts.length > 0 ? (
          nfts.map((nft, idx) => {
            return (

              <div
                key={idx}
                className="dark:bg-gray-800 rounded-lg shadow-2xl p-4 m-4"
              >
                <Link
                  href={{
                    pathname: "/nft-detail",
                    query: {
                      id: nft?.id,
                      // onSale: nft?.status?.sale,
                      mint:true
                    },
                  }}
                >
                  <img
                    src={nft.img}
                    alt="NFT IMG"
                    className="rounded-lg w-full h-48 object-cover transform transition-transform duration-300 hover:scale-110"
                  />
                </Link>
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
                            mint:true
                          },
                        }}
                      >
                        <p className="text-[16px] dark:text-gray-400 text-black font-bold hover:bg-gradient-to-r hover:from-[#FFD757] hover:to-[#FF954D] hover:bg-clip-text hover:text-transparent dark:hover:bg-gradient-to-r dark:hover:from-[#FFD757] dark:hover:to-[#FF954D] dark:hover:bg-clip-text dark:hover:text-transparent">
                          {nft?.name}
                        </p>
                      </Link>
                      {nft?.status?.auction && (
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
                  </div>
                  {/* <div className="flex flex-col my-3">
                    <p className="dark:text-gray-400 text-black">Price</p>
                    <p className="bg-gradient-to-r from-[#FFDE59] to-[#FF954C] bg-clip-text text-transparent font-bold">
                      {nft?.fix_price?.price}
                    </p>
                  </div> */}
                  <div className="flex mt-3 items-center justify-between">
                    {/* <Link href={nft?.img} target="_blank" className="py-2 px-4 rounded-lg bg-white/70 dark:bg-black/70 border dark:border-transparent transition-all duration-300 ease-in-out hover:text-white hover:border-black dark:hover:border-white hover:bg-black/70 hoverdark::bg-transparent">Download</Link> */}
                    <Link href="" className="py-2 px-4 rounded-lg bg-white/70 dark:bg-black/70 border dark:border-transparent transition-all duration-300 ease-in-out hover:text-white hover:border-black dark:hover:border-white hover:bg-black/70 dark:hover:bg-transparent" onClick={() => handleDownload(nft?.img)}>Download</Link>
                    <Link href={{
                      pathname: "/nft-detail",
                      query: {
                        id: nft?.id,
                        // onSale: nft?.status?.sale,
                        mint: true
                      },
                    }}
                      className="py-2 px-4 rounded-lg bg-white/70 dark:bg-black/70 border dark:border-transparent transition-all duration-300 ease-in-out hover:text-white hover:border-black dark:hover:border-white hover:bg-black/70 hoverdark::bg-transparent">Mint</Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <span>
            <p className="dark:text-white text-bold text-center">
              No NFT&apos;s
            </p>
          </span>
        )}
      </div>
    </div>
  );
}

export default BulkNftCard;
