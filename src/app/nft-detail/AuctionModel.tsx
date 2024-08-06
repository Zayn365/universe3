import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Modal } from "antd";
import Image from "next/image";
import { nftsImgs } from "@/contains/fakeData";
import { useWeb3Helper } from "@/helpers/web3HelperFunctions";
import { toast } from "sonner";
import { useThemeMode } from "@/hooks/useThemeMode";
interface Props {
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  data?: any | null;
  refetch?: () => void;
}

const AuctionModel: React.FC = (props: Props) => {
  const {isDarkMode} = useThemeMode()
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [startPrice, setStartPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState("");
  const { open, setOpen, data, refetch } = props;
  const { CreateAuction } = useWeb3Helper();
  const handleCloser = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen?.(false);
      setConfirmLoading(false);
    }, 2000);
    // toast.success("NFT Added On Re-Sell Successfully!");
  };
  console.log(duration);
  const handleOk =async () => {
    try {
      setConfirmLoading(true); // Indicate that the confirmation button is loading
      console.log(confirmLoading)
      setLoading(true); // Set loading to true when the operation starts
  
    await  CreateAuction(
        data.collection_address,
        data.token_id,
        startPrice,
        duration,
        data,
        handleCloser,
        refetch
      );
    } catch (e: any) {
      console.log(e);
      toast.error("NFT Not Added");
    }finally {
      setConfirmLoading(false); // Reset the confirmation loading state
      setLoading(false); // Reset the general loading state
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setDuration("");
    setStartPrice("");
    setOpen?.(false);
  };

  const handleDateInput = (e: any) => {
    const durationString = e.target.value.toString();
    let selectedDate = new Date(durationString);
    const now = new Date();
    selectedDate.setHours(now.getHours());
    selectedDate.setMinutes(now.getMinutes() + 30);
    const seconds = selectedDate.getTime() / 1000;
    setDuration(seconds.toString());
  };
  var dtToday = new Date();

  let month: string | number = dtToday.getMonth() + 1;
  let day: string | number = dtToday.getDate();
  var year = dtToday.getFullYear();
  if (month < 10) month = "0" + month.toString();
  if (day < 10) day = "0" + day.toString();
  var maxDate = year + "-" + month + "-" + day;
  return (
    <>
       <Modal
        title={<span style={{ color: isDarkMode ? "white" :"#111827" }}>Auction NFT</span>}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        destroyOnClose={true}
        okText="Auction NFT"
                onCancel={loading ? undefined : handleCancel}
          okButtonProps={{
            disabled: !duration || !startPrice,
            style: {
              backgroundColor: `${duration && startPrice ? "#0086c7" : "grey"}`,
              borderColor: `${duration && startPrice ? "#0086c7" : "grey"}`,
              color: `${duration && startPrice  ? "white" : "#bbb"}`,
            },
            
        }}
        cancelButtonProps={{
          disabled: loading,
          style: { color: isDarkMode ? "gray" : "#111827", }
        }}
        closeIcon={false}
        styles={{footer: { backgroundColor: isDarkMode ? "#111827" :"white" },header:{ backgroundColor: isDarkMode ? "#111827" :"white" },content:{ backgroundColor: isDarkMode ? "#111827" :"white"}}}>

        {/* @ts-ignore */}
        <Image
          //     @ts-ignore
          src={data ? data?.img : nftsImgs[0]}
          width={500}
          className="rounded-md  !max-h-[300px] !min-h-[300px] object-cover object-center"
          height={500}
          alt="nftIMAGE"
        />
        <div className="flex mt-4 items-center justify-start mb-4">
          <p className="w-1/4 text-[16px] text-bold text-gray-700">
            Starting Price:
          </p>
          <input
            type="number"
            required
            className="w-3/4 pl-2 py-2 border border-gray-300 dark:text-white dark:bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="0.0001"
            min={0}
            onChange={(e: any) => {
              const value = e.target.value;
              if (!isNaN(value) && parseFloat(value) > 0) {
                setStartPrice(value);
                return;
              }
              setStartPrice("")
            }}
            onInput={(e: any) => {
              const input = e.target;
              input.value = input.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
            }}
          />
        </div>
        <div className="flex mt-4 items-center justify-start mb-4">
          <p className="w-1/4 text-[16px] text-bold text-gray-700">Duration:</p>
          <input
            type="date" 
            required
            className="w-3/4 pl-2 py-2 dark:text-white dark:bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="HH:mm:ss"
            onChange={(e: any) => {
              handleDateInput(e);
            }}
            min={maxDate}
          />
        </div>
      </Modal>
    </>
  );
};

export default AuctionModel;
