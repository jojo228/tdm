import React, { useEffect, useState } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import axiosInstance from './../../../axiosAPI';
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { setErrors } from "../../../actions/authActions";

function AddRole() {
  const [roleName, setRoleName] = useState("");

  const dispatch = useDispatch();
const errorMessage = useSelector((state) => state.errors);

  const submitDetails = (e) => {
    e.preventDefault();
    let hotel_id=parseInt(localStorage.getItem('hotel_id'))
    const tempData = {
      role_name: roleName,
      hotel_id:hotel_id
    };

    axiosInstance
      .post("/roles/", tempData)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        dispatch(setErrors({ detail: "Name required" }));
      });
  };

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
                  type="name"
                  name="rolename"
                  placeholder="Role Name"
                  value={roleName}
                  onChange={(e) => {
                    setRoleName(e.target.value);
                  }}
                  className="bg-gray-100 outline-none text-sm flex-1"
                />
              </div>
            </div>

            <div className="my-4  flex items-center justify-around">
              <button
                className="border-2 border-dark-purple rounded-full px-12 py-2 inline-block font-semibold hover:bg-dark-purple hover:text-white"
                onClick={(e) => {
                  submitDetails(e);
                }}
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

    </div>
  );
}

export default AddRole;
