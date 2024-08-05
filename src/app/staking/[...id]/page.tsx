"use client";

export interface StakingDetails {
  id: number;
  stakedate: string;
  valuedate: string;
  type: "fixed" | "variable"; // Assuming "fixed" is one of the possible types
  created_by: number;
  creator_wallet: string;
  staked_user: string;
  duration: string;
  interestperiod: "daily" | "weekly" | "monthly" | "yearly"; // Assuming these are possible values
  interestenddate: string;
  minimummaturityperiod: string;
  minimumamount: string;
  maximumamount: string;
  autostaking: boolean;
  apr: string;
  collection_id: number;
  nft_id: number;
}

import axiosInstance from "@/api/axiosInstance";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useWeb3Helper } from "@/helpers/web3HelperFunctions";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Cookies from "js-cookie";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const StakingPage = () => {
  const { ClaimReward } = useWeb3Helper();
  const router = useRouter();
  const { id } = useParams();
  const wallet = Cookies.get("wallet");
  const [lockAmount, setLockAmount] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [stakeData, setStakeData] = useState<StakingDetails | null>(null);
  const [mainStakeData, setMainStakeData] = useState<any>();
  const [nftData, setNftData] = useState<any>();
  const { isLoading, refetch } = useQuery({
    queryKey: ["claimReward"],
    queryFn: async () => {
      const data = await axiosInstance
        .get(`/nfts/read/${id}`)
        .then((res: any) => {
          return res.data.data;
        });
      setNftData(data);
    },
  });

  const getStakeData = async (stakeId: string) => {
    const stakeData = await axios
      .get(`${apiBaseUrl}/stake/getByNft/${stakeId}`)
      .then((r) => r.data.data);
    setStakeData(stakeData);
  };
  const getMainStakeData = async () => {
    const stakeData = await axiosInstance.get("/stake-rules").then((r) => {
      console.log(r.data.data);
      return r.data.data;
    });
    const filteredDAta = stakeData.filter((r: any) => r.nft_id === 0);
    // .sort((r: any, d: any) => d.id > r.id);
    setMainStakeData(filteredDAta[0]);
  };

  useEffect(() => {
    const stakeId = Array.isArray(id) ? id[0] : id;
    if (stakeId && stakeData === null) {
      getStakeData(stakeId);
      getMainStakeData();
    }
  }, [id]);
  console.log(mainStakeData, stakeData);
  const formatDate = (date?: string | number | Date) => {
    if (!date) return "";

    return new Date(date).toLocaleString();
  };

  const handleLockAmountChange = (e: any) => {
    setLockAmount(e.target.value);
  };

  const handleTermsChange = (e: any) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Lock Amount:", lockAmount);
    console.log("Terms Accepted:", termsAccepted);
  };

  return (
    <div className="h-screen max-sm:mb-[840px] xl:mb-96">
      <div
        className="h-[30vw] lg:h-[10vw]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1620207418302-439b387441b0?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto p-4 pt-16">
          <div className="shadow-md bg-[linear-gradient(rgba(242,240,220,0.565)_10%,white_20%)] backdrop-blur-md rounded-lg px-4 py-6 lg:px-8 lg:pt-6 lg:pb-8 mb-4 dark:bg-[linear-gradient(to_bottom,#11111190_10%,black_20%)] flex flex-col">
            <h1 className="flex gap-2  mt-8 mb-4">
              <Image
                src="/backarrow-white.svg"
                alt="BackArrow"
                className="hidden cursor-pointer dark:block"
                width={20}
                height={20}
                onClick={() => {
                  router.back();
                }}
              />
              <Image
                src="/backarrow-black.svg"
                className="dark:hidden block"
                alt="BackArrow"
                width={20}
                height={20}
              />
              Back
            </h1>
            <h2 className="text-2xl lg:text-4xl font-bold mb-4">Staking</h2>
            <div className="flex flex-col lg:flex-row gap-8">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="px-4 py-2 w-full">
                      <h1 className="flex gap-2 items-center">
                        <Image
                          width={30}
                          height={30}
                          alt="eth"
                          src="https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/DPYBKVZG55EWFHIK2TVT3HTH7Y.png"
                        />
                        POLYGON
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 w-11/12">Type</td>
                    <td className="px-4 py-2 dark:text-yellow-300 text-right">
                      {/* @ts-ignore */}
                      {stakeData ? stakeData?.type : mainStakeData?.type}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Duration</td>
                    <td className="px-2 block py-2 border-2 border-purple-700 rounded-md text-right">
                      {/* @ts-ignore */}
                      {stakeData
                        ? stakeData?.duration
                        : mainStakeData?.duration}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Stake Date</td>
                    <td className="px-4 py-2 text-right">
                      {/* @ts-ignore */}
                      {formatDate(stakeData ? stakeData?.stakedate : "")}
                    </td>
                  </tr>
                  {/* <tr>
                    <td className="px-4 py-2">Value Date</td>
                    <td className="px-4 py-2 text-right">
                      {formatDate(
                        stakeData
                          ? stakeData?.valuedate
                          : mainStakeData?.duration
                      )}
                    </td>
                  </tr> */}
                  {/* <tr>
                    <td className="px-4 py-2">Interest Period</td>
                    <td className="px-4 py-2 text-right">
                      {stakeData
                        ? stakeData?.interestperiod
                        : mainStakeData?.interestperiod}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Interest End Date</td>
                    <td className="px-4 py-2 text-right">
                      {formatDate(
                        stakeData
                          ? stakeData?.interestenddate
                          : mainStakeData?.interestenddate
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Minimum Maturity Period</td>
                    <td className="px-4 py-2 text-right">
                      {stakeData
                        ? stakeData?.minimummaturityperiod
                        : mainStakeData?.minimummaturityperiod}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Minimum Amount</td>
                    <td className="px-4 py-2 text-right">
                      {stakeData
                        ? stakeData?.minimumamount
                        : mainStakeData?.minimumamount}
                    </td>
                  </tr> */}
                  <tr>
                    <td className="px-4 py-2">Amount</td>
                    <td className="px-4 py-2 text-right">
                      {stakeData
                        ? stakeData?.maximumamount
                        : mainStakeData?.maximumamount}
                    </td>
                  </tr>
                  {/* <tr>
                    <td className="px-4 py-2">Estimated Interest</td>
                  </tr> */}
                </tbody>
              </table>
              {/* <form onSubmit={handleSubmit} className="w-full lg:w-1/2">
                                <div className="mb-4">
                                    <label
                                        htmlFor="lockAmount"
                                        className="block text-sm font-bold mb-2"
                                    >
                                        Lock Amount
                                    </label>
                                    <input
                                        type="number"
                                        id="lockAmount"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={lockAmount}
                                        onChange={handleLockAmountChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="terms"
                                        className="block text-sm font-bold mb-2"
                                    >
                                        Terms and Conditions
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="mr-2"
                                            checked={termsAccepted}
                                            onChange={handleTermsChange}
                                        />
                                        <label htmlFor="terms" className="text-sm">
                                            I agree to the terms and conditions
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!termsAccepted}
                                    className={`w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline ${!termsAccepted
                                        ? "bg-gray-500"
                                        : "bg-orange-500 hover:bg-orange-700"
                                        }`}
                                >
                                    Confirm
                                </button>
                            </form> */}
            </div>
            <div className="flex flex-col mt-8 mb-4 w-full">
              {/* <span className="text-2xl mr-2 font-bold">
                Enable Auto Staking
              </span>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    stakeData
                      ? stakeData?.autostaking
                      : mainStakeData?.autostaking
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-[10px] mr-2">
                Auto Stacking is a feature that let's you earn stacking rewards
                automatically without any manual effort.
              </span> */}
              <div className="mt-8 mr-2 w-full lg:w-1/2 justify-between flex">
                <h1 className="font-bold">Est. APR</h1>
                <h1 className="text-green-600">
                  {/* @ts-ignore */}
                  {stakeData ? stakeData?.apr : mainStakeData?.apr}
                </h1>
              </div>
              <div className="mt-8 mr-2 w-full lg:w-1/2 justify-between flex">
                <h1 className="font-bold">Claim Reward</h1>
                <ButtonPrimary
                  // disabled={isLoading}
                  loading={
                    isLoading ||
                    !wallet ||
                    wallet !== nftData.secondary_owner.buyer.wallet
                  }
                  onClick={() => ClaimReward(nftData, refetch)}
                >
                  {/* @ts-ignore */}
                  CLAIM REWARD
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
