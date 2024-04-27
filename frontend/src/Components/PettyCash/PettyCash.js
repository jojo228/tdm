import React, { useEffect, useState } from "react";
import Pagination from "../UI/Pagination";
import axiosInstance from "../../axiosAPI";
import moment from "moment-timezone";
import AddIncoming from "./EditPettyCash";
import { GrEdit } from "react-icons/gr";
import { BiReset } from "react-icons/bi";

function PettyCash() {
  let timeZone = moment.tz.guess();
  const [flows, setFlows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setFlowsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [filteredFlows, setFilteredFlows] = useState([]);
  const [filter, setFilter] = useState("rno");

  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;
  const currentFlows =
    search === ""
      ? flows.slice(indexOfFirstReceipt, indexOfLastReceipt)
      : filteredFlows.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const resetFlow = (id) => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .put(`/reset_pettycash/${id}/`, {
        id: id,
        hotel: hotel_id,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getFlows = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/get_pettycash_history/?hotel=${hotel_id}`)
      .then((response) => {
        setFlows(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getFlows();
  }, []);

  return (
    <div>
      <div className="flex items-start">
        <h1 className="text-2xl w-full font-semibold">Cash Flow</h1>

        <Pagination
          perPage={perPage}
          total={flows.length}
          paginateBack={paginateBack}
          paginateFront={paginateFront}
          currentPage={currentPage}
        />
      </div>

      <div className="-mx-3 sm:-mx-6 px-4 sm:px-8 pt-4 pb-3">
        <div className="inline-block min-w-full shadow-md rounded-lg">
          {/* <form>
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
                placeholder="Search Receipt No"
                required
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form> */}

          {/* <div>
            <button
              title="Add"
              className=" cursor-pointer fixed z-90 bottom-10 right-8 bg-dark-purple w-10 h-10 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl "
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
            >
              &#43;
            </button>
          </div> */}

          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Initial Balance{" "}
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Incoming Amount{" "}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Opening Amount{" "}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Outgoing Amount{" "}
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Closing Balance{" "}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions{" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentFlows.map((order, index) => (
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {moment(order.date)
                        .tz(timeZone)
                        .format("MMM DD YYYY - hh:mm A")}
                    </p>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order.initial_balance}
                    </p>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order.incoming_amount}
                    </p>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order.opening_amount}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order.outgoing_amount}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order.closing_balance}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex w-full justify-around items-center">
                      <GrEdit
                        color="blue"
                        size={16}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowModal(true);
                          setEditItem(order);
                        }}
                      />
                      <BiReset
                        size={16}
                        color="red"
                        onClick={(e) => {
                          e.preventDefault();
                          resetFlow(order.id);
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
      <AddIncoming
        showModal={showModal}
        setShowModal={setShowModal}
        item={editItem}
      />
    </div>
  );
}

export default PettyCash;
