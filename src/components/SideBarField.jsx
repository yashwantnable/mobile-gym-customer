import React from "react";
import { IoClose } from "react-icons/io5";

const SidebarField = ({
  children,
  button0,
  button1,
  button2,
  title,
  title_style,
  handleClose,
  left = false,
  footer = true,
  close = true,
  padding,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 z-10 bg-white shadow-xl transition-transform duration-300 ${
          left ? "left-0 -translate-x-full" : "right-0 translate-x-full"
        } w-full max-w-md h-screen flex flex-col transform ${
          left ? "!translate-x-0" : "!translate-x-0"
        }`}
      >
        <header
          className={`border-b border-gray-300 p-5 flex justify-between items-center ${
            title_style ? title_style : "text-lg"
          }`}
        >
          <div className="font-semibold">{title}</div>
          {close && (
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={handleClose}
            >
              <IoClose size={24} />
            </button>
          )}
        </header>

        <main className={`flex-1 overflow-y-auto ${padding ? padding : "p-5"}`}>
          {children}
        </main>

        {footer && (
          <footer className="border-t border-gray-300 p-5 flex justify-end gap-3">
            {button2}
            {button1}
          </footer>
        )}
      </div>
    </div>
  );
};

export default SidebarField;
