import { Poppins } from "next/font/google";
import "./globals.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/shared/Footer/Footer";
import SiteHeader from "@/app/SiteHeader";
import { UserProvider } from "@/context/userContext";
import { Toaster } from "sonner";
import Providers from "@/utils/queryProvider";
import NextTopLoader from "nextjs-toploader";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

declare global {
  interface Window {
    myCustomProperty: any;
  }
}
export const metadata = {
  title: "Universe3 - NFT Marketplace",
  description: "NFT Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        <NextTopLoader showSpinner={false} />
        <Providers>
          <UserProvider>
            <SiteHeader />
            {children}
            <Footer />
            <Toaster
              position="top-center"
              invert
              closeButton
              toastOptions={{
                style: { background: "#1e2a42" },
              }}
            />
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
