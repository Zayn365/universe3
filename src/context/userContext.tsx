"use client";
import { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
import { toast } from "sonner";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

interface User {
  // id: number;
  wallet: string;
  // img: string;
  // address: string;
  // country: string;
  // created_at: string;
  // role: any;
}

interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  types: any;
  setType: any;
}

declare let window: any;


export const UserContext = createContext<UserContextProps | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [types, setType] = useState<any>({
    type: "",
    status: false,
  });
  // const token = Cookies.get("loginToken");
  const [loading, setLoading] = useState(true);
  // const cookieData = Cookies.get("User");
  // let jsonObject;
  // let decodedString;
  // if (cookieData && typeof cookieData === "string") {
  //   decodedString = decodeURIComponent(cookieData);
  //   jsonObject = JSON.parse(decodedString);
  // } else {
  //   console.error("cookieData is not a valid JSON string");
  // }
  const [user, setUser] = useState<User>({ wallet: Cookies.get("wallet") || "" });
  // const fetchUser = async () => {
  //   if (token) {
  //     await axios
  //       .get(`${apiBaseUrl}/user/getAll`, {
  //         headers: {
  //           Authorization: token,
  //         },
  //       })
  //       .then((response) => {
  //         setUser({
  //           id: response.data.id,
  //           name: response.data.name,
  //           email: response.data.email,
  //           bio: response.data?.bio,
  //           website: response.data?.website,
  //           facebook: response.data?.facebook,
  //           twitter: response.data?.twitter,
  //           telegram: response.data?.telegram,
  //           imageUrl: response.data?.image_url,
  //           imageName: response.data?.image_name,
  //         });
  //         setLoading(false);
  //       });
  //   }
  // };

  // useEffect(() => {
  //   fetchUser();
  // }, [token]);

  // const { isLoading } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: async () => {
  //     if (token) {
  //       const { data } = await axios.get(`${apiBaseUrl}/user/checkUser`);
  //       // setUser({
  //       //   id: data.id,
  //       //   name: data.name,
  //       //   email: data.email,
  //       //   bio: data?.bio,
  //       //   website: data?.website,
  //       //   facebook: data?.facebook,
  //       //   twitter: data?.twitter,
  //       //   telegram: data?.telegram,
  //       //   imageUrl: data?.image_url,
  //       //   imageName: data?.image_name,
  //       // });
  //       setLoading(false);
  //       return data;
  //     }
  //     return {};
  //   },
  // });

  // const getWalletFunction = () => {
  //   if (typeof window !== "undefined" && window.ethereum) {
  //     window.ethereum
  //       .request({ method: "eth_requestAccounts" })
  //       .then((res: string[]) => {
  //         const wallet = res.length > 0 ? String(res[0]) : null;
  //         if (wallet) {
  //           Cookies.set("wallet", wallet, {
  //             expires: 1 / 24,
  //           });
  //           // ...user,
  //           setUser({
  //             wallet: wallet,
  //           });
  //           toast.success("Wallet connected");
  //         }
  //       })
  //       .catch((err: Error) => {
  //         console.log(err);
  //       });
  //   } else {
  //     toast.error("Please install metamask extension");
  //   }
  // };
  useEffect(() => {
    // if (Cookies.get("wallet")) {
    //   getWalletFunction();
    // }

    setTimeout(() => {
      setLoading(false)
    }, 1000);

  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, types, setType }}>
      {loading ? <Loading /> : children}
    </UserContext.Provider>
  );
}
