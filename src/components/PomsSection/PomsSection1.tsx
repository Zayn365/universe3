import React from "react";

const PomsSection1 = () => {
  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full mt-8">
        <img
          src="/Image/caa3a065d1663.png"
          alt="Capsule"
          className=" w-[60%] max-md:ml-[80px] md:ml-[120px]"
        />
        <div className="p-4 rounded-md shadow-lg mt-48 w-full max-md:max-w-[70%] max-w-[60%] max-md:ml-[160px] md:ml-[270px] bg-gradient-to-br from-[#FF954C] to-[#FFDC59] dark:from-[#FF954C] dark:to-[#FFDC59] -translate-x-1/2 -translate-y-1/2 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Through sponsorship and research,
          </h2>
          <p className="text-lg mb-8">
            Universe3 supports numerous Users to treat and live healthy.
          </p>
        </div>
      </div>
      <img
        src="/Image/DoctorPuppy.png"
        alt="A cute Pomeranian"
        className="w-[60%] mt-[100px] h-full object-cover"
      />
    </div>
  );
};

export default PomsSection1;
