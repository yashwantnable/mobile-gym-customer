import React from "react";

const Button = ({ type, text, onClick, cssClass, disable }) => {
  return (
    <button
      type={type}
      disabled={disable}
      className={`${disable && "cursor-not-allowed"}
        ${text === "Cancel" ? " border cursor-pointer" : "btn-border"}  ${
        cssClass ? cssClass : "px-10 py-2"
      } ${
        text === "Save" || "Upadte"
          ? "bg-primary text-white cursor-pointer"
          : ""
      }  capitalize  rounded-full text-sm font-bold w-fit h-fit`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export const SecondaryButton = ({
  text,
  onClick,
  padding,
  textColor,
  borderColor,
}) => {
  return (
    <button
      type="button"
      className={` border  ${
        borderColor ? borderColor : "border-buttonColor"
      }  ${
        textColor ? textColor : "text-buttonColor"
      } hover:bg-buttonColor hover:text-secondaryColor  capitalize font-bold  text-[12px] rounded-full h-fit w-fit ${
        padding ? padding : "px-3"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export const CommonButton = ({
  text,
  type = "button",
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "  font-semibold rounded-full cursor-pointer transition-all duration-300";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-secondary text-primary hover:bg-secondary-dark",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
  };

  const disabledStyles = "bg-gray-400 text-black cursor-not-allowed";
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${
        disabled ? disabledStyles : variants[variant] || "bg-primary text-white"
      } ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
