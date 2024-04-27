import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosAPI";

function AddProductCategory() {
  const [name, setName] = useState("");

  const submitData = (e) => {
    e.preventDefault();
    let hotel_id=localStorage.getItem('hotel_id')

    var pcData = {
      hotel_id: hotel_id,
      item_category_name: name,
    };

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance
      .post(`/hotel/item_category/?hotel=${hotel_id}`, pcData)
      .then((res) => {
        window.location.href = "/setup/viewProductCategories";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Add Product Category</h1>
      <div className=" my-4 flex ">
        <div className="m-4 w-1/3">
          <h1 className="font-semibold text-lg">
            Your Product Category Details{" "}
          </h1>
          <p className="mb-2">
            Products will be grouped under these categories in the register.
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
          <button
            className=" w-fit h-fit bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
            onClick={(e) => {
              submitData(e);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProductCategory;
