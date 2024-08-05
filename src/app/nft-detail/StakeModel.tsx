import { nftsImgs } from "@/contains/fakeData";
import { useWeb3Helper } from "@/helpers/web3HelperFunctions";
import { useUserContext } from "@/hooks/useUserContext";
import { Modal } from "antd";
import Cookies from "js-cookie";
import Image from "next/image";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
interface Props {
  open: boolean | { isStake?: boolean };
  setOpen?: Dispatch<SetStateAction<boolean>> | any;
  data?: any | null;
  stakeSettings?: any | null;
}

const StakeModel: React.FC<Props> = (props: Props) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [autostaking, setAutoStaking] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const wallet = Cookies.get("wallet");
  const { StakeNFT, unStakeNFT } = useWeb3Helper();
  const { user } = useUserContext();
  const { open, setOpen, data, stakeSettings } = props;

  const { isStake } = typeof open !== "boolean" ? open : { isStake: false };

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, ariaChecked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? ariaChecked : value,
    }));
  };

  const handleCloser = () => {
    setTimeout(() => {
      setOpen?.(false);
      setConfirmLoading(false);
    }, 2000);
    // toast.success(`NFT ${!isStake ? "un" : ""} stake successfully!"`);
  };
  console.log(stakeSettings);

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      setLoading(true); // Set loading to true when the operation starts
      
      if (isStake) {
        const stakeBody = {
          ...stakeSettings,
          stakedate: new Date().toISOString(),
          created_by: user?.wallet,
          creator_wallet: wallet,
          // apr: `${formData?.apr}%`,
          collection_id: data?.collection_id,
          nft_id: data?.id,
        };
  
        const duration = getDuration();
  
        await StakeNFT(
          data?.token_id,
          data?.collection_address,
          { ...stakeBody },
          data?.status,
          data,
          wallet,
          duration
        );
      } else {
        await unStakeNFT(data?.stakeid, data);
      }
    } catch (e: any) {
      console.log(e);
      toast.error(`NFT ${!isStake ? "un" : ""} stake unsuccessful!"`);
    } finally {
      handleCloser();
      setLoading(false); // Set loading to false when the operation ends
    }
  };
  
  function getDuration() {
    let seconds;

    if (stakeSettings?.duration) {
      const selectedDate = new Date();
      const now = new Date();
      selectedDate.setHours(now.getHours());
      selectedDate.setMinutes(now.getMinutes() + 30);
      if (stakeSettings?.duration) {
        selectedDate.setDate(now.getDate() + stakeSettings.duration);
      }
      seconds = selectedDate.getTime();
    } else {
      const selectedDate = new Date(stakeSettings?.duration);
      const now = new Date();
      selectedDate.setHours(now.getHours());
      selectedDate.setMinutes(now.getMinutes() + 30);
      seconds = selectedDate.getTime();
    }

    return new Date(seconds).toLocaleString();
  }

  const handleCancel = () => {
    setOpen?.(false);
  };

  var dtToday = new Date();

  let month: string | number = dtToday.getMonth() + 1;
  let day: string | number = dtToday.getDate();
  if (month < 10) month = "0" + month.toString();
  if (day < 10) day = "0" + day.toString();
  console.log(new Date().getDate(), "DAYS");
  return (
    <>
      <Modal
        title={`${!isStake ? "Unstake" : "Stake"} NFT`}
        open={!!open}
        okText={`${!isStake ? "Unstake" : "Stake"} NFT`}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={loading ? undefined : handleCancel}
        // onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "#0086c7", borderColor: "#0086c7" },
        }}
        cancelButtonProps={{
          disabled: loading, // Disable cancel button when loading
        }}
      >
        {/* @ts-ignore */}
        <Image
          //     @ts-ignore
          src={data ? data?.img : nftsImgs[0]}
          width={250}
          className="rounded-md w-full h-auto"
          height={250}
          alt="nftIMAGE"
        />
        {isStake ? (
          <>
            <div className="flex flex-col mt-4 mb-4">
              <h2 className="text-lg font-bold text-gray-700">
                Staking Settings
              </h2>
              <ul>
                <li>
                  <b>Duration:</b> {stakeSettings?.duration} Day
                </li>
                <li>
                  <b>Duration End Date:</b> {getDuration()}
                </li>
                <li>
                  <b>Type:</b> {stakeSettings?.type}
                </li>
                <li>
                  <b>Rate:</b> {stakeSettings?.apr}
                </li>
                <li>
                  <b>Amount:</b> {stakeSettings?.maximumamount}
                </li>
              </ul>
            </div>
            {/* 
            <span className="text-[10px] mr-2">
              Auto Stacking is a feature that let's you earn stacking rewards
              automatically without any manual effort.
            </span> */}
          </>
        ) : (
        
          <>
            <span className="text-xl mt-2 mr-2">Are you sure to unstake?</span>
          </>
        )}
      </Modal>
    </>
  );
};

export default StakeModel;
