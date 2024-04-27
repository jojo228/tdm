import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import axiosInstance from "../../../axiosAPI";

function AddTaxGroup() {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");

  const createTax = (e) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;
    let hotel_id = localStorage.getItem("hotel_id");

    const taxData = {
      tax_group_name: name,
      tax_value: percentage,
      hotel_id: hotel_id,
    };
    axiosInstance
      .post("/add_tax/", taxData)
      .then((res) => {
        window.location.href = "/setup/viewTax";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Add Taxes</h1>
      <div className=" my-4 flex ">
        <div className="m-4 w-1/3">
          <h1 className="font-semibold text-lg mb-2">
            Setup Taxes and Tax Groups
          </h1>
          <p className="mb-2">
            Create separate taxes for different tax rates and types
          </p>
        </div>
        <div className="m-4 w-2/3 flex flex-col bg-white p-4 rounded-md">
          <label> Name</label>
          <input
            type="text"
            className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label> Percentage</label>
          <input
            type="text"
            className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Tax Percentage"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />
          <button
            className=" w-fit h-fit bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
            onClick={(e) => {
              createTax(e);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTaxGroup;
