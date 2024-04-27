import React, { useEffect, useState } from "react";
import Pagination from "../UI/Pagination";
import axiosInstance from "../../axiosAPI";

function ViewCustomers() {
  const [customers, setReceipts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setReceiptsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredReceipts] = useState([]);
  const [filter, setFilter] = useState("id");

  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;
  const currentReceipts =
    search === ""
      ? customers.slice(indexOfFirstReceipt, indexOfLastReceipt)
      : filteredCustomers.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  const getReceipts = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/customers/?hotel=${hotel_id}`)
      .then((response) => {
        setReceipts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getReceipts();
  }, []);

  useEffect(() => {
    if (search !== "") {
      if (filter === "id") {
        const newReceipts = customers.filter((value) =>
          value.customer_id.toString().toLowerCase().includes(search.toLowerCase())
        );
        setFilteredReceipts(newReceipts);
      } else if (filter === "mobile") {
        const newReceipts = customers.filter((value) =>
          value.customer_mobile.toString().toLowerCase().includes(search.toLowerCase())
        );
        setFilteredReceipts(newReceipts);
      } else if (filter === "name") {
        const newReceipts = customers.filter((value) =>
          value.customer_name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredReceipts(newReceipts);
      }
    }
  }, [search]);

  return (
    <div>
      <div className="flex items-start">
        <h1 className="text-2xl font-semibold">Customers</h1>

        <Pagination
          perPage={perPage}
          total={customers.length}
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
                placeholder="Search Customer No"
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
                  Customer ID{" "}
                  <input
                    type="checkbox"
                    checked={filter === "id"}
                    onChange={(e) => setFilter("id")}
                  />
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer Name{" "}
                  <input
                    type="checkbox"
                    checked={filter === "name"}
                    onChange={(e) => setFilter("name")}
                  />
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer Mobile{" "}
                  <input
                    type="checkbox"
                    checked={filter === "mobile"}
                    onChange={(e) => setFilter("mobile")}
                  />
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
                      {order.customer_id}
                    </a>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order.customer_name}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {order.customer_mobile}
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

export default ViewCustomers;
