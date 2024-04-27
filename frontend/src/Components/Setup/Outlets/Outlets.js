import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../axiosAPI";
import Pagination from "../../UI/Pagination";
import { HiUserAdd } from "react-icons/hi";
import OModal from "./OModal";

function Outlets() {
  const [outlets, setOutlets] = useState([]);

  const [outletId, setOutletId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setOutletsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [filteredOutlets, setFilteredProducts] = useState([]);

  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;
  const currentProducts =
    search === ""
      ? outlets.slice(indexOfFirstReceipt, indexOfLastReceipt)
      : filteredOutlets.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  useEffect(() => {
    if (search !== "") {
      const newProducts = outlets.filter((value) =>
        value.hotel_name.toLowerCase().includes(search.toLowerCase())
      );

      setFilteredProducts(newProducts);
    }
  }, [search]);

  const getOutlets = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/hotel_outlets/?hotel=${hotel_id}`)
      .then((res) => {
        console.log(res.data);
        setOutlets(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getOutlets();
  }, []);

  return (
    <div>
      <div className="flex items-start">
        <h1 className="w-full text-2xl font-semibold">View Outlets</h1>

        <Pagination
          perPage={perPage}
          total={outlets.length}
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
              Outlet
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
                placeholder="Search Outlet name"
                required
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <div>
            <Link
              to="/setup/addOutlet"
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
                  Location
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact Number
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
                      {order.hotel_name}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className={` whitespace-no-wrap w-fit p-1 rounded-md `}>
                      {order.location + " " + order.address}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className={` whitespace-no-wrap w-fit p-1 rounded-md `}>
                      {order.owner_details.first_name +
                        " " +
                        order.owner_details.last_name}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className={` whitespace-no-wrap w-fit p-1 rounded-md `}>
                      <span>{order.contact_number}</span>
                      <br />
                      <span>{order.owner_details.email}</span>
                    </p>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex w-[60px] justify-around items-center">
                      <HiUserAdd
                        size={20}
                        className="text-docs-blue cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          setOutletId(order.hotel_id);
                          setShowModal(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <OModal showModal={showModal} setShowModal={setShowModal} outletId={outletId} />
    </div>
  );
}

export default Outlets;
