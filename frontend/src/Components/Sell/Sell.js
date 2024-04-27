import React, { useState } from "react";
import Incoming from "./Incoming";
import Orders from "./Orders";
import Current from "./Current";

function Sell() {
  const [type, setType] = useState("Orders");
  const [current, setCurrent] = useState("");
  const [tableIndex, setTableIndex] = useState(null)
  const [deliveryType, setDeliveryType] = useState()

  return (
    <div>
      <div className="flex items-start">
        <h1 className="w-full text-2xl font-semibold">Take Orders</h1>
      </div>

      <div className="-mx-3 sm:-mx-6 px-4 sm:px-8 pt-4 pb-3">
        <div className="inline-block min-w-full shadow-md rounded-lg">
          <div className="bg-[#f9fafb] flex items-center justify-between">
            <div>
              <button
                className={`p-2 ${
                  type === "Incoming"
                    ? "bg-white font-semibold"
                    : "bg-[#f9fafb]"
                } border`}
                onClick={(e) => {
                  e.preventDefault();
                  setType("Incoming");
                }}
              >
                Incoming
              </button>
              <button
                className={`p-2 ${
                  type === "Orders" ? "bg-white font-semibold" : "bg-[#f9fafb]"
                } border`}
                onClick={(e) => {
                  e.preventDefault();
                  setType("Orders");
                }}
              >
                Orders
              </button>
              <button
                className={`p-2 ${
                  type === "Current" ? "bg-white font-semibold" : "bg-[#f9fafb]"
                } border`}
                onClick={(e) => {
                  e.preventDefault();
                  setType("Current");
                }}
                disabled
              >
                Current
              </button>
            </div>

            {
              type==="Orders"?<div className="flex items-center justify-between mx-2">
              <span className="mx-2 block w-2 h-2 rounded-full bg-green-500">
                &nbsp;
              </span>
              <p>Free</p>
              <span className="mx-2 block w-2 h-2 rounded-full bg-yellow-500">
                &nbsp;
              </span>
              <p>In Transit</p>
              <span className="mx-2 block w-2 h-2 rounded-full bg-red-500">
                &nbsp;
              </span>
              <p>Taken</p>
            </div>: type==="Current" ? <div className="flex items-center justify-between mx-2">
              <span className="mx-2 block w-2 h-2 rounded-full bg-green-500">
                &nbsp;
              </span>
              <p>Veg</p>
              <span className="mx-2 block w-2 h-2 rounded-full bg-yellow-500">
                &nbsp;
              </span>
              <p>Egg</p>
              <span className="mx-2 block w-2 h-2 rounded-full bg-red-500">
                &nbsp;
              </span>
              <p>Non Veg</p>
              <span className="mx-2 block w-2 h-2 rounded-full bg-blue-500">
                &nbsp;
              </span>
              <p>Others</p>
            </div>:<></>
            }


            
          </div>

          {type === "Incoming" ? (
            <Incoming />
          ) : type === "Orders" ? (
            <Orders type={type} setType={setType} setCurrent={setCurrent} tableIndex={tableIndex} setTableIndex={setTableIndex} setDeliveryType={setDeliveryType} />
          ) : (
            <Current type={type} current={current} tableIndex={tableIndex} deliveryType={deliveryType} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Sell;
