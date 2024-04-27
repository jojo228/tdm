import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { BsCalendarDateFill, BsPerson } from "react-icons/bs";
import axiosInstance from "../../../axiosAPI";

function EditSalary({ editObject }) {
  const [amount, setAmount] = useState();
  const [employee, setEmployee] = useState();
  const [type, setType] = useState();

  const [types, setTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  
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

  const getAllUsers = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    await axiosInstance
      .get(`/hotel/?hotel=${hotel_id}`)
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllUsers();
    getPaymentTypes();
  }, []);

  const submitData = (e) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    let itemData = {
      salary: amount,
      hotel: hotel_id,
      employee: employee,
      payment_type: type,
    };

    axiosInstance
      .put(`salary/${editObject.id}/`, itemData)
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
        <BsPerson className="text-gray-400" />
        <select
          id="employee"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          className={` w-full form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
        >
          <option selected>Select Employee</option>

          {employees.map((b, i) => (
            <option value={b.id}>
              {b.user.first_name +
                " " +
                b.user.last_name +
                " - " +
                b.role.role_name}
            </option>
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
          placeholder="Salary Paid"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
      </div>
      <button
        className="w-18 bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
        onClick={(e) => {
          e.preventDefault();
          submitData(e);
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default EditSalary;
