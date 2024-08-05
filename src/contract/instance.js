import { ethers } from "ethers";
import NFTMARKETPLACE_ABI from "./nftmarketplace.json";
import TOKEN_ABI from "./erc20.json";
import NFT_ABI from "./nft.json";
import { useSDK } from "@metamask/sdk-react";

// const providerUrl = 'https://rpc.ankr.com/polygon_amoy';

export function useContractInstance() {
  const { provider: metaProvider } = useSDK();
  const provider =
    typeof metaProvider !== "undefined"
      ? new ethers.providers.Web3Provider(metaProvider)
      : new ethers.providers.JsonRpcProvider(
          "https://polygon-amoy.blockpi.network/v1/rpc/public"
        );

  const MarketPlace = async () => {
    const contractAddress = "0xBb85d9F193285B321f133cD305CA41F839D381d4";
    const signer = provider.getSigner();
    const marketplaceContract = new ethers.Contract(
      contractAddress,
      NFTMARKETPLACE_ABI,
      signer
    );
    return marketplaceContract;
  };

  const Token = async () => {
    const contractAddress = "0x24b5d538214Edad8c607a706FB809C102562C1E2";
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
      contractAddress,
      TOKEN_ABI,
      signer
    );
    console.log("🚀 ~ token ~ contract:", tokenContract);
    return tokenContract;
  };

  const NFT = async (nftAddress) => {
    const contractAddress = nftAddress;
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(contractAddress, NFT_ABI, signer);
    console.log("🚀 ~ nft ~ contract:", nftContract);
    return nftContract;
  };

  return { MarketPlace, Token, NFT, provider };
}
