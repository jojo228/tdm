import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Pagination from "../UI/Pagination";
import axiosInstance from "../../axiosAPI";
import moment from "moment-timezone";

function ViewReceipts() {
  let timeZone = moment.tz.guess();

  const [receipts, setReceipts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setReceiptsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [filter, setFilter] = useState("rno");

  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;
  const currentReceipts =
    search === ""
      ? receipts.slice(indexOfFirstReceipt, indexOfLastReceipt)
      : filteredReceipts.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  const getReceipts = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/receipts/?hotel=${hotel_id}`)
      .then((response) => {
        setReceipts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const colors = (e) => {
    if (e === "paid" || e === "Fulfilled") {
      return "bg-green-100 text-green-700";
    } else {
      return "bg-red-300 text-red-900";
    }
  };

  useEffect(() => {
    getReceipts();
  }, []);

  useEffect(() => {
    if (search !== "") {
      if (filter === "rno") {
        const newReceipts = receipts.filter((value) =>
          value.bill_id.toString().toLowerCase().includes(search.toLowerCase())
        );
        setFilteredReceipts(newReceipts);
      } else if (filter === "mobile") {
        const newReceipts = receipts.filter((value) =>
          value.customer.customer_mobile.toString().toLowerCase().includes(search.toLowerCase())
        );
        setFilteredReceipts(newReceipts);
      } else if (filter === "channel") {
        const newReceipts = receipts.filter((value) =>
          value.payment_name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredReceipts(newReceipts);
      } else if (filter === "fulfillment") {
        const newReceipts = receipts.filter(
          (value) => value.fulfillment.toLowerCase() === search.toLowerCase()
        );
        setFilteredReceipts(newReceipts);
      } else {
        const newReceipts = receipts.filter((value) =>{
          console.log(value.customer.customer_mobile,search);
          // return (value.customer.customer_mobile
          //   .toString()
          //   .toLowerCase()
          //   .includes(search.toLowerCase()))
          }
        );
        setFilteredReceipts(newReceipts);
      }
    }
  }, [search]);

  return (
    <div>
      <div className="flex items-start">
        <h1 className="text-2xl font-semibold">Receipts</h1>

        <Pagination
          perPage={perPage}
          total={receipts.length}
          paginateBack={paginateBack}
          paginateFront={paginateFront}
          currentPage={currentPage}
        />
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
                placeholder="Search Receipt No"
                required
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Receipt ID{" "}
                  <input
                    type="checkbox"
                    checked={filter === "rno"}
                    onChange={(e) => setFilter("rno")}
                  />
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Channel{" "}
                  <input
                    type="checkbox"
                    checked={filter === "channel"}
                    onChange={(e) => setFilter("channel")}
                  />
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer Details{" "}
                  <input
                    type="checkbox"
                    checked={filter === "mobile"}
                    onChange={(e) => setFilter("mobile")}
                  />
                </th>
                {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Fulfillment Status{" "}
                  <input
                    type="checkbox"
                    checked={filter === "fulfillment"}
                    onChange={(e) => setFilter("fulfillment")}
                  />
                </th> */}

                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Payment Status{" "}
                  {/* <input
                    type="checkbox"
                    checked={filter === "paid"}
                    onChange={(e) => setFilter("paid")}
                  /> */}
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {currentReceipts.map((order, index) => (
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <a
                      className="text-[#4338ca] whitespace-no-wrap"
                      href="/rn1000"
                    >
                      {order.bill_id}
                    </a>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {moment(order.created_at)
                        .tz(timeZone)
                        .format("MMM DD YYYY - hh:mm A")}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order.payment_name}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {order.customer ? (
                      <p className="text-gray-900 whitespace-no-wrap">
                      {order.customer.customer_name}
                      <br />
                      {order.customer.customer_mobile}
                    </p>
                    ) : ( <p className="text-gray-900 whitespace-no-wrap"> No Customer </p> )}
                  </td>
                  {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p
                      className={` whitespace-no-wrap w-fit p-1 rounded-md ${colors(
                        order.fulfillment
                      )}`}
                    >
                      {order.fulfillment}
                    </p>
                  </td> */}
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p
                      className={` whitespace-no-wrap w-fit p-1 rounded-md ${colors(
                        order.bill_status
                      )}`}
                    >
                      {order.bill_status ? order.bill_status : "unpaid"}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      &#8377; {order.net_amount}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewReceipts;
