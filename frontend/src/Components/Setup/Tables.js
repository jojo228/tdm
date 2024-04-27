import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI";

function Tables() {
  const [number, setNumber] = useState(1);
  const [tables, setTables] = useState([]);

  const submitData = (e) => {
    e.preventDefault();
    let hotel_id = localStorage.getItem("hotel_id");

    var pcData = [];

    for (let i = 0; i < number; i++) {
      pcData.push({
        status: "free",
        hotel_id: hotel_id,
      })
    }

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance
      .post("/create_table/", pcData)
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTables = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    await axiosInstance
      .get(`/table_status/?hotel=${hotel_id}`)
      .then((res) => {
        setTables(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTables();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Add Tables</h1>
      <div className=" my-4 flex ">
        <div className="m-4 w-1/3">
          <h1 className="font-semibold text-lg">Tables Details </h1>
          <p className="mb-2">
            You Currently have <b className="text-lg">{tables.length}</b> tables
          </p>
        </div>
        <div className="m-4 w-2/3 flex flex-col bg-white p-4 rounded-md">
          <label> Additional Tables required</label>
          <input
            type="text"
            className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Number of Tables (Maximum 4)"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
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
    </div>
  );
}

export default Tables;
