import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import EditProductOption from "./EditProductOption";
import axiosInstance from './../../../axiosAPI';
import Pagination from "../../UI/Pagination";

function ProductOptions() {
  const [variants, setVariants] = useState([]);

  const [variantGroups, setVariantGroups] = useState([]);

  const [addOns, setAddOns] = useState([]);

  const [addOnGroups, setAddOnGroups] = useState([]);

  const [itemGroups, setItemGroups] = useState([]);

  const [type, setType] = useState("variants");

  const tableHeaders = {
    variants: ["Value", "Description", "Price", "Actions"],
    // variantGroups: ["Value", "Description", "Price", "Actions"],
    addOns: ["Value", "Description", "Price", "Actions"],
    // addOnGroups: ["Value", "Description", "Price", "Actions"],
    // itemGroups: ["Value", "Description", "Price", "Actions"],
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setVariantsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [filteredVariants, setFilteredVariants] = useState([]);

  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;

  const [currentItems, setCurrentItems] = useState([]);

  //   const currentVariants =
  //     search === ""
  //       ? variants.slice(indexOfFirstReceipt, indexOfLastReceipt)
  //       : filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt);

  useEffect(() => {
    if (type === "variants") {
      if (search !== "") {
        const newVariants = variants.filter((value) =>
          value.variant_value.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredVariants(newVariants);
      }

      setCurrentItems(
        search === ""
          ? variants.slice(indexOfFirstReceipt, indexOfLastReceipt)
          : filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt)
      );
    } else if (type === "variantGroups") {
      if (search !== "") {
        const newVariants = variantGroups.filter((value) =>
          value.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredVariants(newVariants);
      }

      setCurrentItems(
        search === ""
          ? variantGroups.slice(indexOfFirstReceipt, indexOfLastReceipt)
          : filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt)
      );
    } else if (type === "addOns") {
      if (search !== "") {
        const newVariants = addOns.filter((value) =>
          value.add_on_value.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredVariants(newVariants);
      }

      setCurrentItems(
        search === ""
          ? addOns.slice(indexOfFirstReceipt, indexOfLastReceipt)
          : filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt)
      );
    } else if (type === "addOnGroups") {
      if (search !== "") {
        const newVariants = addOnGroups.filter((value) =>
          value.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredVariants(newVariants);
      }

      setCurrentItems(
        search === ""
          ? addOnGroups.slice(indexOfFirstReceipt, indexOfLastReceipt)
          : filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt)
      );
    } else {
      if (search !== "") {
        const newVariants = itemGroups.filter((value) =>
          value.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredVariants(newVariants);
      }

      setCurrentItems(
        search === ""
          ? itemGroups.slice(indexOfFirstReceipt, indexOfLastReceipt)
          : filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt)
      );
    }
  }, [type, search, variants, addOns, variantGroups, addOnGroups, itemGroups,currentPage]);

  useEffect(() => {
    setCurrentItems(
      filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt)
    );
  }, [filteredVariants]);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  const getTotal = () => {
    if (type === "variants") {
      return variants.length;
    } else if (type === "variantGroups") {
      return variantGroups.length;
    } else if (type === "addOns") {
      return addOns.length;
    } else if (type === "addOnGroups") {
      return addOnGroups.length;
    } else {
      return itemGroups.length;
    }
  };

  const getVariants = async () => {
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

  // const getVariantGroups = async () => {
  //   await axiosInstance
  //     .get("/items/variants/?hotel=1&group=1 KG")
  //     .then((res) => {
  //       setVariants(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const getItemGroups = async () => {
  //   await axiosInstance
  //     .get("/items/variants/?hotel=1")
  //     .then((res) => {
  //       setVariants(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  useEffect(() => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    getVariants();
    getAddons();
    // getVariantGroups();
    // getAddonGroups();
    // getItemGroups();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [type]);

  const [showModal, setShowModal] = useState(false);
  const [editDetails, setEditDetails] = useState(null);

  const deleteProductOption = (e, item) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    if (item.variant_id) {
      axiosInstance
        .delete(`/update_delete_variant/${parseInt(item.variant_id)}/`)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }else{
      axiosInstance
      .delete(`/update_delete_addon/${parseInt(item.add_on_id)}/`)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };

  return (
    <div>
      <div className="flex items-start">
        <h1 className="w-full text-2xl font-semibold">Product Options</h1>

        <Pagination
          perPage={perPage}
          total={getTotal()}
          paginateBack={paginateBack}
          paginateFront={paginateFront}
          currentPage={currentPage}
        />
      </div>

      <div className="-mx-3 sm:-mx-6 px-4 sm:px-8 pt-4 pb-3">
        <div className="inline-block min-w-full shadow-md rounded-lg">
          <div className="bg-[#f9fafb]">
            <button
              className={`p-2 ${
                type === "variants" ? "bg-white font-semibold" : "bg-[#f9fafb]"
              } border`}
              onClick={(e) => {
                e.preventDefault();
                setType("variants");
              }}
            >
              Variants
            </button>
            <button
              className={`p-2 ${
                type === "addOns" ? "bg-white font-semibold" : "bg-[#f9fafb]"
              } border`}
              onClick={(e) => {
                e.preventDefault();
                setType("addOns");
              }}
            >
              AddOns
            </button>
            {/* <button
              className={`p-2 ${
                type === "variantGroups"
                  ? "bg-white font-semibold"
                  : "bg-[#f9fafb]"
              } border`}
              onClick={(e) => {
                e.preventDefault();
                setType("variantGroups");
              }}
            >
              Variant Groups
            </button>         
            <button
              className={`p-2 ${
                type === "addOnGroups"
                  ? "bg-white font-semibold"
                  : "bg-[#f9fafb]"
              } border`}
              onClick={(e) => {
                e.preventDefault();
                setType("addOnGroups");
              }}
            >
              AddOn Groups
            </button>
            <button
              className={`p-2 ${
                type === "itemGroups"
                  ? "bg-white font-semibold"
                  : "bg-[#f9fafb]"
              } border`}
              onClick={(e) => {
                e.preventDefault();
                setType("itemGroups");
              }}
            >
              Item Groups
            </button> */}
          </div>

          <form>
            <label
              for="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border-none outline-none rounded-lg bg-gray-50 "
                placeholder="Search Name"
                required
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <div>
            <Link
              to="/addProductOption"
              title="Add"
              className=" cursor-pointer fixed z-90 bottom-10 right-8 bg-dark-purple w-10 h-10 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl "
            >
              &#43;
            </Link>
          </div>

          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                {tableHeaders[type].map((header, index) => (
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order, index) => (
                <tr>
                  {order.add_on_value && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <a
                        className="text-[#4338ca] whitespace-no-wrap"
                        href="/rn1000"
                      >
                        {order.add_on_value}
                      </a>
                    </td>
                  )}

                  {order.variant_value && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <a
                        className="text-[#4338ca] whitespace-no-wrap"
                        href="/rn1000"
                      >
                        {order.variant_value}
                      </a>
                    </td>
                  )}
                  {order.add_on_desc !== undefined && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.add_on_desc ? order.add_on_desc : "-"}
                      </p>
                    </td>
                  )}
                  {order.variant_desc !== undefined && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.variant_desc ? order.variant_desc : "-"}
                      </p>
                    </td>
                  )}
                  {order.price !== undefined && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.price}
                      </p>
                    </td>
                  )}

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex w-[60px] justify-around items-center">
                      <GrEdit
                        size={16}
                        onClick={(e) => {
                          // setName(order.item_category_name);
                          // setEditId(order.item_category_id);
                          setEditDetails(order);
                          setShowModal(true);
                        }}
                      />
                      <AiFillDelete
                        color="red"
                        size={16}
                        onClick={(e) => deleteProductOption(e, order)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <EditProductOption
        showModal={showModal}
        setShowModal={setShowModal}
        editDetails={editDetails}
      />
    </div>
  );
}

export default ProductOptions;
