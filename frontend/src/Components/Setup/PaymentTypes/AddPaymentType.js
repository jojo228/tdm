import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosAPI";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { setErrors } from "../../../actions/authActions";

function AddPaymentType() {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.errors);

  const submitData = (e) => {
    e.preventDefault();
    let hotel_id = localStorage.getItem("hotel_id");

    var pcData = {
      hotel: hotel_id,
      name: name,
    };

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance
      .post(`/add_payment_type/`, pcData)
      .then((res) => {
        window.location.href = "/setup/paymentTypes";
      })
      .catch((err) => {
        console.log(err);
        dispatch(setErrors({ detail: "Payment Type Already Existed" }));
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
      <h1 className="text-2xl font-semibold">Add Payment Types</h1>
      <div className=" my-4 flex ">
        <div className="m-4 w-1/3">
          <h1 className="font-semibold text-lg">Your Payment Type Details </h1>
          <p className="mb-2">
            Here you can add various types of payment types.
            <span>
              <p className="font-semibold text-lg mt-2">
                Available Options are
              </p>
              <ul className="list-disc">
                <li className="ml-8">Cash</li>
                <li className="ml-8">Card</li>
                <li className="ml-8">UPI</li>
                <li className="ml-8">Others</li>
              </ul>
            </span>
          </p>
        </div>
        <div className="m-4 w-2/3 flex flex-col bg-white p-4 rounded-md">
          <label> Name</label>

          <select
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
          >
            <option selected value={false}>
              Select Option
            </option>

            {["cash", "card", "upi", "others"].map((b, i) => (
              <option value={b}>
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </option>
            ))}
          </select>
          <button
            className=" w-fit h-fit bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
            onClick={(e) => {
              submitData(e);
            }}
          >
            Submit
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddPaymentType;
