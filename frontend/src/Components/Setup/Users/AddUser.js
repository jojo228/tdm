import React, { useEffect, useState } from "react";
import { MdEmail, MdLockOutline } from "react-icons/md";
import { BsFillPersonFill, BsPhoneFill } from "react-icons/bs";
import axiosInstance from "../../../axiosAPI";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { setErrors } from "../../../actions/authActions";

function AddUser() {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const dispatch = useDispatch();
const errorMessage = useSelector((state) => state.errors);


  const [roles, setRoles] = useState([]);

  const submitDetails = (e) => {
    e.preventDefault();
    let hotel_id=localStorage.getItem('hotel_id')

    const tempData={
      "hotel_id": hotel_id,
      "role": {
          "role_name": role
      },
      "user": {
          "username": userName,
          "first_name": firstName,
          "last_name": lastName,
          "email": email,
          "password" : password
      },
      "mobile_number":mobile
  }
  axiosInstance
    .post("/hotel_employee/create/", tempData)
    .then((res) => {
      console.log(res);
      window.location.reload();
    }).catch((err)=>{
      console.log(err);
      dispatch(setErrors({ detail: "Check All the required fields" }));
    })
  };

  useEffect(()=>{
    axiosInstance.defaults.headers["Authorization"] = "Bearer " + localStorage.access_token;

    let hotel_id=localStorage.getItem('hotel_id')

    axiosInstance
      .get(`/roles/?hotel=${hotel_id}`)
      .then((res) => {
        setRoles(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  },[])

  useEffect(() => {
    console.log(errorMessage);
    toast.error(errorMessage.errors.detail, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }, [errorMessage]);

  return (
    <div>
      <div className="-mx-3 sm:-mx-6 px-4 sm:px-8 pt-2 pb-3">
        <div className="inline-block min-w-full  rounded-lg">
          <div className="bg-white ">
            <div className="flex flex-col items-center mt-4">
              <div className="bg-gray-100 w-72 p-2 flex items-center mb-3">
                <BsFillPersonFill className="text-gray-400 m-2" />
                <input
                  type="username"
                  name="username"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  className="bg-gray-100 outline-none text-sm flex-1"
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
                <MdEmail className="text-gray-400 m-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
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
                  <option value={b.role_name}>{b.role_name}</option>
                ))}
              </select>
            </div>

            <div className="my-4  flex items-center justify-around">
              <button
                className="border-2 border-dark-purple rounded-full px-12 py-2 inline-block font-semibold hover:bg-dark-purple hover:text-white"
                onClick={(e) => {
                  submitDetails(e);
                }}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

    </div>
  );
}

export default AddUser;
