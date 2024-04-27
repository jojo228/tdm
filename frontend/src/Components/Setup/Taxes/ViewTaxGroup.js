import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsPercent, BsReceipt } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import axiosInstance from "../../../axiosAPI";
import Pagination from "../../UI/Pagination";

function ViewTaxGroup() {
  const [taxes, setTaxes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setTaxesPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;
  const currentProducts =
    search === ""
      ? taxes.slice(indexOfFirstReceipt, indexOfLastReceipt)
      : filteredProducts.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  useEffect(() => {
    if (search !== "") {
      const newProducts = taxes.filter((value) =>
        value.tax_group_name.toLowerCase().includes(search.toLowerCase())
      );

      setFilteredProducts(newProducts);
    }
  }, [search]);

  const getTaxes = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");
    axiosInstance
      .get(`/tax_groups/?hotel=${hotel_id}`)
      .then((res) => {
        setTaxes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTaxes();
  }, []);

  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const editTax = (e) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    const taxData = {
      tax_group_id: parseInt(editId),
      tax_group_name: name,
      tax_value: percentage,
      hotel_id: hotel_id,
    };

    axiosInstance
      .post(`/tax_update/${parseInt(editId)}/`, taxData)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteTax = (e,id) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    console.log(id);


    axiosInstance
      .delete(`/delete_tax_group/${parseInt(id)}/`)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    <div>
      <div className="flex items-start">
        <h1 className="w-full text-2xl font-semibold">View Taxes</h1>

        <Pagination
          perPage={perPage}
          total={taxes.length}
          paginateBack={paginateBack}
          paginateFront={paginateFront}
          currentPage={currentPage}
        />
      </div>

      <div className="-mx-3 sm:-mx-6 px-4 sm:px-8 pt-4 pb-3">
        <div className="inline-block min-w-full shadow-md rounded-lg">
          {/* <div className="bg-[#f9fafb]">
            <button
              className={`p-2 bg-white font-semibold border w-20`}
            >
              Tax
            </button>
          </div> */}

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
                placeholder="Search Tax name"
                required
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <div>
            <Link
              to="/addTax"
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
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((order, index) => (
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-[#4338ca] whitespace-no-wrap">
                      {order.tax_group_name}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className={` whitespace-no-wrap w-fit p-1 rounded-md `}>
                      {order.tax_value}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex w-[60px] justify-around items-center">
                      <GrEdit
                        size={16}
                        onClick={(e) => {
                          setName(order.tax_group_name);
                          setPercentage(order.tax_value);
                          setEditId(order.tax_group_id);
                          setShowModal(true);
                        }}
                      />
                      <AiFillDelete
                        color="red"
                        size={16}
                        onClick={(e) => deleteTax(e, order.tax_group_id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
                      Edit Tax
                    </h4>

                    <div className="border my-4"></div>

                    <div>
                      <div className="-mx-3 sm:-mx-6 px-4 sm:px-8 pt-2 pb-3">
                        <div className="inline-block min-w-full  rounded-lg">
                          <div className="bg-white ">
                            <div className="flex flex-col items-center mt-4">
                              <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                                <BsReceipt className="text-gray-400 m-2" />
                                <input
                                  type="name"
                                  name="name"
                                  placeholder="Tax Name"
                                  value={name}
                                  onChange={(e) => {
                                    setName(e.target.value);
                                  }}
                                  className="bg-gray-100 outline-none text-sm flex-1"
                                />
                              </div>
                              <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                                <BsPercent className="text-gray-400 m-2" />
                                <input
                                  type="number"
                                  name="percent"
                                  placeholder="Percentage"
                                  value={percentage}
                                  onChange={(e) => {
                                    setPercentage(e.target.value);
                                  }}
                                  className="bg-gray-100 outline-none text-sm flex-1"
                                />
                              </div>
                            </div>
                            <div className="my-4  flex items-center justify-around">
                              <button
                                className="border-2 border-dark-purple rounded-full px-12 py-2 inline-block font-semibold hover:bg-dark-purple hover:text-white"
                                onClick={(e) => {
                                  editTax(e);
                                }}
                              >
                                Submit
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
          </div>
        ) : null}
      </>
    </div>
  );
}

export default ViewTaxGroup;
