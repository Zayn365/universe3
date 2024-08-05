import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Modal } from "antd";
import Image from "next/image";
import { nftsImgs } from "@/contains/fakeData";
import { useWeb3Helper } from "@/helpers/web3HelperFunctions";
import { toast } from "sonner";
interface Props {
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  data?: any | null;
  refetch?: () => void;
}

const AuctionModel: React.FC = (props: Props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [startPrice, setStartPrice] = useState("");
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
  const handleOk = () => {
    try {
      CreateAuction(
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
        title="Auction NFT"
        open={open}
        onOk={async () => {
          handleOk();
        }}
        okText="Auction NFT"
        destroyOnClose={true}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        // cancelButtonProps={{
        //   disabled: confirmLoading,
        // }}
        okButtonProps={{
          disabled: !duration || !startPrice,
          style: {
            backgroundColor: `${duration || startPrice ? "#0086c7" : "grey"}`,
            borderColor: `${duration || startPrice ? "#0086c7" : "grey"}`,
          },
        }}
      >
        {/* @ts-ignore */}
        <Image
          //     @ts-ignore
          src={data ? data?.img : nftsImgs[0]}
          width={500}
          className="rounded-md"
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
            className="w-3/4 pl-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="0.0001"
            min={0}
            onChange={(e: any) => {
              // Update state with valid input
              const value = e.target.value;
              if (!isNaN(value) && parseFloat(value) >= 0) {
                setStartPrice(value);
              }
            }}
            onInput={(e: any) => {
              // Remove invalid characters
              const input = e.target;
              input.value = input.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
            }}
          />
        </div>
        <div className="flex mt-4 items-center justify-start mb-4">
          <p className="w-1/4 text-[16px] text-bold text-gray-700">Duration:</p>
          <input
            type="date" // changed from "date" to "text"
            required
            className="w-3/4 pl-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
