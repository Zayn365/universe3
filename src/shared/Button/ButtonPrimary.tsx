import Button, { ButtonProps } from "@/shared/Button/Button";
import React from "react";

export interface ButtonPrimaryProps extends ButtonProps {}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = "",
  loading,
  ...args
}) => {
  console.log(loading, "BTN LOADER");
  return (
    <Button
      disabled={loading}
      className={`ttnc-ButtonPrimary ${
        loading ? "!bg-gray-500 cursor-not-allowed" : ""
      } disabled:bg-opacity-70 bg-primary-6000 hover:bg-primary-700 text-neutral-50 ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
