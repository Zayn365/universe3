import { Numbers } from "web3";

export type NftHome = {
  open_auction: any;
  status: any;
  id: string;
  name: string;
  img: string;
  creator_name: string;
  collection_name: string;
  price: string;
  creator_image_url: string;
  on_sale: boolean;
  primary_owner: string;
  token_id: string;
  fix_price: {
    price: any;
  };
};

export type NftCollection = {
  nft_name: string;
  nft_image_url: string;
};

export type NftType = {
  secondary_owner: any;
  fix_price: any;
  status: any;
  id: number;
  img: string;
  price: string;
  name: string;
  description: string;
  current_owner: string;
  primary_owner: string;
  on_sale: boolean;
  owner_wallet: string;
  token_id: string;
  collection_address: string;
  blockchain: string;
};

export type NftSale = {
  listingid: boolean | undefined;
  secondary_owner: {
    buyer: {
      wallet: string;
    };
  };
  status?: {
    sale: boolean;
    auction: boolean;
    stake: boolean;
  };
  img: string;
  fix_price: any;
  id: number;
  image_url: string;
  name: string;
  description: string;
  price: string;
  current_owner: string;
  primary_owner: string;
  on_sale: boolean;
  owner_wallet: string;
  token_id: string;
  collection_address: string;
};
