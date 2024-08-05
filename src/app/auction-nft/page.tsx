"use client";
import { FormatDateTime, FormatOnlyDate } from "@/components/formatDataTime";
import { useWeb3Helper } from "@/helpers/web3HelperFunctions";
import { useUserContext } from "@/hooks/useUserContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import React, { useState } from "react";

type Props = {};

const page = (props: Props) => {
  const [auctionNft, setAuctionNft] = useState<any[]>([]);
  const [auctionList, setAuctionList] = useState<any[]>([]);
  const [userNFt, setUserNft] = useState<any[]>([]);
  const [activeButton, setActiveButton] = useState(null);
  const { CancelAuction, PlaceBid, ReleaseBid } = useWeb3Helper();
  const { user } = useUserContext();
  const [bids, setBids] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASEURL;
  const wallet = Cookies.get("wallet");
  console.log(bids, "YO");
  const { isLoading, refetch } = useQuery({
    // @ts-ignore
    queryKey: ["auctionNft"],
    queryFn: async () => {
      const auction = await axios.get(`${apiUrl}/auction/getAllAuction`);
      setAuctionList(auction.data.data);
      const { data } = await axios.get(`${apiUrl}/nfts/getAll`);
      const auctionedNfts = data.data.filter(
        (val: any) => val?.status.auction === true
      );
      const userNFt = await axios.get(`${apiUrl}/nfts/getAll`);
      const filter = userNFt.data.data.filter((val: any) => {
        if (
          val.secondary_owner?.buyer?.wallet === wallet &&
          val.status.auction === true
        ) {
          return val;
        }
      });
      setUserNft(filter);
      setAuctionNft(auctionedNfts);
    },
    defaultOptions: {
      queries: {
        retryDelay: (attemptIndex: any) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
  const highestBid = (myId: any) => {
    return auctionList.find((value) => value?.nft_id === myId);
  };
  return (
    <div className="min-h-screen">
      <header className="my-12 sm:lg:my-16 lg:my-24 max-w-5xl mx-auto space-y-8 sm:space-y-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-semibold">NFTs Auction</h2>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            You can bid on NFTS here.
          </span>
        </div>
      </header>
      <div className="px-20">
        <hr />
      </div>
      <main className="container mx-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : auctionNft ? (
          <section className="flex flex-wrap -mx-4">
            {auctionNft &&
              auctionNft?.map((val: any, key: any) => (
                <div className="w-full md:w-1/2 xl:w-1/3 p-4">
                  <div className="bg-white dark:bg-slate-800 shadow-md p-4 rounded">
                    <Image
                      src={val ? val?.img : "https://via.placeholder.com/300"}
                      alt="NFT Image"
                      className="w-full rounded-t max-h-40 object-cover object-center"
                      width={500}
                      height={500}
                    />
                    <div className="p-4">
                      <h2 className="text-2xl font-bold">{val?.name}</h2>
                      <p className="text-gray-600">
                        {val?.description
                          ? val?.description.slice(0, 20) + "..."
                          : ""}
                      </p>
                      <ul className="list-none mb-4">
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Bidding Price:
                          </span>
                          <span className="text-lg font-bold">
                            {val?.open_auction?.startPrice} MATIC
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Auction Started At:
                          </span>
                          <span className="text-lg font-bold">
                          {FormatOnlyDate(val?.open_auction?.auctionStartTime)}
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Auction Ends At:
                          </span>
                          <span className="text-lg font-bold">
                          {FormatOnlyDate(val?.open_auction?.auctionEndTime)}
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Creator:
                          </span>
                          <span className="text-lg ">
                            {val?.primary_owner?.slice(0, 7)}...
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Auctioned By:
                          </span>
                          <span className="text-lg ">
                            {val?.secondary_owner?.buyer?.wallet?.slice(0, 7)}
                            ...
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            {" "}
                            Reserve Price:
                          </span>
                          <span className="text-lg font-bold">
                            {val?.open_auction?.startPrice} MATIC
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            {" "}
                            Highest Bid Price:
                          </span>
                          <span className="text-lg font-bold">
                            {highestBid(val.id)
                              ? highestBid(val.id)?.current_price + " MATIC"
                              : "Not Placed Yet"}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex mt-4 w-full items-center justify-center mb-4">
                        <div className="flex justify-around items-center px-2">
                          <input
                            type="number"
                            required
                            disabled={!user}
                            className="w-full pl-2 py-2 border border-gray-300 rounded-md focus:outline-none dark:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Amount"
                            onChange={(e: any) => {
                              const itemId = val.auctionid; // or use a unique ID for each item
                              setBids((prevBids: any) => ({
                                ...prevBids,
                                [itemId]: e.target.value.toString(),
                              }));
                            }}
                            // style={{color: "black"}}
                          />
                        </div>
                        <button
                          disabled={
                            !wallet ||
                            (auctionNft[key]?.open_auction?.startPrice >=
                              bids[val.auctionid] &&
                              auctionNft[key]?.open_auction?.reservedPrice >=
                                bids[val.auctionid])
                              ? true
                              : false
                          }
                          onClick={() => {
                            PlaceBid(
                              val?.collection_address,
                              val?.auctionid,
                              bids[val.auctionid],
                              val,
                              wallet as string,
                              refetch,
                              auctionList
                            );
                          }}
                          className="bg-orange-500 hover:bg-orange-700 disabled:bg-slate-500 text-white font-bold py-2 px-4 rounded"
                        >
                          Place Bid
                        </button>
                      </div>
                    </div>
                    <span className="text-[8px] text-red-500">
                      {bids[val.auctionid] &&
                        bids[val.auctionid] !== "" &&
                        (auctionNft[key]?.open_auction?.reservedPrice >=
                        bids[val.auctionid]
                          ? "Bid is less than Reserved Price"
                          : auctionNft[key]?.open_auction?.startPrice >=
                            bids[val.auctionid]
                          ? "Bid is less than Highest Price"
                          : "")}
                    </span>
                  </div>
                </div>
              ))}
          </section>
        ) : (
          ""
        )}

        <section className="py-4">
          <h2 className="text-2xl font-bold">Auction NFTs Details</h2>
          <ul className="list-none mb-4">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : auctionList ? (
              auctionList.map((val: any, key: any) => {
                const data = userNFt.find((g) => g.id === val.nft_id);
                if (val.auction_status !== "ended") {
                  return (
                    <>
                      <div className="border border-slate-400 rounded-md p-8 my-4">
                        <p className="text-2xl text-bolder underline">
                          {val?.nft_name}
                        </p>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Nft Name:</span>
                          <span className="text-lg font-bold">
                            {val?.nft_name}
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Start Time:</span>
                          <span className="text-lg font-bold">
                            {val?.auction_start_time}
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600">End Time:</span>
                          <span className="text-lg font-bold">
                            {val?.auction_end_time}
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Auction Index:</span>
                          <span className="text-lg font-bold">
                            {val?.auction_index}
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Starting Price:</span>
                          <span className="text-lg font-bold">
                            {val?.starting_price}
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Highest Bidder:</span>
                          <span className="text-lg font-bold">
                            {val?.highest_bidder
                              ? val?.highest_bidder.slice(0, 10) + "..."
                              : ""}
                          </span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Current Bid:</span>
                          <span className="text-lg font-bold">
                            {val?.current_price} MATIC
                          </span>
                        </li>

                        {user && wallet && data ? (
                          <>
                            <li className="flex justify-between items-center py-2">
                              <span className="text-gray-600">
                                Release Auction:
                              </span>
                              <button
                                onClick={() =>
                                  ReleaseBid(
                                    val.auction_index,
                                    val,
                                    data,
                                    refetch
                                  )
                                }
                                disabled={
                                  data?.open_auction?.auctionEndTime ===
                                  val?.open_auction?.auctionEndTime
                                }
                                className="text-lg disabled:bg-slate-400 p-4 rounded-md font-bold bg-red-500 hover:bg-red-300"
                              >
                                Release Nft
                              </button>
                            </li>
                            <li className="flex justify-between items-center py-2">
                              <span className="text-gray-600">
                                Cancel Auction:
                              </span>
                              <button
                                onClick={() =>
                                  CancelAuction(
                                    val.auction_index,
                                    val,
                                    data,
                                    refetch
                                  )
                                }
                                className="text-lg disabled:bg-slate-400 p-4 rounded-md font-bold bg-red-500 hover:bg-red-300"
                              >
                                Cancel Auction
                              </button>
                            </li>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </>
                  );
                }
              })
            ) : (
              ""
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default page;
