import axios from "axios";
  
const axiosInstance = axios.create({
  // baseURL: "https://128.199.237.132.traefik.me/",
  baseURL: "https://api.pomerznft.com",

  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    cookie: typeof document !== "undefined" ? document.cookie : "",
    Cookie: typeof document !== "undefined" ? document.cookie : "",
  },
});

export default axiosInstance;
