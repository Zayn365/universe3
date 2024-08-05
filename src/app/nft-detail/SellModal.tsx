import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Modal } from "antd";
import Image from "next/image";
import { nftsImgs } from "@/contains/fakeData";
import { useWeb3Helper } from "@/helpers/web3HelperFunctions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface Props {
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  data?: any | null;
  refetch: () => void | undefined;
}

const SellModal = (props: Props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [price, setPrice] = useState("");
  const { open, setOpen, data, refetch } = props;
  const { ReSellNft } = useWeb3Helper();
  const router = useRouter();
  //   const showModal = () => {
  //     setOpen(true);
  //   };
  //   console.log(data);
  const handleCloser = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen?.(false);
      setConfirmLoading(false);
    }, 2000);
    toast.success("NFT Listed Successfully!");
    router.push(`nft-detail?id=${data.id}`);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      await ReSellNft(
        Number(price),
        data.token_id,
        data.collection_address,
        data,
        handleCloser,
        refetch
      );
      setConfirmLoading(false);
    } catch (e: any) {
      console.log(e);
      toast.error("NFT Not Added");
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen?.(false);
  };

  return (
    <>
      <Modal
        title="List NFT"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        okText="List NFT"
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "#0086c7", borderColor: "#0086c7" },
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
          <p className="w-1/4 text-[16px] text-bold text-gray-700">Price:</p>
          <input
            type="number"
            required
            className="w-3/4 pl-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="0.0001"
            onChange={(e: any) => {
              setPrice(e.target.value);
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default SellModal;
