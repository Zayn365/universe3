import CardNFT from "@/components/CardNFT";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const Pagination = ({ filteredNfts }: any) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  // Filter data to only include items with sale, stake, or auction status
  const filteredData = filteredNfts?.filter(
    (item: any) =>
      item?.listingid &&
      (item.status?.sale || item.status?.stake || item.status?.auction)
  );

  // Update currentPage and reset to 1 if filteredData changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredNfts]);

  const nextHandle = () => {
    setCurrentPage(currentPage + 1);
  };

  const preHandle = () => {
    setCurrentPage(currentPage - 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled =
    currentPage >=
    Math.ceil(
      filteredData.filter((val: any) => val.status.stake === false).length /
        itemsPerPage
    );
  console.log(filteredData?.length, "CHECK YO");
  return (
    <div>
      <div className="flex flex-wrap md:gap-x-14 gap-x-10 lg:gap-x-16 gap-y-4 mt-8 lg:mt-10">
        {filteredData.length >= 0 ? (
          filteredData
            .filter((val: any) => val.status.stake === false)
            .slice(startIndex, endIndex)
            .map((nft: any) => (
              <CardNFT
                imageClass="!w-[276px] !h-[276px]"
                key={nft?.id}
                id={nft?.id}
                img={nft?.img}
                name={nft?.name}
                fix_price={nft?.fix_price ? nft?.fix_price?.price : ""}
                currentOwner={
                  nft?.secondary_owner?.buyer
                    ? nft?.secondary_owner?.buyer.wallet
                    : ""
                }
                onSale={nft?.status?.sale && nft?.listingid}
                onAuction={nft?.status?.auction}
                onStake={nft?.status?.stake}
                primaryOwner={nft?.primary_owner}
                owner_wallet={nft?.primary_owner}
                token_id={nft.token_id}
                collection_address={nft.collection_address}
                data={nft}
                isProfile={false}
              />
            ))
        ) : (
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            No Data Found According To Your Search
          </span>
        )}
      </div>

      <div className="w-full bg-transparent flex gap-x-2 justify-end mt-4">
        <button
          className={`py-2 transition-all duration-500 flex justify-center items-center px-5 md:px-4 rounded-md text-[10px] md:text-lg ${
            isPrevDisabled
              ? "text-neutral-400 dark:text-neutral-400 bg-transparent border border-neutral-300 dark:border-neutral-600 cursor-not-allowed"
              : "dark:text-white bg-blue-500 text-white"
          }`}
          onClick={preHandle}
          disabled={isPrevDisabled}
        >
          Previous
        </button>
        <button
          className={`py-2 transition-all duration-500 flex justify-center items-center px-5 md:px-4 rounded-md text-[10px] md:text-lg ${
            isNextDisabled
              ? "text-neutral-400 dark:text-neutral-400 bg-transparent border border-neutral-300 dark:border-neutral-600 cursor-not-allowed"
              : "dark:text-white bg-blue-500 text-white"
          }`}
          onClick={nextHandle}
          disabled={isNextDisabled}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
