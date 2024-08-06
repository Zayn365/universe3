"use client";
import CardNFT from "@/components/CardNFT";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { ChangeEvent, useEffect, useState } from "react";
import Loading from "../loading";
import { NftSale } from "@/types/Nft";
import lightArrow from "../../images/lightIcons/arrow.svg";
import darkArrow from "../../images/darkIcons/arrow.svg";
import lightFilter from "../../images/lightIcons/filter.svg";
import darkFilter from "../../images/darkIcons/filter.svg";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "../../components/PaginationComponent/Pagination";
import { debounce } from "lodash";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const NftForSalePage = ({}) => {
  const debouncedFunction = debounce(
    (value: string, setSearch: React.Dispatch<React.SetStateAction<string>>) => {
      setSearch(value.trim());
    },
    300
  );
  const [currentIndex, setCurrentIndex] = useState(4);
  const nextHandle = () => {
    setCurrentIndex(currentIndex + 4);
  };
  const preHandle = () => {
    setCurrentIndex(currentIndex - 4);
  };

  const [nft, setNft] = useState<NftSale[]>([]);
  const [row, setRows] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const searchParams = useSearchParams().get;
  const [search, setSearch] = useState("");
  const [prices, setPrices] = useState({
    min: "",
    max: "",
  });

  const router = useRouter();
  const min = searchParams("min");
  const max = searchParams("max");
  const handleChange = (e: any) => {
    const value = e.target.value.trim();
    debouncedFunction(value, setSearch);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsFilter(!!window.location.search);
      setIsFilterOpen(!!window.location.search);
      setPrices({
        min: min || "",
        max: max || "",
      });
    }
  }, [router]);

  async function updateParams(name: string, value: string) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    await Promise.all(
      name.split(",").map(async (n, idx) => {
        const v = value.split(",")[idx];
        v || v === "0" ? params.set(n, v) : params.delete(n);
      })
    );

    return { url, params };
  }

  const handleCategory = async (category: string) => {
    const { url, params } = await updateParams("category", category);
    router.push(`${url.pathname}?${params.toString()}`);
  };

  const handleType = async (type: string) => {
    const { url, params } = await updateParams("type", type);
    router.push(`${url.pathname}?${params.toString()}`);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrices((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSort = async (sort: string) => {
    const { url, params } = await updateParams("sort", sort);
    router.push(`${url.pathname}?${params.toString()}`);
  };

  async function updateMinMax() {
    const { url, params } = await updateParams(
      "min,max",
      `${prices.min},${prices.max}`
    );
    router.push(`${url.pathname}?${params.toString()}`);
  }

  const handleClick = (index: any) => {
    setActiveIndex(index);
  };

  const { isLoading } = useQuery({
    queryKey: ["nft"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiBaseUrl}/nfts/getAll`);
      const onSaleNfts = data.data.filter((nft: any) => nft.status);
      setNft(data.data);
      console.log(onSaleNfts, "Check");
      setRows(data.data.length);
      return onSaleNfts;
    },
  });
  if (isLoading) return <Loading />;

  if (isLoading) return <Loading />;

  const category = searchParams("category");
  const sort = searchParams("sort");
  const type = searchParams("type");
  const isCategoryFilter = category && category !== "all";
  const isMinFilter = !!min;
  const isMaxFilter = !!max;
  const isTypeFilter = type && type !== "all";
  const isSortFilter = !!sort;

  let filteredNfts = nft.filter((n: any) =>
    isFilter
      ? (isCategoryFilter ? n.category === category : true) &&
        (isMinFilter
          ? parseFloat(n?.open_auction?.price?.toString()) >= parseFloat(min) ||
            n?.fix_price?.price?.toString() >= parseFloat(min)
          : true) &&
        (isMaxFilter
          ? parseFloat(n?.open_auction?.price?.toString()) < parseFloat(max) ||
            n?.fix_price?.price?.toString() < parseFloat(max)
          : true) &&
        (isTypeFilter ? n.status[type] : true) && 
        (search.length
          ? n.name.toLowerCase().includes(search.toLowerCase())
          : true)
      : true && n?.status?.sale
  );

  if (isSortFilter) {
    filteredNfts.sort((a: any, b: any) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a?.status?.sale
            ? a.fix_price?.price - b.fix_price?.price
            : a.open_auction?.price - b.open_auction?.price;
        case "price-desc":
          return a?.status?.sale
            ? b.fix_price?.price - a.fix_price?.price
            : b.open_auction?.price - a.open_auction?.price;
        case "latest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        default:
          return 0;
      }
    });
  }
  const maxIndex = Math.min(currentIndex + 4, filteredNfts.length);
  const startIndex = Math.max(currentIndex, 0);

  return (
    <div className="nc-MyNftPage">
      <div className="container px-0 mx-6">
        <div className="my-12 sm:my-16 lg:my-24 max-w-100 mx-auto space-y-8 sm:space-y-10">
          {nft && nft.length > 0 ? (
            <>
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  Marketplace
                </h2>
                <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                  You Can Find All NFT's Here.
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  Marketplace
                </h2>
                <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                  No NFT`s are available in the Marketplace.
                </span>
              </div>
            </>
          )}
          {/* HEADING */}
          <header>
            <div className="flex justify-start">
              <div>
                <button
                  className={`py-3 transition-all duration-500 flex justify-center items-center px-5 md:px-7 ${
                    isFilterOpen ? "" : "dark:hover:bg-[#34344D]"
                  } rounded-md dark:bg-gray-800 dark:text-white text-[#545454] text-[10px] md:text-xl ${
                    isFilterOpen
                      ? "!text-white !bg-blue-500"
                      : ""
                  }`}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  {!isFilterOpen ? (
                    <>
                      <Image
                        src={lightFilter}
                        alt="lightFilter"
                        className="dark:hidden flex mx-1"
                        width={20}
                        height={20}
                      />
                      <Image
                        src={darkFilter}
                        alt="darkFilter"
                        className="dark:flex hidden mx-1"
                        width={20}
                        height={20}
                      />
                    </>
                  ) : (
                    <>
                      {isFilterOpen ? (
                        <Image
                          src={darkArrow}
                          alt="lightFilter"
                          className="dark:hidden flex mx-1"
                          width={20}
                          height={20}
                        />
                      ) : (
                        ""
                      )}
                      <Image
                        src={darkArrow}
                        alt="lightFilter"
                        className="hidden dark:flex mx-1"
                        width={20}
                        height={20}
                      />
                    </>
                  )}
                  Filter
                </button>
              </div>
              <div className="py-2 mx-6 w-full max-w-full">
              <div className="flex justify-between items-center">
                <ul className="flex justify-start text-lg">
                  <li
                    onClick={() => handleCategory("all")}
                    className={`mx-2 dark:text-white text-[#545454] text-[10px] md:text-lg hover:text-blue-500 cursor-pointer ${
                      !category || category === "all" ? "active-li" : ""
                    }`}
                  >
                    All
                  </li>
                  <li
                    onClick={() => handleCategory("art")}
                    className={`mx-2 dark:text-white text-[#545454] text-[10px] md:text-lg hover:text-blue-500 cursor-pointer ${
                      category === "art" ? "active-li" : ""
                    }`}
                  >
                    Art
                  </li>
                  <li
                    onClick={() => handleCategory("gaming")}
                    className={`mx-2 dark:text-white text-[#545454] text-[10px] md:text-lg hover:text-blue-500 cursor-pointer ${
                      category === "gaming" ? "active-li" : ""
                    }`}
                  >
                    Gaming
                  </li>
                  <li
                    onClick={() => handleCategory("music")}
                    className={`mx-2 dark:text-white text-[#545454] text-[10px] md:text-lg hover:text-blue-500 cursor-pointer ${
                      category === "music" ? "active-li" : ""
                    }`}
                  >
                    Music
                  </li>
                  <li
                    onClick={() => handleCategory("fashion")}
                    className={`mx-2 dark:text-white text-[#545454] text-[10px] md:text-lg hover:text-blue-500 cursor-pointer ${
                      category === "fashion" ? "active-li" : ""
                    }`}
                  >
                    Fashion
                  </li>
                </ul>
                <div className="search flex items-center">
                    <input
                      type="text"
                      onChange={handleChange}
                      className="flex-1 border-0 dark:border-none bg-transparent outline-none"
                      placeholder="Search"
                    />
                    <div className="dark:invert-[0.7]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 25 25"
                        width="20px"
                        height="20px"
                      >
                        <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
                      </svg>
                    </div>
                  </div>
                  </div>
                <hr className="mt-4" />
              </div>
            </div>
          </header>
          <div className="flex max-md:flex-col relative">
            {isFilterOpen && (
              <div className="w-full p-4 border-r border-neutral-200 dark:border-neutral-700 md:animate-width-expand max-md:animate-width-expand-100">
                <div className="filter-container">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Price</h3>
                    <hr className="mb-4" />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        onChange={handlePriceChange}
                        name="min"
                        defaultValue={min as string}
                        className="w-full mb-2 p-2 border dark:bg-slate-800 dark:border-neutral-600"
                      />
                      <input
                        type="number"
                        defaultValue={max as string}
                        onChange={handlePriceChange}
                        name="max"
                        placeholder="Max"
                        className="w-full mb-2 p-2 border dark:bg-slate-800 dark:border-neutral-600"
                      />
                    </div>
                    <button
                      onClick={updateMinMax}
                      className="w-full dark:bg-[#3E3E46] dark:hover:bg-[#45454D] bg-[#DADADA] hover:bg-[#D3D3D3] dark:text-white dark:hover:text-white text-[#333] hover:text-black py-2 transition-all duration-200 rounded"
                    >
                      APPLY
                    </button>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Item Type</h3>
                    <hr className="mb-4" />
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleType("all")}
                        className={`w-[30%] md:w-[45%] xl:w-[30%] p-2 dark:hover:bg-[#00A1FF] hover:bg-[#00A1FF] transition-all duration-200 rounded-md dark:bg-slate-800 bg-[#EEEEEE] hover:text-white ${
                          type === "all" ? "active-btn" : ""
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => handleType("auction")}
                        className={`w-[30%] md:w-[45%] xl:w-[30%] p-2 dark:hover:bg-[#00A1FF] hover:bg-[#00A1FF] transition-all duration-200 rounded-md dark:bg-slate-800 bg-[#EEEEEE] hover:text-white ${
                          type === "auction" ? "active-btn" : ""
                        }`}
                      >
                        Auction
                      </button>
                      <button
                        onClick={() => handleType("sale")}
                        className={`w-[30%] md:w-[45%] xl:w-[30%] p-2 dark:hover:bg-[#00A1FF] hover:bg-[#00A1FF] transition-all duration-200 rounded-md dark:bg-slate-800 bg-[#EEEEEE] hover:text-white ${
                          type === "sale" ? "active-btn" : ""
                        }`}
                      >
                        Buy Now
                      </button>
                      {/* <button
                        onClick={() => handleType("stake")}
                        className="w-full p-2 dark:bg-slate-800"
                      >
                        Stake
                      </button> */}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Sort</h3>
                    <hr className="mb-4" />
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleSort("name-asc")}
                        className={`w-[30%] md:w-[45%] xl:w-[30%] p-2 dark:hover:bg-[#00A1FF] hover:bg-[#00A1FF] transition-all duration-200 rounded-md dark:bg-slate-800 bg-[#EEEEEE] hover:text-white ${
                          sort === "name-asc" ? "active-btn" : ""
                        }`}
                      >
                        Name ASC
                      </button>
                      <button
                        onClick={() => handleSort("name-desc")}
                        className={`w-[30%] md:w-[45%] xl:w-[30%] p-2 dark:hover:bg-[#00A1FF] hover:bg-[#00A1FF] transition-all duration-200 rounded-md dark:bg-slate-800 text-[15px] bg-[#EEEEEE] hover:text-white ${
                          sort === "name-desc" ? "active-btn" : ""
                        }`}
                      >
                        Name DESC
                      </button>
                      <button
                        onClick={() => handleSort("price-asc")}
                        className={`w-[30%] md:w-[45%] xl:w-[30%] p-2 dark:hover:bg-[#00A1FF] hover:bg-[#00A1FF] transition-all duration-200 rounded-md dark:bg-slate-800 bg-[#EEEEEE] hover:text-white ${
                          sort === "price-asc" ? "active-btn" : ""
                        }`}
                      >
                        Price ASC
                      </button>
                      <button
                        onClick={() => handleSort("price-desc")}
                        className={`w-[30%] md:w-[45%] xl:w-[30%] p-2 dark:hover:bg-[#00A1FF] hover:bg-[#00A1FF] transition-all duration-200 rounded-md dark:bg-slate-800 bg-[#EEEEEE] hover:text-white ${
                          sort === "price-desc" ? "active-btn" : ""
                        }`}
                      >
                        Price DESC
                      </button>
                      <button
                        onClick={() => handleSort("latest")}
                        className={`w-[30%] md:w-[45%] xl:w-[30%] p-2 dark:hover:bg-[#00A1FF] hover:bg-[#00A1FF] transition-all duration-200 rounded-md dark:bg-slate-800 bg-[#EEEEEE] hover:text-white ${
                          sort === "latest" ? "active-btn" : ""
                        }`}
                      >
                        Latest
                      </button>
                      <button
                        onClick={() => handleSort("oldest")}
                        className={`w-[30%] md:w-[45%] xl:w-[30%] p-2 dark:hover:bg-[#00A1FF] hover:bg-[#00A1FF] transition-all duration-200 rounded-md dark:bg-slate-800 bg-[#EEEEEE] hover:text-white ${
                          sort === "oldest" ? "active-btn" : ""
                        }`}
                      >
                        Oldest
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`max-md:w-full p-4 ${
                isFilterOpen ? "md:w-[70%]" : "md:w-full"
              }`}
            >
              <Pagination filteredNfts={filteredNfts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(NftForSalePage), { ssr: false });
