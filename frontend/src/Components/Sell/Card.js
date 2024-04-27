import React from "react";

function Card({ data, type, index }) {
  return type === "Orders" ? (
    <div
      className={`w-32 h-32 p-2 cursor-pointer border border-b-4 shadow-[0px 5px 20px 1px] rounded-md flex items-center justify-center text-center ${
        data.progress === "free"
          ? "border-b-green-500"
          : data.progress === "occupied"
          ? "border-b-red-500"
          : "border-b-yellow-500"
      } `}
    >
      Table {index}
    </div>
  ) : (
    <div
      className={`
    w-44 h-44 p-2 cursor-pointer border border-b-4 shadow-[0px 5px 20px 1px] rounded-md flex flex-col items-center justify-center text-center ${
      data.item_category_name === "Veg"
        ? "border-b-green-500"
        : data.item_category_name === "Non Veg" ||
          data.item_category_name === "Non-Veg" ||
          data.item_category_name === "NV"
        ? "border-b-red-500"
        : data.item_category_name === "Egg"
        ? "border-b-yellow-500"
        : "border-b-blue-500"
    }
    `}
    >
      {typeof data.quantity === typeof 1 ? (
        <p>
          {`${data.name}(`}
          <span className="text-sm">{data.quantity}</span>
          {`)`}
        </p>
      ) : (
        <p>{data.name}</p>
      )}
      <br />
      <p className="text-sm">
        {data.net_price === 0 ? "" : `₹${data.net_price}`}
      </p>
    </div>
  );
}

export default Card;
