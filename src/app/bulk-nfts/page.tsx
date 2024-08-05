"use client";
import BulkNftCard from "@/components/NftSection/BulkNftCard";
import React from "react";

const BulkNfts = () => {
  return (
    <div>
      <header className="my-12 sm:lg:my-16 lg:my-24 max-w-5xl mx-auto space-y-8 sm:space-y-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-semibold">Bulk Images</h2>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            You can Download and Mint NFT's here.
          </span>
        </div>
      </header>
      <div className="px-20">
        <hr />
      </div>
      <BulkNftCard />
    </div>
  );
};

export default BulkNfts;
