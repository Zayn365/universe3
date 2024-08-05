"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import lightDot from "../../images/lightIcons/dot-circle.svg";
import darkDot from "../../images/darkIcons/dot-circle.svg";
import arrowLight from "../../images/lightIcons/arrow-down.svg";
import listLight from "../../images/lightIcons/list-ul.svg";
import arrowDark from "../../images/darkIcons/arrow-down.svg";
import listDark from "../../images/darkIcons/list-ul.svg";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { Dropdown, Menu } from "antd";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useWeb3Helper } from "@/helpers/web3HelperFunctions";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import AccordionInfo from "@/components/AccordionInfo";
import ResellModal from "./ResellModal";
import SellModal from "./SellModal";
import AuctionModel from "./AuctionModel";
import StakeModel from "./StakeModel";
import axiosInstance from "@/api/axiosInstance";
import { FormatDateTime } from "@/components/formatDataTime";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

let dataTable = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
];

const menu = (
  <Menu theme="dark">
    <Menu.Item key="1">Option 1</Menu.Item>
    <Menu.Item key="2">Option 2</Menu.Item>
    <Menu.Item key="3">Option 3</Menu.Item>
  </Menu>
);

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
declare let window: any;

const NftDetailPage = () => {
  const { BuyMarket, mintNft } = useWeb3Helper();
  const [activeIndex, setActiveIndex] = useState(0);
  const [clickBid, setBidClick] = useState(false);
  const [clickAll, setClickAll] = useState(false);
  const [nftBuy, setNftBuy] = useState(false);
  const [openAuction, setOpenAuction] = useState(false);
  const [hideStake, setHideStake] = useState(true);
  const [openSell, setOpenSell] = useState(false);
  const [stakeOpen, setStakeOpen] = useState({
    isStake: false,
  });
  const [open, setOpen] = useState(false);
  const [mintLoader, setMintLoader] = useState(false);
  const userId = Cookies.get("userId");
  const token = Cookies.get("loginToken");
  const wallet = Cookies.get("wallet");
  const [loader, setLoader] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const [btnLoader, setBtnLoader] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    // @ts-ignore
    queryKey: ["nft"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${apiBaseUrl}/nfts/read/${params.get("id")}`
      );
      // console.log(data.data);
      return data.data;
    },
  });
  const check = data?.secondary_owner?.buyer?.wallet === wallet;
  console.log(data?.secondary_owner?.buyer?.wallet, wallet, "YO");
  // console.log(data?.secondary_owner?.buyer?.wallet);
  // console.log(wallet);
  const list = useQuery({
    queryKey: ["blockChainTxn"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${apiBaseUrl}/blockChainTxn/getBlocksByNftId/${params.get("id")}`
      );
      // console.log(data.data);
      return data.response;
    },
  });
  console.log(list.data, "CHEKCERS");
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  }, []);

  const [stakeSettings, setStakeSettings] = useState(null);

  const getNftSettings = async () => {
    const nftId = params.get("id");
    const settings = await axiosInstance
      .get(`/stake-rules`)
      .then((r) => r.data.data.sort((a: any, b: any) => b.id - a.id)[0]);
    console.log(settings, "CHECK ME STAKE");
    setStakeSettings(settings);
  };

  useEffect(() => {
    getNftSettings();
  }, [params]);

  useEffect(() => {
    setNftBuy(check === undefined || check === false ? false : true);
  }, [data]);
  const mintLoaderHandle = (type: boolean) => {
    setMintLoader(type);
  };
  const handleSubmit = async () => {
    if (!wallet) {
      toast.error("Please connect wallet to buy NFT");
      return;
    }
    // if (!userId) {
    //   toast.error("Please SignIn or SignUp to buy NFT");
    //   return;
    // }
    try {
      await BuyMarket(
        data?.listingid,
        data?.fix_price.price,
        Number(params.get("id")),
        data,
        wallet,
        refetch
      );
      setBtnLoader(false);
      // console.log(`NFT has been bought`);
    } catch (error) {
      setBtnLoader(false);
      // toast.error("Error occured while buying NFT");
      console.error("An error occurred", error);
      return;
    }

    // if (userId) {
    //   await axios
    //     .put(
    //       `${apiBaseUrl}/nfts/update/${userId}`,
    //       {
    //         id: params.get("id"),
    //         status: false,
    //       },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       console.log(response.data);
    //       router.push("/nft");
    //       toast.success("NFT bought successfully");
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       toast.error("Error occured while buying NFT");
    //     });
    // }
    // if (!userId) {
    //   toast.error("Please login to buy NFT");
    // }
  };

  const handleClick = (index: any) => {
    setActiveIndex(index);
  };

  const data1 = [
    {
      id: 0,
      list: [
        { name: "Category", value: data ? data.category : "Music" },
        {
          name: "Contract Id",
          value: data ? `${data.contract_address?.slice(0, 7)}...` : "N/A",
        },
        { name: "Token Id", value: data ? data.token_id : "N/A" },
        { name: "Transaction Chain", value: data ? data.blockchain : "N/A" },
      ],
    },
    {
      id: 1,
      description: data ? data?.description : "Lorem Ipsum",
    },
  ];

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };
    handleRouteChange();
  }, [router]);

  return (
    <>
      {" "}
      {loader ? (
        <div className="flex justify-center items-center max-h-screen min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div>
          {/* TOP SECTION */}
          <div className="m-4 flex flex-col md:flex-row justify-start w-full md:w-auto">
            {/* Image Section */}
            <section>
              <div className="max-sm:flex-wrap">
                <Image
                  className="rounded-sm object-cover max-h-[300px] sm:max-w-full md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] p-2 mb-5"
                  alt="Logo"
                  src={
                    data
                      ? data.img
                      : "https://t3.ftcdn.net/jpg/05/71/06/76/360_F_571067620_JS5T5TkDtu3gf8Wqm78KoJRF1vobPvo6.jpg"
                  }
                  width={600}
                  height={300}
                />
              </div>
              <div className="py-2">
                <ul className="flex justify-start max-sm:flex-wrap text-lg">
                  <li
                    onClick={() => handleClick(0)}
                    className={`mx-2 dark:text-white text-[#545454] text-sm font-thin hover:text-blue-500 cursor-pointer ${
                      activeIndex === 0 ? "active-li-nft" : ""
                    }`}
                  >
                    Overview
                  </li>
                  <li
                    onClick={() => handleClick(1)}
                    className={`mx-2 dark:text-white text-[#545454] text-sm font-thin hover:text-blue-500 cursor-pointer ${
                      activeIndex === 1 ? "active-li-nft" : ""
                    }`}
                  >
                    Description
                  </li>
                </ul>
                <hr className="opacity-[0.3]" />
              </div>
              <div className="mt-4 mb-20 w-[35rem]">
                {data1
                  ? data1
                      ?.filter((val) => val.id === activeIndex)
                      ?.map((val: any, key: any) => {
                        if (val.list) {
                          return (
                            <>
                              <ul>
                                {val.list.map((li: any) => (
                                  <li
                                    className="flex justify-between"
                                    key={li.name}
                                  >
                                    <span className="flex justify-start my-1">
                                      <Image
                                        src={lightDot}
                                        className="dark:hidden flex"
                                        width={20}
                                        height={20}
                                        alt="light"
                                      />
                                      <Image
                                        src={darkDot}
                                        className="dark:flex hidden"
                                        width={20}
                                        height={20}
                                        alt="dark"
                                      />
                                      <span className="mx-1">{li.name}</span>
                                    </span>
                                    <span className="">{li.value}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          );
                        } else {
                          return (
                            <div className="">
                              <span>{val.description}</span>
                            </div>
                          );
                        }
                      })
                  : ""}
              </div>
            </section>
            {/* Detail Section */}
            <section className="m-4 md:m-5 w-full md:w-[70%]">
              <span className="text-[32px] font-bold">
                {data ? data.name : "NFT NAME"}
              </span>
              <span className="text-lg mt-2 font-thin flex justify-start">
                <span className="mr-2">Owned By:</span>
                <span className="text-blue-500">
                  {data && data?.secondary_owner?.buyer
                    ? data?.secondary_owner?.buyer?.wallet?.slice(0, 7)
                    : data?.primary_owner?.slice(0, 7)}
                  ...
                </span>
              </span>
              <section className="dark:bg-[#232333] bg-[#fafafa] border border-[#bdbaba] w-[80%] sm:w-full sm:max-w-[50%] lg:max-w-[100%] rounded-md mt-10">
                <div className="w-full">
                  {data &&
                  (data?.status?.auction ||
                    data?.status?.sale ||
                    data?.status?.stake) &&
                  data?.secondary_owner?.buyer?.wallet === wallet ? (
                    <div className="py-3 px-4  my-5 mx-4">
                      <div className="grid grid-col-1 mt-2">
                        <span className="dark:text-[#bdbaba] text-[#232333] py-3">
                          You are the owner of the nft. You can't perform any
                          actions !
                        </span>
                      </div>
                    </div>
                  ) : data?.status?.auction ? (
                    <div className="py-3 px-4  my-5 mx-4">
                      <span className="text-sm dark:text-[#99989d]">
                        Sale ends {data && data?.open_auction?.auctionEndTime}
                      </span>

                      <FlipClockCountdown
                        className="lg:w-full flex-wrap"
                        to={new Date().getTime()}
                        labelStyle={{
                          fontSize: 10,
                          fontWeight: 500,
                          textTransform: "uppercase",
                        }}
                        digitBlockStyle={{
                          width: 30,
                          height: 25,
                          fontSize: 18,
                          backgroundColor: "#00a4ff",
                        }}
                        dividerStyle={{
                          color: "#00a4ff",
                          height: 1,
                        }}
                        separatorStyle={{ color: "#4f4f5c", size: "3px" }}
                      />

                      <div className="grid grid-col-1 mt-2">
                        <span className="dark:text-[#bdbaba] text-[#232333]  py-3">
                          Min Bid
                        </span>
                        <span className="text-2xl">
                          {data ? data?.open_auction?.startPrice : "Loading..."}{" "}
                          MATIC
                        </span>
                      </div>
                    </div>
                  ) : data?.status?.sale ? (
                    <div className="py-3 px-4  my-5 mx-4">
                      <div className="grid grid-col-1 mt-2">
                        <span className="dark:text-[#bdbaba] text-[#232333] py-3">
                          Price
                        </span>
                        <span className="text-2xl">
                          {data ? data?.fix_price?.price : "Loading..."} MATIC
                        </span>
                      </div>
                    </div>
                  ) : data?.status?.stake ? (
                    ""
                  ) : (
                    <div className="py-3 px-4  my-5 mx-4">
                      <div className="grid grid-col-1 mt-2">
                        <span className="dark:text-[#bdbaba] text-[#232333] py-3">
                          NFT Not On Sale !
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="pb-9">
                    <div className="mt-8 flex flex-col px-5 md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                      {data && data && params.get("mint") === "true" ? (
                        <>
                          <ButtonPrimary
                            loading={mintLoader}
                            onClick={async () => {
                              if (!wallet) {
                                toast.error(
                                  "Please connect wallet to buy Proceed"
                                );
                                return;
                              }
                              setMintLoader(true);
                              await mintNft(
                                data,
                                wallet as string,
                                refetch,
                                mintLoaderHandle as any
                              );
                            }}
                            className="flex-1 rounded-lg disabled:!bg-gray-500 disabled:cursor-not-allowed px-6 py-3 !bg-green-600 hover:!bg-green-400 text-white"
                          >
                            <span className="ml-2.5">
                              {/* {data?.token_id
                                ? // && data?.primary_owner
                                  "List NFT"
                                : "Mint"} */}
                              Mint
                            </span>
                          </ButtonPrimary>
                        </>
                      ) : data && data?.status ? (
                        !data.status.sale &&
                        !data.status.stake &&
                        !nftBuy &&
                        !data?.secondary_owner?.buyer?.wallet ? (
                          " "
                        ) : nftBuy ? (
                          <>
                            {stakeSettings && (
                              <ButtonPrimary
                                loading={stakeOpen?.isStake}
                                disabled={
                                  (nftBuy && data.status.sale) ||
                                  data.status.auction
                                    ? true
                                    : false || stakeOpen?.isStake
                                }
                                onClick={() => {
                                  !data?.status?.stake
                                    ? (setHideStake(false),
                                      setStakeOpen({ isStake: true }))
                                    : (setStakeOpen({ isStake: false }),
                                      setHideStake(false));
                                }}
                                className="flex-1 rounded-lg disabled:!bg-gray-500 disabled:cursor-not-allowed px-6 py-3 !bg-red-600 hover:!bg-red-400 text-white"
                              >
                                <span className="ml-2.5">
                                  {data?.status?.stake ? "Un" : ""}
                                  Stake
                                </span>
                              </ButtonPrimary>
                            )}
                            <ButtonPrimary
                              loading={open}
                              disabled={
                                (data && data?.status?.stake) ||
                                data?.status?.auction
                                  ? true
                                  : false || (data && data?.status?.sale)
                              }
                              onClick={() => {
                                setOpen(true);
                              }}
                              className="flex-1 rounded-lg px-6 py-3 !bg-green-600 disabled:!bg-gray-500 disabled:cursor-not-allowed hover:!bg-green-300 text-white"
                            >
                              <span className="ml-2.5">Resell</span>
                            </ButtonPrimary>
                            <ButtonPrimary
                              loading={openAuction}
                              disabled={
                                (data && data?.status?.stake) ||
                                data?.status?.sale
                                  ? true
                                  : (data && data?.status?.auction) || false
                              }
                              onClick={() => {
                                setOpenAuction(true);
                              }}
                              className="flex-1 rounded-lg px-6 py-3 !bg-orange-500 disabled:!bg-gray-500 disabled:cursor-not-allowed hover:!bg-orange-300 text-white"
                            >
                              <span className="ml-2.5">Auction</span>
                            </ButtonPrimary>
                          </>
                        ) : (
                          <>
                            {data?.status?.sale && !nftBuy ? (
                              <div className="px-5">
                                <ButtonPrimary
                                  loading={btnLoader}
                                  onClick={async () => {
                                    setBtnLoader(true);
                                    await handleSubmit();
                                  }}
                                  className="flex-1"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M7 12H14"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>

                                  <span className="ml-2.5">Buy</span>
                                </ButtonPrimary>
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        )
                      ) : (
                        "Loading..."
                      )}
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <div className="dark:bg-[#232333] w-[80%] sm:w-full flex items-center justify-between p-5 bg-[#fafafa] border border-[#bdbaba]  max-w-[100%] rounded-md mt-10">
                  <div className="flex">
                    <Image
                      src={listDark}
                      className="dark:hidden flex"
                      width={20}
                      height={20}
                      alt="light"
                    />
                    <Image
                      src={listLight}
                      className="dark:flex hidden"
                      width={20}
                      height={20}
                      alt="dark"
                    />
                    <span className="mx-2">Bids</span>
                  </div>
                  <span>
                    <Image
                      src={arrowDark}
                      className={`dark:hidden flex ${
                        clickBid ? "rotate-180" : ""
                      }`}
                      width={10}
                      height={10}
                      onClick={() => setBidClick((prev) => !prev)}
                      alt="light"
                    />
                    <Image
                      src={arrowLight}
                      className={`dark:flex hidden ${
                        clickBid ? "rotate-180" : ""
                      }`}
                      width={10}
                      height={10}
                      onClick={() => setBidClick((prev) => !prev)}
                      alt="dark"
                    />
                  </span>
                </div>
              </section>
            </section>
          </div>
          {/* BOTTOM SECTION */}
          <div className="my-8">
            {/* <div className="flex justify-between px-6 py-3">
              <span className="text-2xl font-bold">NFT Activity</span>
              <Dropdown
                disabled
                overlay={menu}
                className="dark:bg-[#232333] dark:text-white flex items-center justify-between p-5 bg-[#fafafa] border border-[#bdbaba] w-[30%] max-w-[30%] rounded-md"
              >
                <ButtonPrimary>
                  <span>All </span>
                  <Image
                    src={arrowDark}
                    className={`dark:hidden flex ${
                      clickAll ? "rotate-180" : ""
                    }`}
                    width={10}
                    height={10}
                    onClick={() => setClickAll((prev) => !prev)}
                    alt="light"
                  />
                  <Image
                    src={arrowLight}
                    className={`dark:flex hidden ${
                      clickAll ? "rotate-180" : ""
                    }`}
                    width={10}
                    height={10}
                    onClick={() => setClickAll((prev) => !prev)}
                    alt="dark"
                  />
                </ButtonPrimary>
              </Dropdown>
            </div> */}
            {/* TABLE */}
            <div className="overflow-x-scroll mx-8 rounded-md">
              <table className="min-w-full px-10 divide-y dark:divide-[#9b9b9b] divide-gray-200">
                <thead className="dark:bg-[#232333] bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      To
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Txn Hash
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="dark:bg-[#232333] bg-gray-50 divide-y dark:divide-[#9b9b9b] divide-gray-200">
                  {list.data && !list.data.error ? (
                    list.data.map((item: any) => (
                      <tr
                        key={item.key}
                        className="dark:hover:bg-[#34344b] hover:bg-gray-100"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item?.event?.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.toaddress?.slice(0, 7)}..
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.fromaddress?.slice(0, 7)}..
                        </td>
                        <a
                          href={`https://amoy.polygonscan.com/tx/${item.txn_hash}`}
                          target="_blank"
                        >
                          <td className="px-6 py-4 text-blue-500 hover:text-blue-300 whitespace-nowrap">
                            {item.txn_hash?.slice(0, 7)}...
                          </td>
                        </a>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* {item.created_at} */}
                          {FormatDateTime(item.created_at)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center">
                      <td colSpan={100}>NO List Present</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* @ts-ignore */}
          <SellModal
            open={openSell}
            setOpen={setOpenSell}
            data={data}
            refetch={refetch as () => void}
          />
          {/* @ts-ignore */}
          <ResellModal
            open={open}
            setOpen={setOpen}
            data={data}
            refetch={refetch as () => void}
          />
          <AuctionModel
            // @ts-ignore
            open={openAuction}
            setOpen={setOpenAuction}
            data={data}
            refetch={refetch}
          />
          {!hideStake && (
            <StakeModel
              stakeSettings={stakeSettings}
              open={stakeOpen}
              setOpen={setStakeOpen}
              data={data}
            />
          )}
        </div>
      )}
    </>
  );
};

export default NftDetailPage;
