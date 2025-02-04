import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Modal } from "antd";
import Image from "next/image";
import { nftsImgs } from "@/contains/fakeData";
import { useWeb3Helper } from "@/helpers/web3HelperFunctions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useThemeMode } from "@/hooks/useThemeMode";
interface Props {
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  data?: any | null;
  refetch: () => void | undefined;
}

const ResellModal = (props: Props) => {
  const {isDarkMode} = useThemeMode()
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const { open, setOpen, data, refetch } = props;
  const { ReSellNft } = useWeb3Helper();
  const router = useRouter();

  const handleCloser = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen?.(false);
      setConfirmLoading(false);
    }, 2000);
    toast.success("NFT Added On Re-Sell Successfully!");
    router.push(`nft-detail?id=${data.id}`);
  };
  const RouterFunction = () => {
    router.push("/marketplace?category=all");
  };
 
  const handleOk = async () => {
    try {
      setConfirmLoading(true); // Indicate that the confirmation button is loading
      setLoading(true); // Set loading to true when the operation starts
  
      await ReSellNft(
        Number(price),
        data.token_id,
        data.collection_address,
        data,
        handleCloser,
        refetch,
        RouterFunction
      );
  
    } catch (e: any) {
      console.log(e);
      toast.error("NFT Not Added");
    } finally {
      setConfirmLoading(false); // Reset the confirmation loading state
      setLoading(false); // Reset the general loading state
    }
  };
  

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen?.(false);
  };

  return (
    <>
      <Modal
        title={<span style={{ color: isDarkMode ? "white" :"#111827" }}>Resell NFT</span>}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        okText="ReSell NFT"
        onCancel={loading ? undefined : handleCancel}
          okButtonProps={{
          disabled: !price,
          style: {
            backgroundColor: `${price ? "#0086c7" : "grey"}`,
            borderColor: `${price ? "#0086c7" : "grey"}`,
            color: `${price ? "white" : "#bbb"}`,
          },
        }}
        cancelButtonProps={{
          disabled: loading,
          style: { color: isDarkMode ? "gray" : "#111827", }
        }}
        destroyOnClose={true}
        closeIcon={false}
        styles={{footer: { backgroundColor: isDarkMode ? "#111827" :"white" },header:{ backgroundColor: isDarkMode ? "#111827" :"white" },content:{ backgroundColor: isDarkMode ? "#111827" :"white"}}}>

        {/* @ts-ignore */}
        <Image
          //     @ts-ignore
          src={data ? data?.img : nftsImgs[0]}
          width={500}
          className="rounded-md !max-h-[300px] !min-h-[300px] object-cover object-center"
          height={500}
          alt="nftIMAGE"
        />
        <div className="flex mt-4 items-center justify-start mb-4">
          <p className="w-1/4 text-[16px] text-bold dark:text-white text-gray-700">Price:</p>
          <input
            type="number"
            required
            className="w-3/4 pl-2 py-2 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-transparent"
            placeholder="0.0001"
            min={0}
            onChange={(e: any) => {
              const value = e.target.value;
              if (!isNaN(value) && parseFloat(value) > 0) {
                setPrice(value);
                return;
              }
              setPrice("")
            }}
            onInput={(e: any) => {
              const input = e.target;
              input.value = input.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default ResellModal;
