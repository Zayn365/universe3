"use client";
import { ReactNode, useEffect, useState } from "react";
import authorBanner from "@/images/nfts/authorBanner.png";
import NcImage from "@/shared/NcImage/NcImage";
import { nftsImgs } from "@/contains/fakeData";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Route } from "next";
import axios from "axios";
import FollowButton from "@/components/FollowButton";
import Cookies from "js-cookie";
import { User } from "@/types/User";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const Layout = ({ children }: { children: ReactNode }) => {
  const [user] = useState<User | null>(null);
  const params = useSearchParams();
  const pathname = usePathname();
  const userId = Cookies.get("userId");

  // useEffect(() => {
  //   axios
  //     .get(`${apiBaseUrl}/user/get/${params.get("id")}`)
  //     .then((response) => {
  //       console.log(response.data.result);
  //       setUser(response.data.result[0]);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [params.get("id")]);
  if (!user) return null;
  let navs: { name: string; href: Route; id?: string }[] = [
    {
      name: "Collectibles",
      href: "/user-profile",
    },
    {
      name: "Created",
      href: "/user-profile/created",
    },
    {
      name: "Liked",
      href: "/user-profile/liked",
    },
    {
      name: "Following",
      href: "/user-profile/following",
    },
    {
      name: "Followers",
      href: "/user-profile/followers",
    },
  ];

  return (
    <div className={`nc-UserProfilePage `}>
      {/* HEADER */}
      <div className="w-full">
        <div className="relative w-full h-40 md:h-60 2xl:h-72">
          <NcImage
            containerClassName="absolute inset-0"
            src={authorBanner}
            className="object-cover"
            fill
            sizes="100vw"
          />
        </div>
        <div className="container -mt-10 lg:-mt-16">
          <div className="relative bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 p-5 lg:p-8 rounded-3xl md:rounded-[40px] shadow-xl flex flex-col md:flex-row">
            <div className="w-32 lg:w-44 flex-shrink-0 mt-12 sm:mt-0">
              <NcImage
                src={!user?.img ? nftsImgs[2] : user?.img}
                containerClassName="aspect-w-1 aspect-h-1 rounded-3xl overflow-hidden z-0 relative"
                fill
                sizes="200px"
              />
            </div>
            <div className="pt-5 md:pt-1 md:ml-6 xl:ml-14 flex-grow">
              <div className="max-w-screen-sm ">
                <h2 className="inline-flex items-center text-2xl sm:text-3xl lg:text-4xl font-semibold">
                  <span>{user.name}</span>
                  {/* <VerifyIcon
                    className="ml-2"
                    iconClass="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8"
                  /> */}
                </h2>
                <div className="flex items-center text-sm font-medium space-x-2.5 mt-2.5 text-green-600 cursor-pointer">
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {user.email}
                  </span>
                  {/* <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path
                      d="M18.05 9.19992L17.2333 12.6833C16.5333 15.6916 15.15 16.9083 12.55 16.6583C12.1333 16.6249 11.6833 16.5499 11.2 16.4333L9.79999 16.0999C6.32499 15.2749 5.24999 13.5583 6.06665 10.0749L6.88332 6.58326C7.04999 5.87492 7.24999 5.25826 7.49999 4.74992C8.47499 2.73326 10.1333 2.19159 12.9167 2.84993L14.3083 3.17493C17.8 3.99159 18.8667 5.71659 18.05 9.19992Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.5498 16.6583C12.0331 17.0083 11.3831 17.3 10.5915 17.5583L9.2748 17.9917C5.96646 19.0583 4.2248 18.1667 3.1498 14.8583L2.08313 11.5667C1.01646 8.25833 1.8998 6.50833 5.20813 5.44167L6.5248 5.00833C6.86646 4.9 7.19146 4.80833 7.4998 4.75C7.2498 5.25833 7.0498 5.875 6.88313 6.58333L6.06646 10.075C5.2498 13.5583 6.3248 15.275 9.7998 16.1L11.1998 16.4333C11.6831 16.55 12.1331 16.625 12.5498 16.6583Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg> */}
                </div>

                <span className="block mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {user.contact_details}
                </span>
              </div>
              <div className="mt-4 ">
                {/* <SocialsList itemClass="block w-7 h-7" /> */}
              </div>
            </div>
            <div className="absolute md:static left-5 top-4 sm:left-auto sm:top-5 sm:right-5 flex flex-row-reverse justify-end">
              {/* <NftMoreDropdown
                actions={[
                  {
                    id: "report",
                    name: "Report abuse",
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
                `,
                  },
                ]}
                containerClassName="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:bg-neutral-800 cursor-pointer"
              /> */}
              {/* <ButtonDropDownShare
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:bg-neutral-800 cursor-pointer mx-2"
                panelMenusClass="origin-top-right !-right-5 !w-40 sm:!w-52"
              /> */}

              {user ? (
                <>
                  {user?.id !== Number(params.get("userId")) ? (
                    <></>
                  ) : (
                    <>
                      <FollowButton
                        followerId={userId}
                        followingId={params.get("id") as string}
                        fontSize="text-sm md:text-base font-medium"
                        sizeClass="px-4 py-1 md:py-2.5 h-8 md:!h-10 sm:px-6 lg:px-8"
                      />
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ====================== END HEADER ====================== */}

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <main>
          <div className="flex flex-col lg:flex-row justify-between ">
            <div className="flex space-x-0 sm:space-x-1.5 overflow-x-auto ">
              {navs.map((item, index) => {
                const active = item.href === pathname;
                return (
                  <Link
                    key={index}
                    className={`flex-shrink-0 block font-medium px-4 py-2 text-sm sm:px-6 sm:py-2.5 capitalize rounded-full focus:outline-none ${
                      active
                        ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900"
                        : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100/70 dark:hover:bg-neutral-800"
                    } `}
                    href={{
                      pathname: item.href,
                      query: {
                        id: params.get("id"),
                      },
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            {/* <div className="mt-5 lg:mt-0 flex items-end justify-end">
              <ArchiveFilterListBox />
            </div> */}
          </div>

          {/*  */}
          {children}
        </main>

        {/* === SECTION 5 === */}
        {/* <div className="relative py-16 lg:py-28">
          <BackgroundSection />
          <SectionGridAuthorBox data={Array.from("11111111")} boxCard="box4" />
        </div> */}

        {/* SUBCRIBES */}
        {/* <SectionBecomeAnAuthor /> */}
      </div>
    </div>
  );
};

export default Layout;
