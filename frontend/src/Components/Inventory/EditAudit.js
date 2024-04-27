import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI";

function EditAudit({ editObject }) {
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState();

  const submitData = (e) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    let itemData = {
      quantity: quantity,
      hotel: hotel_id,
      id: editObject.id,
    };

    axiosInstance
      .put(`rent/${editObject.id}/`, itemData)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <p className="mb-2">Existing Quantity : {editObject.quantity}</p>
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

          {["Create", "Damaged","Sold"].map((b, i) => (
            <option value={b}>{b}</option>
          ))}
        </select>
      </div>
      
      <button
        className="w-18 bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
        onClick={(e) => {
          submitData(e);
        }}
      >
        Submit
      </button>
      {/* <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
            <BiRupee className="text-gray-400 border-r" /> */}
    </div>
  );
}

export default EditAudit;
