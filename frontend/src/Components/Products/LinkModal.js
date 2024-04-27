import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI";

function LinkModal({ edit, openLinkModal, setOpenLinkModal, link }) {
  const [variants, setVariants] = useState([]);
  const [addOns, setAddOns] = useState([]);

  const [variant, setVariant] = useState([0]);
  const [addOn, setAddOn] = useState([0]);

  const [editId, setEditId] = useState();

  const handleInputChange = (e, index, type) => {
    if (type === "variant") {
      const list = [...variant];
      list[index] = parseInt(e.target.value);
      setVariant(list);
    } else {
      const list = [...addOn];
      list[index] = parseInt(e.target.value);
      setAddOn(list);
    }
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index, type) => {
    if (type === "variant") {
      let len = variant.length;
      const list = [...variant];
      list.splice(index, 1);
      setVariant(list);
      if (len == 1) {
        setVariant([""]);
      }
    } else {
      let len = addOn.length;
      const list = [...addOn];
      list.splice(index, 1);
      setAddOn(list);
      if (len == 1) {
        setAddOn([""]);
      }
    }
  };

  // handle click event of the Add button
  const handleAddClick = (type) => {
    if (type === "variant") {
      setVariant([...variant, 0]);
    } else {
      setAddOn([...addOn, 0]);
    }
  };

  const getVariants = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    await axiosInstance
      .get(`/items/variants/?hotel=${hotel_id}`)
      .then((res) => {
        setVariants(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAddons = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;
    let hotel_id = localStorage.getItem("hotel_id");

    await axiosInstance
      .get(`/items/add_on/?hotel=${hotel_id}`)
      .then((res) => {
        setAddOns(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitDetails = (e) => {
    e.preventDefault();

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    let uniqueVariants = variant.filter(function (val) {
      return val !== 0;
    });
    uniqueVariants = [...new Set(uniqueVariants)];

    let uniqueAddons = addOn.filter(function (val) {
      return val !== 0;
    });
    uniqueAddons = [...new Set(uniqueAddons)];

    let data = {
      hotel: hotel_id,
      item_id: link.id,
      variant: uniqueVariants,
      item_add_on: uniqueAddons,
    };

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance
      .post(`/items/variants/add_on/?hotel=${hotel_id}`, data)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editDetails = (e) => {
    e.preventDefault();

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    let uniqueVariants = variant.filter(function (val) {
      return val !== 0;
    });
    uniqueVariants = [...new Set(uniqueVariants)];

    let uniqueAddons = addOn.filter(function (val) {
      return val !== 0;
    });
    uniqueAddons = [...new Set(uniqueAddons)];

    let data = {
      hotel: hotel_id,
      item_id: link.id,
      variant: uniqueVariants,
      item_add_on: uniqueAddons,
    };

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance
      .put(`/items/variants/add_on/${editId}/?hotel=${hotel_id}`, data)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getVariants();
    getAddons();
  }, []);

  useEffect(() => {
    console.log(edit);
    if (edit) {
      axiosInstance.defaults.headers["Authorization"] =
        "Bearer " + localStorage.access_token;

      let hotel_id = parseInt(localStorage.getItem("hotel_id"));

      axiosInstance
        .get(`/product/variants/addons/?hotel=${hotel_id}&product=${link.id}`)
        .then((response) => {
          setEditId(response.data[0].id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [edit]);

  return (
    <>
      {openLinkModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => setOpenLinkModal(false)}
            ></div>
            <div className="flex items-center min-h-screen px-8 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                <div className="flex flex-col mt-3 sm:flex">
                  {link.net_price === 0 ? (
                    <>
                      <h3 className="text-xl font-semibold">
                        {edit ? "Edit variants" : "Add variants"}
                      </h3>
                      {variant.map((x, i) => {
                        return (
                          <div className="w-full my-2 flex items-center justify-around">
                            <select
                              id="variants"
                              value={x}
                              onChange={(e) =>
                                handleInputChange(e, i, "variant")
                              }
                              className={`form-control w-full block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                            >
                              <option selected>Choose Variant</option>

                              {variants.map((b, i) => (
                                <option value={b.variant_id}>
                                  {b.variant_value} {b.variant_desc?` - ${b.variant_desc}`:''}
                                </option>
                              ))}
                            </select>
                            <div className="w-full ml-8">
                              <button
                                className="mr10"
                                onClick={() => handleRemoveClick(i, "variant")}
                              >
                                Remove
                              </button>

                              {variant.length - 1 === i && (
                                <button
                                  className="ml-8"
                                  onClick={() => {
                                    handleAddClick("variant");
                                  }}
                                >
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <></>
                  )}
                  {/* <div style={{ marginTop: 20 }}>{JSON.stringify(variant)}</div> */}
                  <h3 className="text-xl font-semibold">
                    {edit ? "Edit AddOns" : "Add AddOns"}
                  </h3>
                  {addOn.map((x, i) => {
                    return (
                      <div className="w-full my-2 flex items-center justify-around">
                        <select
                          id="addOn"
                          value={x}
                          onChange={(e) => handleInputChange(e, i, "addOn")}
                          className={`form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                        >
                          <option selected>Choose AddOn</option>

                          {addOns.map((b, i) => (
                            <option value={b.add_on_id}>
                              {b.add_on_value} - {b.add_on_desc}
                            </option>
                          ))}
                        </select>
                        <div className="w-full ml-8">
                          <button
                            className="mr10"
                            onClick={() => handleRemoveClick(i, "addOn")}
                          >
                            Remove
                          </button>

                          {addOn.length - 1 === i && (
                            <button
                              className="ml-8"
                              onClick={() => {
                                handleAddClick("addon");
                              }}
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* <div style={{ marginTop: 20 }}>{JSON.stringify(addOn)}</div> */}
                  <div className="my-4 h-full flex ">
                    <button
                      className="w-18 h-18 bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
                      onClick={(e) => {
                        if (edit) {
                          editDetails(e);
                        } else {
                          submitDetails(e);
                        }
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default LinkModal;
