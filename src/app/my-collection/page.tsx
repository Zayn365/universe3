"use client";
import CollectionCard from "@/components/CollectionCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useState } from "react";
import Loading from "../loading";
import { useAuth } from "@/hooks/useAuth";
import { Collection } from "@/types/Collection";
import { nftsImgs } from "@/contains/fakeData";
import { useUserContext } from "@/hooks/useUserContext";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const MyCollectionPage = ({}) => {
  useAuth();
  // const userId = Cookies.get("userId");
  // const token = Cookies.get("loginToken");
  const { user } = useUserContext();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [row, setRows] = useState<number | null>(null);
  const { isLoading } = useQuery({
    queryKey: ["collection"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiBaseUrl}/collections/getAll`, {
        // headers: { Authorization: `Bearer ${token}` },
      });

      const collection = data.filter(
        (d: any) => d.collection_address === user.wallet
      );
      setRows(collection.length);
      setCollections(collection as Collection[]);
      return data;
    },
    cacheTime: Infinity,
  });

  if (isLoading)
    return (
      <>
        <Loading />
      </>
    );

  return (
    <div className={`nc-MyCollectionPage`}>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {row == 0 ? (
            <>
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:tex  t-4xl font-semibold">
                  No NFT`s collection found
                </h2>
                <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                  Create a new NFT collection.
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  Your NFTs Collection
                </h2>
                <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                  You can see, update, disable and manage your nft collections
                  here.
                </span>
              </div>
              <div className="flex overflow-auto py-2 space-x-4 customScrollBar"></div>
              <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-10  mt-8 lg:mt-10">
                {collections.map((collection) => {
                  return (
                    <CollectionCard
                      key={collection.id}
                      imgs={collection.logo_image}
                      username={collection.name}
                      id={collection.id}
                      name={collection.name}
                      description={collection.description}
                      banner_img={collection.banner_image}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MyCollectionPage), { ssr: false });
