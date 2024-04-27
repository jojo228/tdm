import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { BsCalendarDateFill } from "react-icons/bs";
import axiosInstance from "../../../axiosAPI";

function AddRent() {
  let months = [
    {
      id: 1,
      name: "January",
    },
    {
      id: 2,
      name: "February",
    },
    {
      id: 3,
      name: "March",
    },
    {
      id: 4,
      name: "April",
    },
    {
      id: 5,
      name: "May",
    },
    {
      id: 6,
      name: "June",
    },
    {
      id: 7,
      name: "July",
    },
    {
      id: 8,
      name: "August",
    },
    {
      id: 9,
      name: "September",
    },
    {
      id: 10,
      name: "October",
    },
    {
      id: 11,
      name: "November",
    },
    {
      id: 12,
      name: "December",
    },
  ];

  const [types, setTypes] = useState([]);

  const getPaymentTypes = async () => {
    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    await axiosInstance
      .get(`/get_payment_types/?hotel=${hotel_id}`)
      .then((res) => {
        setTypes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPaymentTypes();
  }, []);
  const [amount, setAmount] = useState();
  const [month, setMonth] = useState();
  const [type, setType] = useState();

  const submitData = (e) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    let itemData = {
      month: month,
      price: amount,
      hotel: hotel_id,
      payment_type:type
    };

    axiosInstance
      .post(`rent/?hotel=${hotel_id}`, itemData)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
        <BsCalendarDateFill className="text-gray-400" />
        <select
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={` w-full form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
        >
          <option selected>Select Month</option>

          {months.map((b, i) => (
            <option value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>
      <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
        <BiRupee className="text-gray-400 border-r" />
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={` w-full form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
        >
          <option selected>Select Payment Type</option>

          {types.map((b, i) => (
            <option value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
      <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
        <BiRupee className="text-gray-400 border-r" />
        <input
          type="number"
          className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
          placeholder="Rent Paid"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
      </div>
      <button
        className="w-18 bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
        onClick={(e) => {
          submitData(e);
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default AddRent;
