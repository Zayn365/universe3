import { useContractInstance } from "@/contract/instance";
import axios from "axios";
import { ethers } from "ethers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/hooks/useUserContext";
import Cookies from "js-cookie";

declare let window: any;
const apiUrl = process.env.NEXT_PUBLIC_API_BASEURL;

export function useWeb3Helper() {
  let wallets = Cookies.get("wallet");
  console.log(wallets);
  const router = useRouter();
  const { MarketPlace, NFT, provider } = useContractInstance();

  const mintNft = async (
    data: any,
    wallet: string,
    refetch: () => void,
    loader: any
  ) => {
    try {
      const signer = await provider.getSigner();
      const gasPrice = await signer.getGasPrice();
      const contract = await MarketPlace();
      const nftContract = await NFT(data.collection_address);
      const mintNft = await nftContract.mint(wallet);
      const result = await mintNft.wait();
      console.log(result);
      const mintId = Number(result.events[0].args.tokenId);
      const hash = result;
      console.log(hash, "CHECK HASH");
      await axios
        .put(`${apiUrl}/nfts/update/${data.id}`, {
          ...data,
          token_id: mintId.toString(),
          primary_owner: wallet,
          contract_address: contract.address,
          secondary_owner: {
            buyer: { wallet },
          },
        })
        .then(async () => {
          await axios.post(`${apiUrl}/blockChainTxn/create`, {
            nft_id: data.id,
            event: "mint",
            fromaddress: wallet,
            toaddress: contract.address,
            txn_hash: hash ? hash.transactionHash : "N/A",
            amount: gasPrice.toString(),
          });
          toast.success("NFT Minted Successfully");
          refetch();
          router.push(`nft-detail?id=${data.id}`);
        });
      loader?.(true);
    } catch (e: any) {
      loader?.(false);
      toast.error(
        `${
          e && e.error && e.error.data && e.error.data
            ? e.error.data.message
            : "Unknown Error Occurred"
        }`
      );

      console.log(e, "DATACHECK");
    }
    // finally {
    //   loader?.(false);
    // }
  };

  const mintImageNft = async (
    data: any,
    wallet: string = "",
    refetch: () => void,
    callback?: (id: any) => void
  ) => {
    try {
      const signer = await provider.getSigner();
      // Check if the image has already been uploaded
      // const existingImageResponse = await axios.get(
      //   `${apiUrl}/nfts/check-image`,
      //   {
      //     params: { imageUrl: data.imageUrl },
      //   }
      // );

      // if (existingImageResponse.data.exists) {
      //   toast.error("This image has already been uploaded.");
      //   return;
      // }
      console.log(signer);
      const gasPrice = await signer.getGasPrice();
      console.log(gasPrice);
      const contract = await MarketPlace();
      console.log(contract);
      console.log(data);
      const nftContract = await NFT(data.collection_address);
      console.log(nftContract);
      const mintNft = await nftContract.mint(wallet);
      const result = await mintNft.wait();
      console.log(result);
      const mintId = Number(result.events[0].args.tokenId);
      const hash = result;
      console.log(hash, "CHECK HASH");

      await axios
        .post(`${apiUrl}/nfts/create`, {
          name: data.name,
          description: data.description,
          royalty_commission: 10,
          primary_owner: wallet,
          secondary_owner: {
            buyer: {
              wallet,
            },
          },
          type: "digital",
          category: data.category,
          img: data.imageUrl,
          collection_id: data?.collectionId,
          collection_address: data.collection_address,
          kind: "unique",
          properties: data.customData.reduce(
            (acc: any, cur: { key: string; value: any }) => {
              if (!acc[cur.key]) {
                acc[cur.key] = "";
              }

              acc[cur.key] = cur.value;

              return acc;
            },
            {}
          ),
          blockchain: "POLYGON",
          supply_quantity: 1,
          contract_address: contract.address,
          token_id: mintId.toString(),
          token_standard: "ERC-721",
          creator_fee: "0.1",
          open_auction: {
            price: 0,
            duration_hours: 0,
          },
          fix_price: {
            price: 0,
          },
          sub_category: "",
          listingid: "",
          stakeid: "",
          auctionid: "",
          status: {
            sale: false,
            auction: false,
            stake: false,
          },
          created_at: new Date(),
        })
        .then(async (res: any) => {
          await axios.post(`${apiUrl}/blockChainTxn/create`, {
            nft_id: res?.data?.response?.nft?.id,
            event: "mint",
            fromaddress: wallet,
            toaddress: contract.address,
            txn_hash: hash ? hash.transactionHash : "N/A",
            amount: gasPrice.toString(),
          });
          toast.success("NFT Minted Successfully");
          refetch();

          callback && callback(res?.data?.response?.nft?.id);
        });
    } catch (e: any) {
      toast.error(
        `${
          e && e.error && e.error.data && e.error.data
            ? e.error.data.message
            : "Unknown Error Occurred"
        }`
      );

      console.log(e, "DATACHECK");
    }
  };

  const BuyMarket = async (
    listingId: string,
    price: string,
    id: number,
    data: any,
    buyerAddress: string,
    refetch?: () => void
  ) => {
    console.log(listingId, price, id, data, buyerAddress, "CHECK");
    let marketContract = await MarketPlace();
    const parsedPrice = ethers.utils.parseEther(`${price}`).toString();
    try {
      const market = await marketContract.buyNFT(listingId, {
        value: parsedPrice,
      });
      const check = await market.wait();
      const hash = check;
      if (check !== null) {
        await axios
          .post(`${apiUrl}/nfts/buy`, {
            id: id,
            buyerAddress: buyerAddress,
            amount: Number(price),
          })
          .then(async () => {
            await axios.put(`${apiUrl}/nfts/update/${data.id}`, {
              ...data,
              secondary_owner: {
                buyer: { wallet: buyerAddress },
              },
              listingid: "",
              status: {
                ...data.status,
                sale: false,
              },
            });
            await axios.post(`${apiUrl}/blockChainTxn/create`, {
              nft_id: data.id,
              event: "buy nft",
              fromaddress: wallets,
              toaddress: marketContract.address,
              txn_hash: hash ? hash.transactionHash : "N/A",
              amount: data?.fix_price?.price.toString(),
            });
            toast.success("NFT Bought!");
            refetch?.();
            router.push("/author");
          });
      } else {
        // toast.error(check.Error);
        console.log(check.Error);
      }
    } catch (e: any) {
      toast.error(
        `${
          e && e.error && e.error.data && e.error.data
            ? e.error.data.message
            : "Unknown Error Occurred"
        }`
      );

      console.log(e, "DATACHECK");
    }
  };

  const StakeNFT = async (
    tokenId: string,
    tokenContract: string,
    data: any,
    status: any,
    nftData: any,
    wallet: any,
    time: any
  ) => {
    console.log("stake func");
    try {
      const signer = await provider.getSigner();
      const gasPrice = await signer.getGasPrice();
      const contract = await MarketPlace();
      const nftContract = await NFT(tokenContract);
      // console.log(new Date(time).getTime(), new Date().getTime(), "DATES");
      const epochDuration = new Date(time).getTime() - new Date().getTime();

      const approve = await nftContract.approve(contract.address, tokenId);
      await approve.wait();
      const floored = Math.floor(epochDuration).toFixed();
      console.log(tokenId, tokenContract, epochDuration, "CHECK");
      const stakeNft = await contract.stake(
        tokenId,
        tokenContract,
        floored.toString()
      );
      const result1 = await stakeNft.wait();

      console.log(result1);

      const stakeId = Number(result1.events[1].args.stakeId);
      const hash = result1;
      const { id, ...rest } = data;
      await axios.post(`${apiUrl}/stake`, {
        ...rest,
        creator_wallet: wallet,
        created_by: 1,
      });

      await axios.put(`${apiUrl}/nfts/update/${nftData.id}`, {
        ...nftData,
        listingid: "",
        stakeid: `${stakeId}`,
        status: {
          ...status,
          stake: true,
        },
      });
      await axios.post(`${apiUrl}/blockChainTxn/create`, {
        nft_id: nftData.id,
        event: "stake",
        fromaddress: wallets,
        toaddress: contract.address,
        txn_hash: hash ? hash.transactionHash : "N/A",
        amount: gasPrice.toString(),
      });
      toast.success("Nft Staked SuccessFully!");
      // handleFormSubmit();
    } catch (e: any) {
      toast.error(
        `${
          e && e.error && e.error.data && e.error.data
            ? e.error.data.message
            : "Unknown Error Occurred"
        }`
      );

      console.log(e, "DATACHECK");
    }
  };
  const ClaimReward = async (data: any, refetch?: () => void) => {
    const contract = await MarketPlace();
    const signer = provider.getSigner();
    const gasPrice = await signer.getGasPrice();
    try {
      const claim = await contract.claim();
      await claim.wait();
      const hash = claim;
      await axios.put(`${apiUrl}/nfts/update/${data.id}`, {
        ...data,
        listingid: "",
        stakeid: "",
        status: {
          ...data.status,
          stake: false,
        },
      });
      await axios.post(`${apiUrl}/blockChainTxn/create`, {
        nft_id: data.id,
        event: "claimed nft stake",
        fromaddress: wallets,
        toaddress: contract.address,
        txn_hash: hash ? hash.transactionHash : "N/A",
        amount: gasPrice.toString(),
      });
      toast.success("Nft Stake Claimed SuccessFully!");
      refetch?.();
    } catch (e: any) {
      console.log(e, "DATACHECK");
      toast.error(
        `${
          e && e.error && e.error.data && e.error.data
            ? e.error.data.message
            : "Unknown Error Occurred"
        }`
      );
    }
  };
  const unStakeNFT = async (
    stakeId: string,
    data: any,
    refetch?: () => void
  ) => {
    console.log("unstake func");
    try {
      // if (!wallet) {
      //   console.log('Please connect wallet');
      //   return;
      // }
      // const collectionDetails = await axiosInstance.get(/collections/get/${collId});

      const contract = await MarketPlace();
      const signer = await provider.getSigner();
      const gasPrice = await signer.getGasPrice();

      const stakeNft = await contract.unstake(stakeId, {
        gasPrice: gasPrice,
        gasLimit: "210000",
      });

      await stakeNft.wait();
      const hash = stakeNft;
      await axios.put(`${apiUrl}/nfts/update/${data.id}`, {
        ...data,
        listingid: "",
        stakeid: "",
        status: {
          ...data.status,
          stake: false,
        },
      });
      await axios.post(`${apiUrl}/blockChainTxn/create`, {
        nft_id: data.id,
        event: "un-stake nft",
        fromaddress: wallets,
        toaddress: contract.address,
        txn_hash: hash ? hash.transactionHash : "N/A",
        amount: gasPrice.toString(),
      });
      await ClaimReward(data, refetch);
      toast.success("Nft Un-Staked SuccessFully!");
      refetch?.();
      // const id = Number(collectionDetails?.data?.data?.id);
      // const id = Number(nftId);
    } catch (e: any) {
      console.log(e, "DATACHECK");
      toast.error(
        `${
          e && e.error && e.error.data && e.error.data
            ? e.error.data.message
            : "Unknown Error Occurred"
        }`
      );
    }
  };

  const ReSellNft = async (
    price: number,
    tokenId: string,
    tokenContract: string,
    data: any,
    handler: void | any,
    refetch?: () => void,
    RouterFunction?: () => void
  ) => {
    try {
      // console.log(data, "data");
      const contract = await MarketPlace();

      const collectionAddress = tokenContract;
      // console.log("Checker 1", collectionAddress);
      const nftContract = await NFT(collectionAddress);
      // console.log("Checker 2");
      // console.log(contract.address, data.collection_id);
      const signer = await provider.getSigner();
      const gasPrice = await signer.getGasPrice();
      // console.log("Checker 3");
      // const yo = await contract.listingCounter();
      // console.log(tokenId, "CHECK");
      // const tokenOwner = await nftContract.ownerOf(tokenId);
      // console.log(tokenOwner, "jahjd");
      // console.log("Checker 4", contract.address);
      const approve = await nftContract.approve(contract.address, tokenId);
      await approve.wait();
      const value = ethers.utils.parseEther(price.toString());
      // console.log(collectionAddress, "COLLECTION");
      // console.log(tokenId, "TOKEN");
      // console.log(value, "PRICE");
      const listNft = await contract.listNFT(collectionAddress, tokenId, value);
      const result1 = await listNft.wait();
      const listId = Number(result1.events[1].args.listingId);
      const hash = result1;
      await axios.put(`${apiUrl}/nfts/update/${data.id}`, {
        ...data,
        listingid: `${listId}`,
        stakeid: "",
        fix_price: {
          price: price,
        },
        status: {
          ...data.status,
          sale: true,
        },
      });
      await axios.post(`${apiUrl}/blockChainTxn/create`, {
        nft_id: data.id,
        event: "ReSell nft",
        fromaddress: wallets,
        toaddress: contract.address,
        txn_hash: hash ? hash.transactionHash : "N/A",
        amount: gasPrice.toString(),
      });
      // HANDLER TO CLOSE
      refetch?.();
      handler();
      RouterFunction?.();
    } catch (e: any) {
      console.log(e, "DATACHECK");
      toast.error(
        `${
          e && e.error && e.error.data && e.error.data
            ? e.error.data.message
            : "Unknown Error Occurred"
        }`
      );
    }
  };

  const RemoveNft = async (
    listingId: string,
    data: any,
    refetch?: () => void
  ) => {
    try {
      const contract = await MarketPlace();
      const listNft = await contract.cancelListing(listingId);
      const result1 = await listNft.wait();
      const signer = await provider.getSigner();
      const gasPrice = await signer.getGasPrice();

      console.log(result1);
      const hash = result1;
      if (result1 !== null) {
        await axios
          .put(`${apiUrl}/nfts/update/${data.id}`, {
            ...data,
            listingid: "",
            status: {
              ...data.status,
              sale: false,
            },
          })
          .then(async () => {
            await axios.post(`${apiUrl}/blockChainTxn/create`, {
              nft_id: data.id,
              event: "Remove Nft",
              fromaddress: wallets,

              toaddress: contract.address,
              txn_hash: hash ? hash.transactionHash : "N/A",
              amount: gasPrice.toString(),
            });
            toast.success("NFT Removed From Market!");
            refetch?.();
          })
          .catch((e: any) => {
            console.log("ERROR", e.message);
            toast.error("NFT Removed Failed!");
          });
      }
    } catch (e: any) {
      console.log(e, "DATACHECK");
      toast.error(
        `${
          e && e.error && e.error.data && e.error.data
            ? e.error.data.message
            : "Unknown Error Occurred"
        }`
      );
    }
  };

  const CreateAuction = async (
    CollectionAddress: string,
    tokenId: string,
    startingPrice: string,
    duration: string,
    data: any,
    handleCloser: any,
    refetch?: () => void
  ) => {
    try {
      const currentDate = new Date();
      const seconds = currentDate.getTime() / 1000;
      const d = Math.floor(Number(duration) - seconds).toFixed(0);
      const contract = await MarketPlace();
      const nftContract = await NFT(CollectionAddress);
      console.log(d, "Minuses Time");
      console.log(Number(duration), seconds, "CHECK 1");
      const approve = await nftContract.approve(contract.address, tokenId);
      await approve.wait();

      const ParsedStartingPrice = ethers.utils.parseEther(startingPrice);

      const auction = await contract.createAuction(
        CollectionAddress,
        tokenId,
        ParsedStartingPrice,
        ParsedStartingPrice,
        d.toString()
      );

      const checker = await auction.wait();

      // const durationDate = new Date(Number(duration) - seconds);
      // const correctTime = Number(durationDate) + seconds;
      const correctedDate = new Date(Number(duration) * 1000);
      const isoString = correctedDate.toISOString();
      const auctionId = Number(checker.events[1].args.auctionId);
      const hash = checker;
      await axios
        .put(`${apiUrl}/nfts/update/${data.id}`, {
          ...data,
          listingid: "",
          stakeid: "",
          auctionid: `${auctionId}`,
          open_auction: {
            startPrice: startingPrice,
            reservedPrice: startingPrice,
            auctionEndTime: isoString,
            auctionStartTime: new Date().toISOString(),
          },
          status: {
            ...data.status,
            auction: true,
          },
        })
        .then(async () => {
          toast.success("NFT Added On Auction!");
          await axios.post(`${apiUrl}/blockChainTxn/create`, {
            nft_id: data.id,
            event: "auction",
            fromaddress: wallets,
            toaddress: contract.address,
            txn_hash: hash ? hash.transactionHash : "N/A",
            amount: startingPrice,
          });
        });
      handleCloser();
      refetch?.();
    } catch (e: any) {
      console.log(e, "DATACHECK");
      toast.error(
        `${
          e && e.error && e.error.data && e.error.data
            ? e.error.data.message
            : "Unknown Error Occurred"
        }`
      );
    }
  };

  const PlaceBid = async (
    CollectionAddress: string,
    auctionId: string,
    placedAmount: string,
    data: any,
    wallet: string,
    refetch: void | any,
    listAuction: any
  ) => {
    try {
      const contract = await MarketPlace();
      const nftContract = await NFT(CollectionAddress);
      const ParsedStartingPrice = ethers.utils.parseEther(placedAmount);
      const bid = await contract.placeBid(auctionId, {
        value: ParsedStartingPrice,
      });
      const date = new Date().toISOString();
      const d = listAuction.filter((val: any) => {
        return val.nft_id === data.id;
      })?.[0];
      const hash = await bid.wait();
      if (d) {
        const requestBody = {
          nft_id: data.id,
          nft_name: data?.name,
          auction_start_time: data?.open_auction?.auctionStartTime
            ? data?.open_auction?.auctionStartTime
            : date,
          auction_end_time: data.open_auction.auctionEndTime
            ? data.open_auction.auctionEndTime
            : date,
          auction_status: "active",
          starting_price: data.open_auction.startPrice,
          auction_index: Number(data.auctionid),
          current_price: placedAmount,
          highest_bidder: wallet,
          created_at: date,
          updated_at: date,
          ...(d && { id: d.id }), // conditionally include id property
        };
        await axios
          .put(`${apiUrl}/auction/updateAuction/${d.id}`, requestBody)
          .then(async () => {
            await axios.post(`${apiUrl}/blockChainTxn/create`, {
              nft_id: data.id,
              event: "Bid Placed",
              fromaddress: wallets,
              toaddress: contract.address,
              txn_hash: hash ? hash.transactionHash : "N/A",
              amount: placedAmount,
            });
            refetch?.();

            toast.success("Bid Placed Successfully!");
          });
      } else {
        const requestBody = {
          nft_id: data.id,
          nft_name: data?.name,
          auction_start_time: data?.open_auction?.auctionStartTime
            ? data?.open_auction?.auctionStartTime
            : date,
          auction_end_time: data.open_auction.auctionEndTime
            ? data.open_auction.auctionEndTime
            : date,
          auction_status: "active",
          starting_price: data.open_auction.startPrice,
          auction_index: Number(data.auctionid),
          current_price: placedAmount,
          highest_bidder: wallet,
          created_at: date,
          updated_at: date,
        };
        await axios
          .post(`${apiUrl}/auction/createAuction`, requestBody)
          .then(() => {
            refetch?.();
            toast.success("Bid Placed Successfully!");
          });
      }

      // await axios
      //   .post(`${apiUrl}/auction/createAuction`, {
      //     nft_id: data.id,
      //     nft_name: data?.name,
      //     auction_start_time: data?.open_auction?.auctionStartTime
      //       ? data?.open_auction?.auctionStartTime
      //       : date,
      //     auction_end_time: data.open_auction.auctionEndTime
      //       ? data.open_auction.auctionEndTime
      //       : date,
      //     auction_status: "active",
      //     starting_price: data.open_auction.startPrice,
      //     auction_index: Number(data.auctionid),
      //     current_price: placedAmount,
      //     highest_bidder: wallet,
      //     created_at: date,
      //     updated_at: date,
      //   })
      //   .then(() => {
      //     refetch?.();
      //     toast.success("Bid Placed Successfully!");
      //   });
    } catch (e: any) {
      toast.error(
        `${
          e.error.data
            ? e.error.data.message
              ? e.error.data.message
              : e.error.data.message
              ? e.error.data.message
              : e.message
            : "Unknown Error Occurred"
        }`
      );
      console.log(e, "DATACHECK");
    }
  };

  const ReleaseBid = async (
    auctionId: number,
    data: any,
    nftData: any,
    refetch?: () => void
  ) => {
    try {
      const contract = await MarketPlace();
      const signer = await provider.getSigner();
      const gasPrice = await signer.getGasPrice();
      const bid = await contract.endAuction(auctionId.toString());
      await bid.wait();
      const hash = bid;
      await axios.put(`${apiUrl}/auction/updateAuction/${data.id}`, {
        ...data,
        auction_status: "ended",
      });
      await axios
        .put(`${apiUrl}/nfts/update/${nftData.id}`, {
          ...nftData,
          secondary_owner: {
            buyer: { wallet: data?.highest_bidder },
          },
          listingid: "",
          stakeid: "",
          auctionid: "",
          open_auction: {},
          status: {
            ...nftData.status,
            auction: false,
          },
        })
        .then(async () => {
          await axios.post(`${apiUrl}/blockChainTxn/create`, {
            nft_id: data.id,
            event: "un-stake nft",
            fromaddress: wallets,
            toaddress: contract.address,
            txn_hash: hash ? hash.transactionHash : "N/A",
            amount: gasPrice.toString(),
          });
          toast.success("Auction Cancelled Successfully!");
          refetch?.();
        });
    } catch (e: any) {
      console.log(e, "DATACHECK");
      toast.error(
        `${
          e && e.error && e.error.data && e.error.data
            ? e.error.data.message
            : "Unknown Error Occurred"
        }`
      );
    }
  };

  const CancelAuction = async (
    auctionId: number,
    data: any,
    nftData: any,
    refetch?: () => void
  ) => {
    try {
      const contract = await MarketPlace();
      const bid = await contract.endAuction(auctionId.toString());
      const signer = await provider.getSigner();
      const gasPrice = await signer.getGasPrice();
      await bid.wait();
      const hash = bid;
      await axios.put(`${apiUrl}/auction/updateAuction/${data.id}`, {
        ...data,
        auction_status: "ended",
      });
      await axios
        .put(`${apiUrl}/nfts/update/${nftData.id}`, {
          ...nftData,
          secondary_owner: {
            buyer: { wallet: data?.highest_bidder },
          },
          listingid: "",
          stakeid: "",
          auctionid: "",
          open_auction: {},
          status: {
            ...nftData.status,
            auction: false,
          },
        })
        .then(async () => {
          await axios.post(`${apiUrl}/blockChainTxn/create`, {
            nft_id: data.id,
            event: "un-stake nft",
            fromaddress: wallets,
            toaddress: contract.address,
            txn_hash: hash ? hash.transactionHash : "N/A",
            amount: gasPrice.toString(),
          });
          toast.success("Auction Cancelled Successfully!");
          refetch?.();
        });
    } catch (e: any) {
      console.log(e, "DATACHECK");
      toast.error(
        `${
          e && e.error && e.error.data && e.error.data
            ? e.error.data.message
            : "Unknown Error Occurred"
        }`
      );
    }
  };

  return {
    CancelAuction,
    ReleaseBid,
    PlaceBid,
    CreateAuction,
    RemoveNft,
    ReSellNft,
    unStakeNFT,
    StakeNFT,
    BuyMarket,
    mintImageNft,
    mintNft,
    ClaimReward,
  };
}
