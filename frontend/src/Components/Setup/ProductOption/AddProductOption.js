import React, { useState } from "react";
import axiosInstance from "../../../axiosAPI";

function AddProductOption() {
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState(0);

  const options = [
    {
      name: "Variant",
    },
    {
      name: "Add On",
    },
    // {
    //     name:"Variant"
    // },
    // {
    //     name:"Variant"
    // },
    // {
    //     name:"Variant"
    // }
  ];

  const submitData = (e) => {
    e.preventDefault();

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    if (type == "Variant") {
      axiosInstance
        .post(`/items/variants/?hotel=${hotel_id}`, {
          variant_value: value,
          variant_desc: desc,
          hotel: hotel_id,
          price: parseInt(price ? price : 0),
        })
        .then((res) => {
          window.location.href = "/setup/viewProductOptions";
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type == "Add On") {
      axiosInstance
        .post(`/items/add_on/?hotel_id=${hotel_id}`, {
          add_on_value: value,
          add_on_desc: desc,
          hotel: hotel_id,
          price: parseInt(price ? price : 0),
        })
        .then((res) => {
          window.location.href = "/setup/viewProductOptions";
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Add Product Option</h1>
      <div className=" my-4 flex ">
        <div className="m-4 w-1/3">
          <h1 className="font-semibold text-lg">
            Your Product Option Details{" "}
          </h1>
          <p className="mb-2">
            Customers can opt for these customizable options while ordering
            food.
          </p>
        </div>
        <div className="m-4 w-2/3 flex flex-col bg-white p-4 rounded-md">
          <label> Value</label>
          <input
            type="text"
            className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <label> Description</label>
          <input
            type="text"
            className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <label> Price</label>
          <input
            type="text"
            className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label> Type of Option</label>
          <select
            id="role"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
          >
            <option selected>Choose Option</option>

            {options.map((b, i) => (
              <option value={b.name}>{b.name}</option>
            ))}
          </select>
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

export default AddProductOption;
