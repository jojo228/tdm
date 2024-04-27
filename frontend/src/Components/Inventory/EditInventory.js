import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI";
import { useSelector } from "react-redux";

function EditInventory({ editObject }) {
  const options = {
    created: "Product Initially created",
    sales: "Product Sold",
    dispose: "Product Expired",
    rework_decr: "Rework from store to the kitchen",
    rework_incr: "Rework done... from kitchen back to store",
    refill: "Product Refillment",
  };

  const [quantity, setQuantity] = useState(0);
  const [date, setDate] = useState();
  const [type, setType] = useState();

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (editObject) {
      setQuantity(editObject.quantity);
      setDate(editObject.expiry_date);
    }
  }, editObject);

  const submitData = (e) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    let itemData = {
      quantity: quantity,
      hotel: hotel_id,
      id: editObject.id,
      user: auth.user.user_id,
      product_id: editObject.product_id,
      variant: editObject.variant,
      action: type,
      expiry_date: date,
    };

    console.log(itemData);

    axiosInstance
      .put(`inventory/${editObject.id}/`, itemData)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <p className="mb-2">Quantity</p>
      <div className="p-1 flex items-center mb-3 border border-solid ">
        <input
          type="number"
          className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
          }}
        />
      </div>
      <p className="mb-2">Expiry Date</p>
      <div className="p-1 flex items-center mb-3 border border-solid ">
        <input
          type="date"
          className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
          placeholder="Expiry Date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
      </div>
      <div className="flex w-full items-center mb-3">
        <select
          id="types"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
        >
          <option disabled selected>
            Reason
          </option>

          {Object.entries(options).map((b, i) => (
            <option value={b[0]}>{b[1]}</option>
          ))}
        </select>
      </div>
      <div className="m-4 ml-0 flex ">
        <button
          className="bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
          onClick={(e) => {
            submitData(e);
          }}
        >
          Submit
        </button>
      </div>
      {/* <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
            <BiRupee className="text-gray-400 border-r" /> */}
    </div>
  );
}

export default EditInventory;
