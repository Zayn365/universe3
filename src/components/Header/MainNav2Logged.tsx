"use client";
import { FC, useEffect, useState } from "react";
import Logo from "@/shared/Logo/Logo";
import MenuBar from "@/shared/MenuBar/MenuBar";
import SwitchDarkMode from "@/shared/SwitchDarkMode/SwitchDarkMode";
import AvatarDropdown from "./AvatarDropdown";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Navigation from "@/shared/Navigation/Navigation";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { Route } from "next";
import Avatar from "@/shared/Avatar/Avatar";
import ImageAvatar from "../../images/avatars/ImageAvatar.png";
import { useUserContext } from "@/hooks/useUserContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Image from "next/image";
import { useSDK } from "@metamask/sdk-react";
declare let window: any;

export interface MainNav2LoggedProps {}

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {
  const [openList, setOpenList] = useState(false);
  const { sdk } = useSDK();
  const toggleOpenList = () => {
    setOpenList(!openList);
  };

  const userContext = useUserContext();
  const router = useRouter();

  const checkUser = async () => {
    const token = Cookies.get("loginToken");
    const wallet = Cookies.get("wallet");

    if (!token) {
      router.push("/signup");
      return;
    }
    if (!wallet) {
      router.push("/connect-wallet");
      toast.error("Connect wallet first");
      return;
    }
    router.push("/author");
  };

  const removeWalletFunction = async () => {
    await sdk?.terminate();
    userContext.setUser({ wallet: "" })
    Cookies.remove("wallet");
    toast.success("Wallet disconnected");
  };
  return (
    <div
      className={`nc-MainNav2Logged relative z-10 bg-transparent backdrop-blur-xl`}
    >
      <div className="container">
        <div className="h-20 flex justify-between space-x-4 xl:space-x-8">
          <div className="self-center flex justify-start flex-grow space-x-3 sm:space-x-8 lg:space-x-10">
            <Logo />
            {/* <div className="hidden sm:block flex-grow max-w-xs">
              <form action="" method="POST" className="relative">
                <input
                  type="search"
                  placeholder="Search items"
                  className="pr-10 w-full h-[42px] pl-4 py-3"
                />
                <span className="absolute top-1/2 -translate-y-1/2 right-3 text-neutral-500">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 22L20 20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input type="submit" hidden value="" />
              </form>
            </div> */}
          </div>
          <div className="flex-shrink-0 hidden justify-end text-neutral-700 dark:text-neutral-100 space-x-1 max-md:flex">
            <Image
              onClick={toggleOpenList}
              src="/List-White.svg"
              alt="List Icon"
              width={30}
              height={30}
              className="hidden dark:flex"
            />
            <Image
              onClick={toggleOpenList}
              src="/List-Black.svg"
              alt="List Icon"
              width={30}
              height={30}
              className="dark:hidden flex"
            />
            {openList && (
              <div className="flex-shrink-0 flex justify-end text-neutral-700 dark:text-neutral-100 space-x-1 md:flex">
                <ul className="bg-gray-800 shadow-md rounded-lg p-4 items-center flex flex-col absolute right-4 mt-14">
                  {!userContext?.user?.wallet && (
                    <li className="py-2">
                      <SwitchDarkMode />
                    </li>
                  )}
                  {!Cookies.get("wallet") && (
                    <li className="py-2">
                      <ButtonSecondary
                        className="!bg-yellow-400 !text-black hover:!bg-yellow-200"
                        href="/connect-wallet"
                        sizeClass="px-4 py-2 sm:px-5 block"
                      >
                        Connect Wallet
                      </ButtonSecondary>
                    </li>
                  )}
                  {/* <li className="py-2">
                    <ButtonSecondary
                      className="block"
                      href={"/login" as Route}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Sign In
                    </ButtonSecondary>
                  </li> */}
                  {userContext?.user?.wallet ? (
                    <>
                      <li className="py-2">
                        <ButtonPrimary
                          href="/author?type=all"
                          className="block"
                          sizeClass="px-4 py-2 sm:px-5"
                        >
                          Profile
                        </ButtonPrimary>
                      </li>
                      <li className="py-2">
                        <button
                          onClick={() => {
                            // router.push("/");
                            // @ts-ignore
                            userContext?.setUser();
                            removeWalletFunction();
                            Cookies.remove("User");
                          }}
                          className="relative h-auto items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium px-4 py-2 sm:px-5 disabled:bg-opacity-70 bg-red-500 hover:bg-red-300 text-neutral-50 self-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 block"
                        >
                          LogOut
                        </button>
                      </li>
                    </>
                  ) : (
                    <li className="py-2">
                      <Avatar
                        imgUrl={ImageAvatar}
                        sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                      />
                    </li>
                  )}
                  {userContext?.user?.wallet && <AvatarDropdown />}
                  <MenuBar />
                </ul>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 flex justify-end text-neutral-700 dark:text-neutral-100 space-x-1 max-md:hidden">
            <div
              className={`${
                userContext?.user?.wallet ? "hidden" : "flex"
              } space-x-2`}
            >
              <Navigation />
              <div className="self-center hidden sm:block h-6 border-l border-neutral-300 dark:border-neutral-6000"></div>
              <div className="flex">
                <SwitchDarkMode />
                {/* <NotifyDropdown /> */}
              </div>
              <div></div>
              {/* <ButtonPrimary
                onClick={checkUser}
                href="/author?type=all"
                className="self-center"
                sizeClass="px-4 py-2 sm:px-5"
              >
                Profile
              </ButtonPrimary> */}
              {/* {Cookies.get("wallet") ? (
                <>
                  <ButtonSecondary
                    className="self-center !bg-blue-400 hover:!bg-blue-300"
                    onClick={removeWalletFunction}
                    sizeClass="px-4 py-2 sm:px-5"
                  >
                    Connected
                  </ButtonSecondary>
                </>
              ) : (
                <> */}
              <ButtonSecondary
                className="self-center !bg-yellow-400 !text-black hover:!bg-yellow-200"
                // onClick={getWalletFunction}
                href="/connect-wallet"
                sizeClass="px-4 py-2 sm:px-5"
              >
                Connect Wallet
              </ButtonSecondary>
              {/* </>
              )} */}
              <>
                {/* <ButtonSecondary
                  className="self-center"
                  href={"/login" as Route}
                  sizeClass="px-4 py-2 sm:px-5"
                >
                  Sign In
                </ButtonSecondary> */}
              </>
              {userContext?.user?.wallet ? (
                <>
                  <AvatarDropdown />
                </>
              ) : (
                <div className="self-center">
                  <Avatar
                    imgUrl={ImageAvatar}
                    sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                  />
                </div>
              )}
            </div>
            <div
              className={`items-center space-x-3 ${
                userContext?.user?.wallet ? "flex" : "hidden"
              }`}
            >
              <SwitchDarkMode />

              {/* <NotifyDropdown /> */}
              <ButtonPrimary
                href="/author?type=all"
                className="self-center"
                sizeClass="px-4 py-2 sm:px-5"
              >
                Profile
              </ButtonPrimary>
              {/*   <button
                onClick={() => {
                  router.push("/");
                  // @ts-ignore
                  userContext?.setUser();
                  Cookies.remove("wallet");
                }}
                className="relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium px-4 py-2 sm:px-5 disabled:bg-opacity-70 bg-red-500 hover:bg-red-300 text-neutral-50 self-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0"
              >
                LogOut
              </button> */}

              <ButtonPrimary
                // className="self-center !bg-blue-400 hover:!bg-blue-300"
                onClick={removeWalletFunction}
                sizeClass="px-4 py-2 sm:px-5"
              >
                Connected
              </ButtonPrimary>
              {userContext?.user?.wallet ? (
                <>
                  <AvatarDropdown />
                </>
              ) : (
                <div className="self-center">
                  <Avatar
                    imgUrl={ImageAvatar}
                    sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                  />
                </div>
              )}

              <MenuBar />
              {/* <button className="bg-red-600">LogOut</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2Logged;
