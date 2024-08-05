"use client";
import axios from "axios";
import { Menu, Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { nftsImgs } from "@/contains/fakeData";
import { useRouter } from "next/navigation";
import { Route } from "next";
import Link from "next/link";
import Cookies from "js-cookie";
import { useUserContext } from "@/hooks/useUserContext";
import Avatar from "@/shared/Avatar/Avatar";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

export default function AvatarDropdown() {
  const { user, setUser } = useUserContext();
  const loginRouter = useRouter();
  const handleSubmit = async () => {
    const token = Cookies.get("loginToken");
    await axios
      .delete(`${apiBaseUrl}/user/delete-user/${user.wallet}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        Cookies.remove("loginToken");
        Cookies.remove("userId");
        console.log(res.data);
        loginRouter.push("/login" as Route);
      })
      .catch((err) => console.error(err));
  };
  const pushLogin = async () => {
    // Cookies.remove("loginToken");
    // Cookies.remove("userId");
    Cookies.remove("wallet");

    // setUser({
    //   id: null,
    //   name: null,
    //   email: null,
    // });
    setUser({ wallet: "" });
    loginRouter.push("/");
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <Avatar
            // imgUrl={user.img as string}
            // imgUrl={user && user?.img ? user?.img : nftsImgs[2]}
            imgUrl={nftsImgs[2]}
            sizeClass="w-8 h-8 sm:w-9 sm:h-9"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="py-3 px-4">
            {/* <Menu.Item> */}

            <div className="flex items-center space-x-3">
              {/* <Menu.Item> */}
              <Avatar
                // imgUrl={user && (user?.img as string)}
                // imgUrl={user && user?.img ? user?.img : nftsImgs[2]}
                imgUrl={nftsImgs[2]}
                sizeClass="w-12 h-12"
              />

              <div className="flex-grow">
                <h4 className="font-semibold">{`${user?.wallet.substring(
                  0,
                  6
                )}....${user?.wallet.substring(user?.wallet?.length - 6)}`}</h4>
                {/* <p className="text-xs mt-0.5">{user.email}</p> */}
              </div>
              {/* </Menu.Item> */}
            </div>
            {/* </Menu.Item> */}

            {/* <Menu.Item> */}
              {/* <div className="w-full mt-4 border-b border-neutral-200 dark:border-neutral-700" /> */}
            {/* </Menu.Item> */}

            {/* <Menu.Item>
              {({ active }) => (
                     <Link
                     href={"/nft"}
                     className="flex items-center p-2 mt-2 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                   >
                     <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                       <svg
                         width="24"
                         height="24"
                         viewBox="0 0 24 24"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg"
                       >
                         <path
                           d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                           stroke="currentColor"
                           strokeWidth="1.5"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                         />
                         <path
                           d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                           stroke="currentColor"
                           strokeWidth="1.5"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                         />
                         <path
                           d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
                           stroke="currentColor"
                           strokeWidth="1.5"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                         />
                       </svg>
                     </div>
                     <div className="ml-2">
                       <p className="text-sm font-medium ">{"My Items"}</p>
                     </div>
                   </Link>
              )}
            </Menu.Item> */}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
