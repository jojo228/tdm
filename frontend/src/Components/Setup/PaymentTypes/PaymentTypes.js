import React, { useEffect, useState } from "react";
import Pagination from "../../UI/Pagination";
import { Link } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import axiosInstance from "../../../axiosAPI";
import { BsReceipt } from "react-icons/bs";

function PaymentTypes() {
  const [paymentTypes, setPaymentTypes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPaymentTypesPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [filteredPaymentTypes, setFilteredPaymentTypes] = useState([]);
  const [currentPaymentTypes, setCurrentPaymentTypes] = useState([]);

  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;
  // const currentPaymentTypes =
  //   search === ""
  //     ? paymentTypes.slice(indexOfFirstReceipt, indexOfLastReceipt)
  //     : filteredPaymentTypes.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  useEffect(() => {
    const newPaymentTypes = paymentTypes.filter((value) =>
      value.name.toLowerCase().includes(search.toLowerCase())
    );
    console.log(newPaymentTypes);
    setFilteredPaymentTypes(newPaymentTypes);
  }, [search]);

  useEffect(() => {
    if (search === "") {
      setCurrentPaymentTypes(
        paymentTypes.slice(indexOfFirstReceipt, indexOfLastReceipt)
      );
    } else {
      setCurrentPaymentTypes(
        filteredPaymentTypes.slice(indexOfFirstReceipt, indexOfLastReceipt)
      );
    }
  }, [filteredPaymentTypes, paymentTypes]);

  const getPaymentTypes = async () => {
    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    await axiosInstance
      .get(`/get_payment_types/?hotel=${hotel_id}`)
      .then((res) => {
        setPaymentTypes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPaymentTypes();
  }, []);

  const [name, setName] = useState("");
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);

  // const editPaymentType = (e) => {
  //   e.preventDefault();
  //   axiosInstance.defaults.headers["Authorization"] =
  //     "Bearer " + localStorage.access_token;

  //   let hotel_id = localStorage.getItem("hotel_id");

  //   const paymentTypeData = {
  //     item_category_id: parseInt(editId),
  //     item_category_name: name,
  //     hotel_id: hotel_id,
  //   };

  // axiosInstance
  //   .put(
  //     `/update_delete_item_category/${parseInt(editId)}/`,
  //     paymentTypeData
  //   )
  //   .then((res) => {
  //     window.location.reload();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // };

  const deletePaymentType = (e, id) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance
      .delete(`/update_delete_payment/${parseInt(id)}/`)
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
        <h1 className="w-full text-2xl font-semibold">Payment Types</h1>

        <Pagination
          perPage={perPage}
          total={paymentTypes.length}
          paginateBack={paginateBack}
          paginateFront={paginateFront}
          currentPage={currentPage}
        />
      </div>

      <div className="-mx-3 sm:-mx-6 px-4 sm:px-8 pt-4 pb-3">
        <div className="inline-block min-w-full shadow-md rounded-lg">
          {/* <div className="bg-[#f9fafb]">
            <button
              className={`p-2 bg-white font-semibold border`}
            >
              Payment Types
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
                placeholder="Search Name"
                required
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <div>
            <Link
              to="/addPaymentType"
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
                  Actions
                </th>
                {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sort Order
                </th> */}
              </tr>
            </thead>
            <tbody>
              {currentPaymentTypes.map((order, index) => (
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p
                      className="text-[#4338ca] whitespace-no-wrap"
                      href="/rn1000"
                    >
                      {order.name}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex w-[60px] justify-around items-center">
                      {/* <GrEdit
                        size={16}
                        onClick={(e) => {
                          setName(order.name);
                          setEditId(order.id);
                          setShowModal(true);
                        }}
                      /> */}
                      <p
                        className="cursor-pointer flex"
                        onClick={(e) => deletePaymentType(e, order.id)}
                      >
                        <span className="text-red-500">Delete</span>
                        <AiFillDelete color="red" size={16} />
                      </p>
                    </div>
                  </td>
                  {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order.sort}
                    </p>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <>
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
                      Edit Payment Type
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
                                  placeholder="Payment Type Name"
                                  value={name}
                                  onChange={(e) => {
                                    setName(e.target.value);
                                  }}
                                  className="bg-gray-100 outline-none text-sm flex-1"
                                />
                              </div>
                            </div>
                            <div className="my-4  flex items-center justify-around">
                              <button
                                className="border-2 border-dark-purple rounded-full px-12 py-2 inline-block font-semibold hover:bg-dark-purple hover:text-white"
                                onClick={(e) => {
                                  editPaymentType(e);
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
      </> */}
    </div>
  );
}

export default PaymentTypes;
