import React from "react";
import CardNFT from "@/components/CardNFT";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import HeaderFilterSection from "@/components/HeaderFilterSection";

const SectionGridFeatureNFT = () => {
  return (
    <div className="nc-SectionGridFeatureNFT relative">
      <HeaderFilterSection />
      <div
        className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}
      >
        {Array.from("11111111").map((_, index) => (
          <CardNFT isProfile={false} key={index} />
        ))}
      </div>
      <div className="flex mt-16 justify-center items-center">
        <ButtonSecondary loading>Show me more</ButtonSecondary>
      </div>
    </div>
  );
};

export default SectionGridFeatureNFT;
