import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Select from "react-select";

const InputField = ({
  label,
  name,
  type,
  value,
  onChange,
  readOnly,
  onBlur,
  placeholder,
  error,
  isRequired,
  options,
  isMulti = false,
  leftIcon,
  ...props
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDarkMode ? "#1f2633" : "#fff",
      borderColor: error ? "red" : "#d1d5db",
      color: isDarkMode ? "#fff" : "#000",
      boxShadow: state.isFocused ? "none" : "none",
      "&:hover": {
        borderColor: error ? "red" : "",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode ? "#fff" : "#000",
      textTransform: "capitalize",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isDarkMode ? "#9ca3af" : "#6b7280",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? isDarkMode
          ? "#1f2633"
          : "#e5e7eb"
        : isDarkMode
        ? "#1f2633"
        : "transparent",
      color: isDarkMode ? "#fff" : "#000",
      textTransform: "capitalize",
      "&:hover": {
        backgroundColor: isDarkMode ? "#4b5563" : "#d1d5db",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#6b7280",
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: "150px", // controls dropdown max height
      overflowY: "auto", // enables vertical scrollbar
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "150px",
      overflowY: "auto",
    }),
  };

  const handleSelectChange = (selectedOption) => {
    if (isMulti) {
      onChange({
        target: {
          name,
          value: selectedOption
            ? selectedOption.map((option) => option.value)
            : [],
        },
      });
    } else {
      onChange({
        target: {
          name,
          value: selectedOption ? selectedOption.value : "",
        },
      });
    }
  };

  const handleCheckboxChange = (e) => {
    onChange({
      target: {
        name,
        value: e.target.checked,
      },
    });
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-gray-700 dark:bg-themeBG dark:text-themeText font-medium mb-2"
      >
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>

      {type === "select" ? (
        <Select
          id={name}
          name={name}
          value={
            isMulti
              ? options?.filter((option) => value.includes(option.value))
              : options?.find((option) => option.value === value) || ""
          }
          onChange={handleSelectChange}
          onBlur={onBlur}
          options={options}
          placeholder={placeholder || `${label}`}
          isMulti={isMulti}
          className="w-full dark:black"
          styles={customStyles}
          {...props}
        />
      ) : type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-lg outline-none dark:bg-themeBG dark:text-themeText"
          {...props}
        />
      ) : type === "checkbox" ? (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={value}
            onChange={handleCheckboxChange}
            onBlur={onBlur}
            className="mr-2"
            {...props}
          />
          <label htmlFor={name} className="text-gray-700">
            {label}
          </label>
        </div>
      ) : (
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}
          <input
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`w-full ${
              leftIcon ? "pl-10" : "px-4"
            } py-2 border rounded-lg outline-none dark:bg-themeBG dark:text-themeText border-gray-300`}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 "
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          )}
        </div>
      )}

      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default InputField;
