import React, { useEffect, useState } from "react";
import Pagination from "../UI/Pagination";
import { Link } from "react-router-dom";
import axiosInstance from "./../../axiosAPI";
import { GrEdit } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import Modal from "./Modal";
import { BiLink } from "react-icons/bi";
import LinkModal from "./LinkModal";
import { BsDownload, BsUpload } from "react-icons/bs";
import Multiselect from "../../utils/Multiselect";

function ViewProduct() {
  const [uploading, setUploading] = useState(false);

  const [filters, setFilters] = useState([
    "Name",
    "Category",
    "Tax Group",
    "Price",
    "Variants",
    "Addons",
  ]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setProductsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState("name");

  const [editModal, setEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [linkItem, setLinkItem] = useState(null);
  const [openLinkModal, setOpenLinkModal] = useState(false);

  const [editOptions, setEditOptions] = useState(false);

  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;
  const currentProducts =
    search === ""
      ? products.slice(indexOfFirstReceipt, indexOfLastReceipt)
      : filteredProducts.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  const getAllData = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/items/?id=${hotel_id}`)
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DeleteProduct = (e, deleteId) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance
      .delete(`/items/delete/${deleteId}/`)
      .then((res) => {
        window.location.href = "/products";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategories = async () => {
    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    await axiosInstance
      .get(`/hotel/item_category/?id=${hotel_id}`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllData();
    getCategories();
  }, []);

  useEffect(() => {
    setSearch("");
  }, [filter]);

  useEffect(() => {
    if (search !== "") {
      if (filter === "name") {
        const newProducts = products.filter((value) =>
          value.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProducts(newProducts);
        // } else if (filter === "options") {
        //   const newProducts = products.filter((value) =>
        //     value.options.toLowerCase().includes(search.toLowerCase())
        //   );
        //   setFilteredProducts(newProducts);
        //
      } else if (filter === "category") {
        const newProducts = products.filter((value) =>
          value.item_category_name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProducts(newProducts);
      } else if (filter === "taxGroup") {
        const newProducts = products.filter((value) =>
          value.tax_group_name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProducts(newProducts);
      }
    }
  }, [search]);

  const uploadFile = async (e) => {
    e.preventDefault();
    setUploading(true);
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance.defaults.headers["Content-Type"] = "multipart/form-data";
    axiosInstance.defaults.timeout = 0;

    console.log(e.target.files);
    let hotel_id = localStorage.getItem("hotel_id");

    let data = {
      file: e.target.files[0],
      hotel: hotel_id,
    };
    console.log(data);

    await axiosInstance
      .post(`/upload_products/?hotel=${hotel_id}`, data)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        setUploading(false);
        console.log(err);
      });
  };
  useEffect(() => {
    if (categories) {
      setSelectedCategories(categories);
    }
  }, [categories]);

  useEffect(() => {
    setSelectedFilters(filters);
  }, [filters]);

  const changeHandler = (event) => {
    setUploading(true);
    uploadFile(event);
  };

  const downloadExcel = () => {
    // http://127.0.0.1:8000/download_products/?hotel=1&categories=DRINKS,BISCUIT,WATER,BAKERY
    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let url = "";
    if (selectedCategories.length === categories.length) {
      url = `/download_products/?hotel=${hotel_id}`;
    } else {
      let cats = selectedCategories
        .map((item) => item.item_category_name)
        .toString();
      url = `/download_products/?hotel=${hotel_id}&categories=${cats}`;
    }
    axiosInstance
      .get(url)
      .then((res) => {
        console.log(res);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "products.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="flex items-start">
        <h1 className="w-full text-2xl font-semibold">View Products</h1>

        <div className="w-[600px] flex items-center">
          <div class="flex items-center justify-center bg-grey-lighter">
            <label class="w-fit flex items-center p-2 bg-white text-blue rounded-md tracking-wide border border-blue cursor-pointer">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 16 16"
                class="mr-1"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"></path>
              </svg>
              <span className="ml-1">
                {uploading ? "Uploading..." : "Upload"}
              </span>
              <input
                disabled={uploading}
                className="hidden"
                type="file"
                name="file"
                onChange={changeHandler}
                accept=".csv"
              />
            </label>
          </div>
          <Pagination
            perPage={perPage}
            total={products.length}
            paginateBack={paginateBack}
            paginateFront={paginateFront}
            currentPage={currentPage}
          />
        </div>
      </div>

      <div className="-mx-3 sm:-mx-6 px-4 sm:px-8 pt-4 pb-3">
        <div className="inline-block min-w-full shadow-md rounded-lg">
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
                placeholder={`Search ${filter}`}
                required
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-3 bg-gray-100">
                {/* <Multiselect
                  items={filters}
                  selectedItems={selectedFilters}
                  setSelected={setSelectedFilters}
                  type="filters"
                /> */}

                <Multiselect
                  items={categories}
                  selectedItems={selectedCategories}
                  setSelected={setSelectedCategories}
                  type="categories"
                />

                <div
                  onClick={(e) => {
                    e.preventDefault();
                    downloadExcel();
                  }}
                  className="cursor-pointer rounded-t bg-white my-2 p-3 border border-gray-200"
                >
                  <BsDownload />
                </div>
              </div>
            </div>
          </form>

          <div>
            <Link
              to="/addProduct"
              title="Add"
              className=" cursor-pointer fixed z-90 bottom-10 right-8 bg-dark-purple w-10 h-10 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl "
            >
              &#43;
            </Link>
          </div>

          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name{" "}
                  <input
                    type="checkbox"
                    checked={filter === "name"}
                    onChange={(e) => setFilter("name")}
                  />
                </th>
                {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Options{" "}
                  <input
                    type="checkbox"
                    checked={filter === "options"}
                    onChange={(e) => setFilter("options")}
                  />
                </th> */}
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category{" "}
                  <input
                    type="checkbox"
                    checked={filter === "category"}
                    onChange={(e) => setFilter("category")}
                  />
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tax Group{" "}
                  <input
                    type="checkbox"
                    checked={filter === "taxGroup"}
                    onChange={(e) => setFilter("taxGroup")}
                  />
                </th>
                {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quantity{" "}
                </th> */}
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  AddOns
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((order, index) => {
                return (
                  <tr key={index}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <a
                        className="text-[#4338ca] whitespace-no-wrap"
                        href="/rn1000"
                      >
                        {order.name}
                      </a>
                    </td>
                    {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">-</p>
                  </td> */}
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p
                        className={` whitespace-no-wrap w-fit p-1 rounded-md `}
                      >
                        {order.item_category_name}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className={` whitespace-no-wrap w-fit p-1 rounded-md`}>
                        {order.tax_group_name}
                      </p>
                    </td>
                    {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                     {order.quantity} Units
                    </p>
                  </td> */}
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.net_price === 0 ? "-" : `₹${order.net_price}/-`}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p
                        className="text-gray-900 whitespace-no-wrap"
                        id={`${order.id}variants`}
                      >
                        {order.variant_details ? (
                          order.variant_details.map((variant, index) => (
                            <p>
                              {variant.variant_value + " - " + variant.price}
                            </p>
                          ))
                        ) : (
                          <p>-</p>
                        )}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p
                        className="text-gray-900 whitespace-no-wrap"
                        id={`${order.id}addons`}
                      >
                        {order.addons_details ? (
                          order.addons_details.map((addOn, index) => (
                            <p>{addOn.add_on_value + " - " + addOn.price}</p>
                          ))
                        ) : (
                          <p>-</p>
                        )}
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex w-full justify-around items-center">
                        <GrEdit
                          size={16}
                          onClick={(e) => {
                            e.preventDefault();
                            setEditModal(true);
                            setEditItem(order);
                          }}
                        />
                        <AiFillDelete
                          color="red"
                          size={16}
                          onClick={(e) => DeleteProduct(e, order.id)}
                        />
                        {
                          <BiLink
                            color="blue"
                            size={16}
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                order.variant_details ||
                                order.addons_details
                              ) {
                                console.log("ho");
                                setEditOptions(true);
                              }
                              setLinkItem(order);
                              setOpenLinkModal(true);
                            }}
                          />
                        }
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        editModal={editModal}
        setEditModal={setEditModal}
        editItem={editItem}
      />

      <LinkModal
        openLinkModal={openLinkModal}
        setOpenLinkModal={setOpenLinkModal}
        link={linkItem}
        edit={editOptions}
      />
    </div>
  );
}

export default ViewProduct;
