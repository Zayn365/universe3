"use client";
import { FC, useEffect, useState } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Badge from "@/shared/Badge/Badge";
import Link from "next/link";
import NftMoreDropdown from "./NftMoreDropdown";
import { nftsImgs } from "@/contains/fakeData";
import { ethers } from "ethers";
import ABI from "@/../contracts/ABI-NFTMarketplace.json";
import { useWeb3Helper } from "@/helpers/web3HelperFunctions";
import { useUserContext } from "@/hooks/useUserContext";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
declare let window: any;

export interface CardNFTProps {
  id?: number;
  img?: string;
  name?: string;
  description?: string;
  fix_price?: {
    price: number | undefined;
  };
  className?: string;
  isLiked?: boolean;
  currentOwner?: string;
  primaryOwner?: string;
  onSale?: boolean;
  onAuction?: boolean;
  onStake?: boolean;
  owner_wallet?: string;
  token_id?: string;
  collection_address?: string;
  status?: any;
  blockChain?: any;
  data?: any;
  imageClass?: string;
  isProfile?: boolean | undefined;
}

const CardNFT: FC<CardNFTProps> = ({
  className = "",
  isLiked,
  id,
  name,
  img,
  description,
  fix_price,
  currentOwner,
  token_id,
  onSale,
  collection_address,
  blockChain,
  data,
  onAuction,
  onStake,
  imageClass,
  isProfile,
}) => {
  const contractAddress = "0xdd89638c5ec6B5A8a0Dbbad41074480e4DCBDd98";
  const { RemoveNft } = useWeb3Helper();

  const [username, setUserName] = useState<string | null>();
  const router = useRouter();
  const userId = Cookies.get("userId");
  const token = Cookies.get("loginToken");
  const wallet = Cookies.get("wallet");
  const token_id_int = parseInt(token_id as string);

  // useEffect(() => {
  //   axios
  //     .get(`${apiBaseUrl}/user/read/${userId}`)
  //     .then((response) => {
  //       response.data.result.forEach((item: any) => {
  //         if (item.name) {
  //           setUserName(item.name);
  //         } else {
  //           console.log("Name property does not exist");
  //         }
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  const [itemType, setItemType] = useState<"video" | "audio" | "default">(
    "default"
  );

  const handleOnSale = async () => {
    if (wallet) {
      router.push(`nft-detail?id=${id}`);
    }
  };

  const handleRemoveFromSale = async () => {
    await RemoveNft(data?.listingid, data);
  };
  const { user } = useUserContext();
  console.log(currentOwner, wallet, "CHECK");
  return (
    <div
      className={`nc-CardNFT relative flex flex-col group justify-between ${className}`}
    >
      <div className="relative flex-shrink-0 ">
        <div
          className={
            onSale && onStake && onAuction
              ? "flex aspect-w-11 aspect-h-12 max-h-64 w-full rounded-3xl overflow-hidden z-0"
              : "flex aspect-w-11 aspect-h-12 max-h-64 w-full rounded-3xl overflow-hidden z-0 !cursor-not-allowed"
          }
        >
          <Link
            href={{
              pathname: "/nft-detail",
              query: {
                id: id,
                // onSale: onSale,
              },
            }}
            onClick={(e) => {
              if (
                !((onSale && onStake && onAuction) || currentOwner === wallet)
              ) {
                e.preventDefault();
              }
            }}
          >
            <Image
              className={`object-cover w-full cursor-pointer h-full min-h-[260px] !relative group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform ${imageClass}`}
              src={!img ? nftsImgs[0] : img}
              alt="NFT Image"
              fill
            />
          </Link>
        </div>

        {userId ? (
          <>
            {" "}
            <LikeButton
              nftId={id}
              userId={userId}
              liked={isLiked}
              className="absolute top-3 right-3 z-10 !h-9"
            />
          </>
        ) : (
          <></>
        )}

        <div className="absolute top-3 inset-x-3 flex"></div>
      </div>
      <div className="px-2 py-5 space-y-3">
        <h2 className={`text-lg font-medium`}>{name}</h2>
        <h2 className={`text-lg font-medium`}>{description}</h2>

        <div>
          <h5>
            <div className="flex justify-between">
              <Link
                href={{
                  pathname: "/nft-detail",
                  query: {
                    id: id,
                    // onSale: onSale,
                  },
                }}
              >
                <div className="flex items-center">
                  <Avatar
                    imgUrl={img ? nftsImgs[0] : "/"}
                    sizeClass="h-6 w-6"
                    containerClassName="ring-2 ring-white"
                  />
                  <div className="ml-2 text-sm">
                    <span className="font-normal">Owner:</span>{" "}
                    <span className="font-medium">
                      {currentOwner
                        ? currentOwner.slice(0, 7) + "..."
                        : "Loading..."}
                    </span>
                  </div>
                </div>
              </Link>
              {userId == currentOwner && onSale ? (
                <div className="h-0">
                  <NftMoreDropdown id={id} />
                </div>
              ) : (
                ""
              )}
            </div>
          </h5>
        </div>

        <div className="w-full border-b border-neutral-200/70 dark:border-neutral-700"></div>

        <div className="flex justify-between items-end">
          <Prices
            className="text-xs"
            price={fix_price?.toString()}
            labelTextClassName="bg-white dark:bg-neutral-900"
          />
          {wallet && wallet === currentOwner && token_id ? (
            <>
              {onSale ? (
                <button
                  onClick={handleRemoveFromSale}
                  className="border-2 border-green-500 text-xs hover:text-white hover:bg-green-600 text-green-500 py-2 px-4 rounded"
                >
                  Remove
                </button>
              ) : onStake ? (
                <Link
                  href={{
                    pathname: `/staking/${id}`,
                  }}
                >
                  <Badge
                    name="On Stake"
                    className="bg-opacity-0 border border-green-500 text-green-500"
                  />
                </Link>
              ) : onAuction ? (
                <Link
                  href={{
                    pathname: "/auction-nft",
                  }}
                >
                  <Badge
                    name="On Auction"
                    className="bg-opacity-0 border border-green-500 text-green-500"
                  />
                </Link>
              ) : (
                <button
                  onClick={handleOnSale}
                  className="border-2 border-green-500 text-xs hover:text-white hover:bg-green-600 text-green-500 py-2 px-4 rounded"
                >
                  View Nft
                </button>
              )}
            </>
          ) : (
            <>
              {
                onSale ? (
                  <Link
                    href={{
                      pathname: "/nft-detail",
                      query: {
                        id: id,
                        // onSale: true,
                        mint: false,
                      },
                    }}
                  >
                    <button
                      disabled={!wallet}
                      className="border-2 border-green-500 text-xs disabled:text-gray-200 disabled:border-gray-500 disabled:bg-slate-600 hover:text-white hover:bg-green-600 text-green-500 py-2 px-4 rounded"
                    >
                      {!wallet ? "Connect" : "Buy"}
                    </button>
                  </Link>
                ) : onStake ? (
                  <Link
                    href={{
                      pathname: `/staking/${id}`,
                    }}
                  >
                    <Badge
                      name="On Stake"
                      className="bg-opacity-0 border border-green-500 text-green-500"
                    />
                  </Link>
                ) : onAuction ? (
                  <Link
                    href={{
                      pathname: "/auction-nft",
                    }}
                  >
                    <Badge
                      name="On Auction"
                      className="bg-opacity-0 border border-green-500 text-green-500"
                    />
                  </Link>
                ) : (
                  ""
                )
                // !onStake && !onSale && !onAuction ? (
                //   <Link
                //     href={{
                //       pathname: "/nft-detail",
                //       query: {
                //         id: id,
                //         onSale: false,
                //         mint: true,
                //       },
                //     }}
                //   >
                //     <Badge
                //       name="Mint Nft"
                //       className="bg-opacity-0 border border-green-500 text-green-500"
                //     />
                //   </Link>
                // ) : (
                //   ""
                // )
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CardNFT), { ssr: false });
