import React from "react";

const Appbar = () => {
  return (
    <div className="flex justify-between bg-white px-80 py-2 border-b-blue-500 shadow-md">
      <div className="flex items-center text-3xl">
        <span className="text-blue-400 font-extrabold">paytm </span>App
      </div>
      <div className="flex items-center text-2xl space-x-4">
        <span>Hello...</span>
        <img
          style={{
            width: "60px",
            height: "60px",
          }}
          src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
          alt="user"
        />
      </div>
    </div>
  );
};

export default Appbar;
