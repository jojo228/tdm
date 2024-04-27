import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "../UI/Pagination";
import { GrEdit } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment-timezone";
import axiosInstance from "../../axiosAPI";
import Modal from "./Modal";

function Audit() {
  let { id } = useParams();
  let timeZone = moment.tz.guess();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setProductsPerPage] = useState(8);
  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;
  const currentItems =
    search === ""
      ? items.slice(indexOfFirstReceipt, indexOfLastReceipt)
      : filteredItems.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  const [editObject, setEditObject] = useState(null);

  const getItems = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/inventory_audit/?hotel=${hotel_id}&product=${id}`)
      .then((response) => {
        setItems(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getItems();
  }, []);

  const deleteItem = (id) => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    //   axiosInstance
    //     .delete(`/items/delete/${id}/`)
    //     .then((res) => {
    //       window.location.href = "/products";
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
  };

  return (
    <div>
      <div className="flex items-start">
        <h1 className="text-2xl w-full font-semibold">Audit Table</h1>

        <Pagination
          perPage={perPage}
          total={items.length}
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
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Variant
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quantity{" "}
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Recent Action{" "}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Action By{" "}
                </th>
                {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions{" "}
                </th> */}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {moment(item.timestamp)
                        .tz(timeZone)
                        .format("MMM DD YYYY - hh:mm A")}
                    </p>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {item.new_data.product_id.name}
                    </p>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {item.new_data.product_id.variant_value?item.new_data.product_id.variant_value:'-'}
                    </p>
                  </td>


                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap flex">
                      {item.new_data.quantity}
                    </p>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {/* {item.action + " - " + item.description} */}
                      {item.description}
                    </p>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {item.new_data.user.first_name +
                        " " +
                        item.new_data.user.last_name}
                    </p>
                  </td>

                  {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex w-full justify-around items-center">
                      <GrEdit
                        color="blue"
                        size={16}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowModal(true);
                          setEditObject(item);
                        }}
                      />
                      <AiFillDelete
                        size={16}
                        color="red"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteItem(item.id);
                        }}
                      />
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        openModal={showModal}
        setOpenModal={setShowModal}
        editObject={editObject}
        type="Audit"
      />
    </div>
  );
}

export default Audit;
