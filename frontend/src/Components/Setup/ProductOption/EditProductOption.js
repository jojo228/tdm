import React, { useEffect, useState } from "react";
import axiosInstance from './../../../axiosAPI';

function EditProductOption({ showModal, setShowModal, editDetails }) {
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
  ];

  useEffect(() => {
    if (editDetails) {
      if (editDetails.add_on_id) {
        setValue(editDetails.add_on_value);
        setDesc(editDetails.add_on_desc);
        setType("Add On");
        setPrice(editDetails.price);
      } else {
        console.log(editDetails);
        setValue(editDetails.variant_value);
        setDesc(editDetails.variant_desc);
        setType("Variant");
        setPrice(editDetails.price);
      }
    }
  }, [editDetails]);

  const editProductOption = (e) => {
    e.preventDefault();

    let hotel_id = localStorage.getItem("hotel_id");

    let data = {
      hotel: hotel_id,
      price: parseInt(price),
    };

    if (editDetails.variant_id) {
      data["variant_id"] = editDetails.variant_id;
      data["variant_value"] = value;
      data['variant_desc']=desc;
    }

    if (editDetails.add_on_id) {
      data["add_on_id"] = editDetails.add_on_id;
      data["add_on_value"] = value;
      data["add_on_desc"]=desc;
    }

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    if (editDetails.variant_id) {
      axiosInstance
        .put(
          `/update_delete_variant/${parseInt(editDetails.variant_id)}/`,
          data
        )
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axiosInstance
        .put(`/update_delete_addon/${parseInt(editDetails.add_on_id)}/`, data)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {showModal ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-black opacity-40"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
              <div className="mt-3 sm:flex">
                <div className="mt-2 w-full text-center sm:ml-4 sm:text-left">
                  <h4 className="text-lg font-medium text-gray-800">
                    Edit Product Options
                  </h4>

                  <div className="border my-4"></div>

                  <div>
                    <div className="-mx-3 sm:-mx-6 px-4 sm:px-8 pt-2 pb-3">
                      <div className="inline-block min-w-full  rounded-lg">
                        <div className="bg-white ">
                          <div className=" w-full p-2 flex flex-col mb-3">
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
                            {/* <label> Type of Option</label>
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
                            </select> */}
                          </div>
                        </div>
                        <div className="my-4  flex items-center justify-around">
                          <button
                            className="border-2 border-dark-purple rounded-full px-12 py-2 inline-block font-semibold hover:bg-dark-purple hover:text-white"
                            onClick={(e) => {
                              editProductOption(e);
                            }}
                          >
                            Edit Product Option
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default EditProductOption;
