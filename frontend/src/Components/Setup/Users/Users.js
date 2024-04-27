import React, { useEffect, useState } from "react";
import Pagination from "../../UI/Pagination";
import { Link } from "react-router-dom";
import SetupModal from "../SetupModal";
import axiosInstance from "../../../axiosAPI";
import { GrEdit } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import EditUser from "./EditUser";

function Users() {
  const [cashiers, setCashiers] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [appUsers, setAppUsers] = useState([]);
  const [kitchen, setKitchen] = useState([]);

  const [type, setType] = useState("AppUsers");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);

  const tableHeaders = {
    AppUsers: ["Username", "Name", "Role", "Email", "Phone","Actions"],
    // Cashiers: ["Username", "Name", "Email", "Phone", "Actions"],
    // Waiters: ["Username", "Name", "Email", "Phone", "Actions"],
    // Kitchen: ["Username", "Name", "Email", "Phone", "Actions"],
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setVariantsPerPage] = useState(8);
  const [search, setSearch] = useState("");
  const [filteredVariants, setFilteredVariants] = useState([]);

  const indexOfLastReceipt = currentPage * perPage;
  const indexOfFirstReceipt = indexOfLastReceipt - perPage;

  const [currentVariants, setCurrentVariants] = useState([]);

  useEffect(() => {
    if (type === "Cashiers") {
      if (search !== "") {
        const newVariants = cashiers.filter((value) =>
          value.username.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredVariants(newVariants);
      }

      setCurrentVariants(
        search === ""
          ? cashiers.slice(indexOfFirstReceipt, indexOfLastReceipt)
          : filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt)
      );
    } else if (type === "AppUsers") {
      if (search !== "") {
        const newVariants = appUsers.filter((value) =>
          value.username.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredVariants(newVariants);
      }

      setCurrentVariants(
        search === ""
          ? appUsers.slice(indexOfFirstReceipt, indexOfLastReceipt)
          : filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt)
      );
    } else if (type === "Waiters") {
      if (search !== "") {
        const newVariants = waiters.filter((value) =>
          value.username.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredVariants(newVariants);
      }

      setCurrentVariants(
        search === ""
          ? waiters.slice(indexOfFirstReceipt, indexOfLastReceipt)
          : filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt)
      );
    } else {
      if (search !== "") {
        const newVariants = kitchen.filter((value) =>
          value.username.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredVariants(newVariants);
      }

      setCurrentVariants(
        search === ""
          ? kitchen.slice(indexOfFirstReceipt, indexOfLastReceipt)
          : filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt)
      );
    }
  }, [type, search, cashiers, waiters, kitchen, appUsers, indexOfFirstReceipt]);

  useEffect(() => {
    setCurrentVariants(
      filteredVariants.slice(indexOfFirstReceipt, indexOfLastReceipt)
    );
  }, [filteredVariants]);

  // const getCashiers = async () => {
  //   let hotel_id = localStorage.getItem("hotel_id");

  //   await axiosInstance
  //     .get(`/hotel/?id=${hotel_id}&user=Cashier`)
  //     .then((res) => {
  //       let temp = res.data;
  //       let cashiersTemp = [];
  //       for (let i = 0; i < temp.length; i++) {
  //         temp[i].user["mobile_number"] = temp[i].mobile_number;
  //         cashiersTemp.push(temp[i].user);
  //       }
  //       console.log(cashiersTemp);

  //       setCashiers(cashiersTemp);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const getWaiters = async () => {
  //   let hotel_id = localStorage.getItem("hotel_id");

  //   await axiosInstance
  //     .get(`/hotel/?id=${hotel_id}&user=waiter`)
  //     .then((res) => {
  //       let temp = res.data;
  //       let waitersTemp = [];
  //       for (let i = 0; i < temp.length; i++) {
  //         temp[i].user["mobile_number"] = temp[i].mobile_number;

  //         waitersTemp.push(temp[i].user);
  //       }
  //       setWaiters(waitersTemp);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const getKitchen = async () => {
  //   let hotel_id = localStorage.getItem("hotel_id");

  //   await axiosInstance
  //     .get(`/hotel/?id=${hotel_id}&user=kitchen`)
  //     .then((res) => {
  //       let temp = res.data;
  //       let kitchenTemp = [];
  //       for (let i = 0; i < temp.length; i++) {
  //         temp[i].user["mobile_number"] = temp[i].mobile_number;

  //         kitchenTemp.push(temp[i].user);
  //       }
  //       setKitchen(kitchenTemp);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const getAllUsers = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    await axiosInstance
      .get(`/hotel/?hotel=${hotel_id}`)
      .then((res) => {
        let temp = res.data;
        let allUsersTemp = [];
        for (let i = 0; i < temp.length; i++) {
          temp[i].user["role"] = temp[i].role.role_name;
          temp[i].user["mobile_number"] = temp[i].mobile_number;
          allUsersTemp.push(temp[i].user);
        }
        setAppUsers(allUsersTemp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // getCashiers();
    // getWaiters();
    // getKitchen();
    getAllUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [type]);

  const paginateFront = () => setCurrentPage(currentPage + 1);
  const paginateBack = () => setCurrentPage(currentPage - 1);

  const getTotal = () => {
    if (type === "Cashiers") {
      return cashiers.length;
    } else if (type === "AppUsers") {
      return appUsers.length;
    } else if (type === "Waiters") {
      return waiters.length;
    } else {
      return kitchen.length;
    }
  };

  const [editDetails, setEditDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const deleteUser = (e, id) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    // axiosInstance
    //   .delete(`/update_delete_variant/${parseInt(id)}/`)
    //   .then((res) => {
    //     window.location.reload();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  return (
    <div>
      <div className="flex items-start">
        <h1 className="w-full text-2xl font-semibold">Users</h1>

        <Pagination
          perPage={perPage}
          total={getTotal()}
          paginateBack={paginateBack}
          paginateFront={paginateFront}
          currentPage={currentPage}
        />
      </div>

      <div className="-mx-3 sm:-mx-6 px-4 sm:px-8 pt-4 pb-3">
        <div className="inline-block min-w-full shadow-md rounded-lg">
          <div className="bg-[#f9fafb]">
            {/* <button
              className={`p-2 ${
                type === "AppUsers" ? "bg-white font-semibold" : "bg-[#f9fafb]"
              } border`}
              onClick={(e) => {
                e.preventDefault();
                setType("AppUsers");
              }}
            >
              App Users
            </button> */
            /* <button
              className={`p-2 ${
                type === "Cashiers" ? "bg-white font-semibold" : "bg-[#f9fafb]"
              } border`}
              onClick={(e) => {
                e.preventDefault();
                setType("Cashiers");
              }}
            >
              Cashiers
            </button>
            <button
              className={`p-2 ${
                type === "Waiters" ? "bg-white font-semibold" : "bg-[#f9fafb]"
              } border`}
              onClick={(e) => {
                e.preventDefault();
                setType("Waiters");
              }}
            >
              Waiters
            </button>
            <button
              className={`p-2 ${
                type === "Kitchen" ? "bg-white font-semibold" : "bg-[#f9fafb]"
              } border`}
              onClick={(e) => {
                e.preventDefault();
                setType("Kitchen");
              }}
            >
              Kitchen
            </button> */}
          </div>

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
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowAddUserModal(true);
              }}
              title="Add"
              className=" cursor-pointer fixed z-90 bottom-10 right-8 bg-dark-purple p-1 rounded-md drop-shadow-lg flex justify-center items-center text-white text-sm "
            >
              Add User
            </button>
          </div>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowAddRoleModal(true);
              }}
              title="Add"
              className=" cursor-pointer fixed z-90 bottom-10 right-32 bg-dark-purple p-1 rounded-md drop-shadow-lg flex justify-center items-center text-white text-sm "
            >
              Add Role
            </button>
          </div>

          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                {tableHeaders[type].map((header, index) => (
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentVariants.map((order, index) => (
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <a
                      className="text-[#4338ca] whitespace-no-wrap"
                      href="/rn1000"
                    >
                      {order.username ? order.username : "-"}
                    </a>
                  </td>
                  {(order.first_name || order.last_name) && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.first_name + " " + order.last_name}
                      </p>
                    </td>
                  )}

                  {order.role && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.role}
                      </p>
                    </td>
                  )}

                  {order.email && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.email}
                      </p>
                    </td>
                  )}

                  {order.mobile_number && (
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.mobile_number}
                      </p>
                    </td>
                  )}

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex w-[60px] justify-around items-center">
                      <GrEdit
                        size={16}
                        onClick={(e) => {
                          setEditDetails(order);
                          setShowModal(true);
                        }}
                      />
                      <AiFillDelete
                        color="red"
                        size={16}
                        onClick={(e) => deleteUser(e, order.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <EditUser
        showModal={showModal}
        editDetails={editDetails}
        setShowModal={setShowModal}
      />
      <SetupModal
        showModal={showAddUserModal}
        setShowModal={setShowAddUserModal}
        type="user"
      />
      <SetupModal
        showModal={showAddRoleModal}
        setShowModal={setShowAddRoleModal}
      />
    </div>
  );
}

export default Users;
