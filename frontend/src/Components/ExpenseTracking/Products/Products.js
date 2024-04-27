import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../Modal";
import { AiFillDelete } from "react-icons/ai";
import { GrEdit } from "react-icons/gr";
import axiosInstance from "../../../axiosAPI";
import Pagination from "../../UI/Pagination";
import moment from "moment-timezone";

function Products({ mini, which,outlet }) {
  let timeZone = moment.tz.guess();

  const [purchaseProducts, setPurchaseProducts] = useState([]);
  const [resellingProducts, setResellingProducts] = useState([]);

  const [filteredPProducts, setFilteredPProducts] = useState([]);
  const [filteredRProducts, setFilteredRProducts] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState("");
  const [editObject, setEditObject] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setProductsPerPage] = useState(8);
  const [search, setSearch] = useState("");

  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;
  const currentProducts =
    search === ""
      ? which === "Reselling"
        ? resellingProducts.slice(indexOfFirstReceipt, indexOfLastReceipt)
        : purchaseProducts.slice(indexOfFirstReceipt, indexOfLastReceipt)
      : which === "Reselling"
      ? filteredRProducts.slice(indexOfFirstReceipt, indexOfLastReceipt)
      : filteredPProducts.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  useEffect(() => {
    if (search !== "") {
      const newProducts =
        which === "Reselling"
          ? resellingProducts.filter((value) =>
              value.related_name.toLowerCase().includes(search.toLowerCase())
            )
          : purchaseProducts.filter((value) =>
              value.name.toLowerCase().includes(search.toLowerCase())
            );

      if (which === "Reselling") {
        setFilteredRProducts(newProducts);
      } else {
        setFilteredPProducts(newProducts);
      }
    }
  }, [search]);

  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (mini) {
      setNumber(4);
    }
  }, [mini]);

  const getPurchasingProducts = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/expense_purchase_products/?hotel=${outlet !== undefined ? outlet : hotel_id}`)
      .then((response) => {
        setPurchaseProducts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getResellingProducts = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/expense_reselling_products/?hotel=${outlet !== undefined ? outlet : hotel_id}`)
      .then((response) => {
        setResellingProducts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPurchasingProducts();
    getResellingProducts();
  }, [outlet]);

  const deleteProduct = (e, deleteId) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    if (which === "Reselling") {
      axiosInstance
        .delete(`/expense_reselling_product/${deleteId}/`)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axiosInstance
        .delete(`/expense_purchase_product/${deleteId}/`)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {!mini && (
        <div className="flex items-start">
          <h1 className="w-full text-2xl font-semibold">
            View {which} Products
          </h1>

          <Pagination
            perPage={perPage}
            total={
              which === "Reselling"
                ? resellingProducts.length
                : purchaseProducts.length
            }
            paginateBack={paginateBack}
            paginateFront={paginateFront}
            currentPage={currentPage}
          />
        </div>
      )}
      <div
        className={`w-full h-fit bg-white rounded-md m-1 flex flex-col items-center justify-around`}
      >
        {mini && (
          <div className="w-full flex items-center">
            <p className="w-[100%] text-lg font-semibold m-2 text-center ">
              {which} Products
            </p>
            {!outlet && <Link
              to={`${
                which === "Reselling"
                  ? "/tracker/RProducts"
                  : "/tracker/PProducts"
              }`}
              className="text-sm font-light text-docs-blue text-right mx-1 cursor-pointer"
            >
              More
            </Link>}
          </div>
        )}

        {!mini && (
          <>
            <form className="w-full">
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
                  placeholder="Search Product"
                  required
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>
            <div>
              <button
                title="Add"
                className=" cursor-pointer fixed z-90 bottom-10 right-8 bg-dark-purple w-10 h-10 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl "
                onClick={(e) => {
                  e.preventDefault();
                  setOpenModal(true);
                  setType("Add");
                }}
              >
                &#43;
              </button>
            </div>
          </>
        )}
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Product
              </th>
              {!mini && which === "Reselling" ? (
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Variant
                </th>
              ) : (
                <></>
              )}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Quantity
              </th>
              {!mini && (
                <>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Vendor
                  </th>

                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Payment Type
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Charges
                  </th>
                  {which === "Reselling" ? (
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Profit
                    </th>
                  ) : (
                    <></>
                  )}
                </>
              )}

              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              {!mini && (
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentProducts &&
              currentProducts
                .slice(0, number === 0 ? currentProducts.length : number)
                .map((product, index) => (
                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {moment(product.created_at)
                        .tz(timeZone)
                        .format("MMM DD YYYY")}{" "}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {which === "Reselling"
                        ? product.related_name
                        : product.name}
                    </td>
                    {!mini && which === "Reselling" ? (
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {product.variant_name ? product.variant_name : "-"}
                      </td>
                    ) : (
                      <></>
                    )}
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {product.quantity + " " + product.uom}
                    </td>

                    {!mini && (
                      <>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {product.vendor_name}
                        </td>

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {product.payment_info.name}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {product.unit_price}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {product.extracharges}
                        </td>
                        {which === "Reselling" ? (
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {product.profit}
                          </td>
                        ) : (
                          <></>
                        )}
                      </>
                    )}

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {product.total_price}
                    </td>
                    {!mini && (
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex w-[75px] justify-around items-center">
                          <GrEdit
                            size={16}
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenModal(true);
                              setEditObject(product);
                              setType("Edit");
                            }}
                          />
                          <AiFillDelete
                            color="red"
                            size={16}
                            onClick={(e) => deleteProduct(e, product.id)}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        category="Product"
        type={type}
        editObject={editObject}
        which={which}
      />
    </>
  );
}

export default Products;
