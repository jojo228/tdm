import React, { useEffect, useState } from "react";
import { BsFillPersonFill, BsPhoneFill } from "react-icons/bs";
import { MdEmail, MdLockOutline } from "react-icons/md";
import axiosInstance from "../../../axiosAPI";

function EditUser({ showModal, setShowModal, editDetails }) {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [roles, setRoles] = useState([]);

  const getRoles = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/roles/?hotel=${hotel_id}`)
      .then((res) => {
        setRoles(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (editDetails) {
      setUserName(editDetails.username ? editDetails.username : "");
      setFirstName(editDetails.first_name ? editDetails.first_name : "");
      setLastName(editDetails.last_name ? editDetails.last_name : "");
      setEmail(editDetails.email ? editDetails.email : "");
      setMobile(editDetails.mobile_number ? editDetails.mobile_number : "");
      setRole(editDetails.role ? editDetails.role : "");
    }
  }, [editDetails]);

  const editUser = (e) => {
    e.preventDefault();
  };

  return (
    <div>
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
                    Edit Employee
                  </h4>

                  <div className="border my-4"></div>
                  <div>
                    <div className="-mx-3 sm:-mx-6 px-4 sm:px-8 pt-2 pb-3">
                      <div className="inline-block min-w-full  rounded-lg">
                        <div className="bg-white ">
                          <div className="flex flex-col items-center mt-4">
                            <div className="text-white bg-gray-500 w-72 p-2 flex items-center mb-3">
                              <BsFillPersonFill className=" m-2" />
                              <input
                                type="username"
                                name="username"
                                placeholder="Username"
                                value={userName}
                                disabled
                                className="bg-gray-500 outline-none text-sm flex-1"
                              />
                            </div>
                            <div className="text-white bg-gray-500 w-72 p-2 flex items-center mb-3">
                              <MdEmail className=" m-2" />
                              <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                disabled
                                className="bg-gray-500 outline-none text-sm flex-1"
                              />
                            </div>
                            <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                              <BsFillPersonFill className="text-gray-400 m-2" />
                              <input
                                type="firstname"
                                name="firstname"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => {
                                  setFirstName(e.target.value);
                                }}
                                className="bg-gray-100 outline-none text-sm flex-1"
                              />
                            </div>
                            <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                              <BsFillPersonFill className="text-gray-400 m-2" />
                              <input
                                type="lastname"
                                name="lastname"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => {
                                  setLastName(e.target.value);
                                }}
                                className="bg-gray-100 outline-none text-sm flex-1"
                              />
                            </div>

                            <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                              <BsPhoneFill className="text-gray-400 m-2" />
                              <input
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                value={mobile}
                                onChange={(e) => {
                                  setMobile(e.target.value);
                                }}
                                className="bg-gray-100 outline-none text-sm flex-1"
                              />
                            </div>
                            <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                              <MdLockOutline className="text-gray-400 m-2" />
                              <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                }}
                                className="bg-gray-100 outline-none text-sm flex-1"
                              />
                            </div>

                            <select
                              id="role"
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                              className="my-4 form-control block w-72 p-2 text-base font-normal text-gray-700 bg-gray-100 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:text-gray-700 focus:outline-none"
                            >
                              <option selected>Choose Role</option>

                              {roles.map((b, i) => (
                                <option value={b.role_name}>
                                  {b.role_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="my-4  flex items-center justify-around">
                            <button
                              className="border-2 border-dark-purple rounded-full px-12 py-2 inline-block font-semibold hover:bg-dark-purple hover:text-white"
                              onClick={(e) => {
                                editUser(e);
                              }}
                            >
                              Edit User Details
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
    </div>
  );
}

export default EditUser;
