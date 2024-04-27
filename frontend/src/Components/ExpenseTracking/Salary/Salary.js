import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../UI/Pagination";
import { GrEdit } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import axiosInstance from "../../../axiosAPI";
import Modal from "../Modal";
import moment from "moment-timezone";

function Salary({ mini, outlet }) {
  let timeZone = moment.tz.guess();

  const [salaries, setSalaries] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState("");
  const [editObject, setEditObject] = useState(null);

  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setProductsPerPage] = useState(8);
  const [search, setSearch] = useState("");

  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;
  const currentSalaries =
    search === ""
      ? salaries.slice(indexOfFirstReceipt, indexOfLastReceipt)
      : filteredSalaries.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  useEffect(() => {
    if (search !== "") {
      const newProducts = salaries.filter((value) => {
        let name =
          value.employee_info.user.last_name +
          " " +
          value.employee_info.user.first_name;
        return name.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredSalaries(newProducts);
    }
  }, [search]);

  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (mini) {
      setNumber(4);
    }
  }, [mini]);

  const getSalaries = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = parseInt(localStorage.getItem("hotel_id"));

    axiosInstance
      .get(`/salary/?hotel=${outlet !== undefined ? outlet : hotel_id}`)
      .then((response) => {
        setSalaries(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSalaries();
  }, [outlet]);

  const deleteSalary = (e, deleteId) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance
      .delete(`/salary/${deleteId}/`)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {!mini && (
        <div className="flex items-start">
          <h1 className="w-full text-2xl font-semibold">View Salaries</h1>

          <Pagination
            perPage={perPage}
            total={salaries.length}
            paginateBack={paginateBack}
            paginateFront={paginateFront}
            currentPage={currentPage}
          />
        </div>
      )}
      <div
        className={`${
          mini ? "w-fit" : "w-full"
        } h-fit bg-white rounded-md m-1 flex flex-col items-center justify-around`}
      >
        {mini && (
          <div className="w-full flex items-center">
            <p className="w-[100%] text-lg font-semibold m-2 text-center ">
              Recent Salaries
            </p>
            {!outlet && (
              <Link
                to="/tracker/salaries"
                className="text-sm font-light text-docs-blue text-right mx-1 cursor-pointer"
              >
                More
              </Link>
            )}
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
                  placeholder="Search Employee"
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
              {!mini && (
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Paid On
                </th>
              )}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Employee
              </th>
              {!mini && (
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
              )}

              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Payment Type
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Salary
              </th>
              {!mini && (
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentSalaries &&
              currentSalaries
                .slice(0, number === 0 ? currentSalaries.length : number)
                .map((salary, index) => (
                  <tr>
                    {!mini && (
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {moment(salary.created_at)
                          .tz(timeZone)
                          .format("MMM DD YYYY")}
                      </td>
                    )}

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {salary.employee_info.user.last_name +
                        " " +
                        salary.employee_info.user.first_name}
                    </td>
                    {!mini && (
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {salary.employee_info.role.role_name}
                      </td>
                    )}

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {salary.payment_info.name}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {salary.salary}
                    </td>
                    {!mini && (
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex w-[75px] justify-around items-center">
                          <GrEdit
                            size={16}
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenModal(true);
                              setEditObject(salary);
                              setType("Edit");
                            }}
                          />
                          <AiFillDelete
                            color="red"
                            size={16}
                            onClick={(e) => deleteSalary(e, salary.id)}
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
        category="Salary"
        type={type}
        editObject={editObject}
      />
    </>
  );
}

export default Salary;
