"use client";
import Head from "next/head";
import Image from "next/image";
import { useWeb3Helper } from "@/helpers/web3HelperFunctions";
import { useRef, useState, ChangeEvent, FormEvent, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import Cookies from "js-cookie";
import Uploader from "@/components/nft/uploader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CustomDataType = {
  key: string;
  value: string;
};

type NftItem = {
  name: string;
  id: number;
  collection_address: string;
  token_id: string;
};

export default function Page() {
  const { mintImageNft } = useWeb3Helper();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const animationFileInputRef = useRef<HTMLInputElement | null>(null);
  const [customData, setCustomData] = useState<CustomDataType[]>([
    { key: "", value: "" },
  ]);

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const wallet = Cookies.get("wallet");
  // const [uploadedAnimation, setUploadedAnimation] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState<NftItem[]>([]);
  const [collectionId, setCollectionId] = useState<number | undefined>(
    undefined
  );
  const [collectionAddress, setCollectionAddress] = useState<
    string | undefined
  >(undefined);
  const [nftValue, setNftValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    getCollections();
  }, []);

  const getCollections = async () => {
    try {
      const collectionsRes = await axiosInstance.get(`/collections/getAll`);
      const filterData = collectionsRes.data;
      setCollection(filterData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange1 = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setNftValue(value);
    const selectedNft = collection?.find((item) => item.name === value);
    setCollectionId(selectedNft?.id);
    setCollectionAddress(selectedNft?.collection_address);
  };

  const handleFileClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const isValidImage = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB

    return allowedTypes.includes(file.type) && file.size <= maxSizeInBytes;
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "image" | "animation"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "image" && isValidImage(file)) {
        setUploadedImage(file);
        // setUploadedAnimation(null);
      } else {
        // setUploadedAnimation(file);
        toast.error(
          "Please upload a valid image file (jpg, jpeg, png) less than 1MB",
          { position: "top-center" }
        );
        setUploadedImage(null);
      }
    }
  };

  const handleAddCustomData = () => {
    setCustomData([...customData, { key: "", value: "" }]);
  };

  const handleRemoveCustomData = (index: number) => {
    const newCustomData = customData.filter((_, i) => i !== index);
    setCustomData(newCustomData);
  };

  const handleCustomDataChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newCustomData = [...customData];
    newCustomData[index][field] = value;
    setCustomData(newCustomData);
  };

  const handleImageDelete = () => {
    setUploadedImage(null);
  };

  // const handleAnimationDelete = () => {
  //   setUploadedAnimation(null);
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!uploadedImage) {
      // if (!uploadedImage && !uploadedAnimation) {
      console.log("Please upload an image or an animation.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      if (uploadedImage) formData.append("image", uploadedImage);
      // if (uploadedAnimation) formData.append("animation", uploadedAnimation);
      formData.append("nft", nftValue);
      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);
      customData.forEach((data, index) => {
        formData.append(`customData[${index}][key]`, data.key);
        formData.append(`customData[${index}][value]`, data.value);
      });

      const uploadResponse = await axiosInstance.post(
        "/image/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = uploadResponse.data.ipfsImage;

      const nftData = {
        name,
        category,
        collectionId,
        nftValue,
        description,
        customData,
        imageUrl: uploadedImage ? fileUrl : null,
        // animationUrl: uploadedAnimation ? fileUrl : null,
        collection_address: collectionAddress,
      };

      await mintImageNft(nftData, wallet, () => {
        console.log("Refetch data");
      }, (id) => {
        console.log(nftData);
        
        
        router.push(`/nft-detail?id=${id}`);
      });
      // toast.success("NFT Minted Successfully");


    } catch (error) {
      console.log("An error occurred while minting the NFT.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark:bg-[#171721] dark:text-white bg-white/70 text-black flex items-center justify-center py-8 px-4">
      <Head>
        <title>Mint NFT</title>
      </Head>
      <div className="sm:max-w-5xl w-full px-8 py-8 md:py-16 md:px-32 dark:bg-[#242333] bg-white/70 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Mint NFT</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
            <div>
              <label className="flex mb-2 flex-col">
                <h1 className="font-normal text-[15px]">
                  File<span className="text-[#df5c88]">*</span>
                </h1>
                <span className="text-gray-400 font-light max-md:text-[14px] md:text-[10px] lg:text-[14px]">
                  File types supported: jpg, png, jpeg
                </span>
              </label>
              <div className="relative bg-white/50 dark:bg-[#2F2E3E] p-4 rounded-lg w-full h-[270px] md:h-[320px]">
                {uploadedImage && (
                  <button
                    type="button"
                    className="absolute -top-3 -right-3 w-8 h-8 bg-[#DC3545] hover:bg-[#BB2D3B] transition-all duration-200 rounded-full flex items-center justify-center text-white"
                    onClick={handleImageDelete}
                  >
                    X
                  </button>
                )}
                <div
                  className={`flex items-center justify-center w-full h-full border-2 border-dashed border-gray-600 rounded-lg relative cursor-pointer`}
                  onClick={
                    () => handleFileClick(fileInputRef)
                    // !uploadedAnimation && handleFileClick(fileInputRef)
                  }
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".jpg, .png, .jpeg, .mp3, .mp4"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, "image")}
                    // disabled={!!uploadedAnimation}
                  />
                  {uploadedImage ? (
                    <Uploader uploadedImage={uploadedImage} />
                  ) : (
                    <Image
                      src="/Upload.png"
                      alt="Upload"
                      width={150}
                      height={150}
                    />
                  )}
                </div>
              </div>
            </div>
            {/* <div>
              <label className="flex flex-col mb-2">
                <h1 className="font-normal text-[15px]">Animation File</h1>
                <span className="text-gray-400 font-light max-md:text-[14px] md:text-[10px] lg:text-[14px]">
                  File types supported: GIF
                </span>
              </label>
              <div className="relative bg-[#2F2E3E] p-4 rounded-lg w-full h-[270px] md:h-[320px]">
                {uploadedAnimation && (
                  <button
                    type="button"
                    className="absolute -top-3 -right-3 w-8 h-8 bg-[#DC3545] hover:bg-[#BB2D3B] transition-all duration-200 rounded-full flex items-center justify-center text-white"
                    onClick={handleAnimationDelete}
                  >
                    X
                  </button>
                )}
                <div
                  className={`flex items-center justify-center w-full h-full border-2 border-dashed border-gray-600 rounded-lg relative ${
                    uploadedImage
                      ? "opacity-50 !cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() =>
                    !uploadedImage && handleFileClick(animationFileInputRef)
                  }
                >
                  <input
                    type="file"
                    ref={animationFileInputRef}
                    accept=".gif"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, "animation")}
                    disabled={!!uploadedImage}
                  />
                  {uploadedAnimation ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={URL.createObjectURL(uploadedAnimation)}
                        alt="Uploaded Animation"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  ) : (
                    <Image
                      src="/Upload.png"
                      alt="Upload"
                      width={150}
                      height={150}
                    />
                  )}
                </div>
              </div>
            </div> */}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm sm:text-base">
              Name<span className="text-[#df5c88]">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 bg-transparent border border-[#2E2E3E] rounded-md"
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm sm:text-base">
              Category<span className="text-[#df5c88]">*</span>
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-white dark:bg-[#242333] border border-[#2E2E3E] rounded-md"
            >
              <option value="">Select One</option>
              <option value="art">Art</option>
              <option value="gaming">Gaming</option>
              <option value="music">Music</option>
              <option value="fashion">Fashion</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm sm:text-base">
              Collection<span className="text-[#df5c88]">*</span>
            </label>
            <select
              required
              value={nftValue}
              onChange={handleChange1}
              className="w-full p-3 bg-white dark:bg-[#242333] border border-[#2E2E3E] rounded-md"
            >
              <option value="">Select Collection</option>
              {collection?.map((item, idx) => (
                <option key={idx} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm sm:text-base">
              Description
            </label>
            <textarea
              className="w-full p-3 bg-transparent border border-[#2E2E3E] rounded-md"
              placeholder="Provide A Description Of Your Item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            ></textarea>
          </div>
          <div className="my-4">
            <div className="flex justify-between items-center mb-10">
              <label className="flex gap-4 items-center mb-2 text-sm sm:text-base">
                <Image src={"/list.png"} alt="list" width={20} height={20} />
                Custom Data
              </label>
              <button
                type="button"
                className="mt-2 px-4 py-2 border border-[#635959] rounded-sm dark:text-white"
                onClick={handleAddCustomData}
              >
                +
              </button>
            </div>
            {customData.map((data, index) => (
              <div key={index} className="mb-4 flex items-center">
                <input
                  type="text"
                  className="w-1/2 p-2 bg-transparent border mx-1 border-[#2E2E3E]"
                  placeholder="Key"
                  value={data.key}
                  onChange={(e) =>
                    handleCustomDataChange(index, "key", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="w-1/2 p-2 bg-transparent mx-1 border border-[#2E2E3E]"
                  placeholder="Value"
                  value={data.value}
                  onChange={(e) =>
                    handleCustomDataChange(index, "value", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 mx-1 transition-all duration-200 w-12 p-2"
                  onClick={() => handleRemoveCustomData(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              disabled={loading}
              type="submit"
              className="px-6 my-3 mt-10 py-3 w-full bg-blue-500 hover:bg-blue-600 rounded-full text-white"
            >
              {!loading ? "Mint NFT" : "Please wait ..."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
