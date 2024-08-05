import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useAuth() {
  const router = useRouter();
  const token = Cookies.get("wallet");
  useEffect(() => {
    if (!token) {
      router.push("/connect-wallet");
    }
  }, [token]);
}
