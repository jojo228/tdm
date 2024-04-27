import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import Rent from "./Rent/Rent";
import EBill from "./EBill/EBill";
import Products from "./Products/Products";
import Salary from "./Salary/Salary";
import axiosInstance from "../../axiosAPI";

function ExpenseTracking({ parent }) {
  const [outlets, setOutlets] = useState([]);
  const [outlet, setOutlet] = useState("main");

  const getOutlets = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/hotel_outlets/?hotel=${hotel_id}`)
      .then((res) => {
        console.log(res.data);
        setOutlets(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getOutlets();
  }, []);

  return (
    <>
      {parent ? (
        <div className="w-full h-full flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">Expense Tracking</h1>
          </div>
          <div className="h-1/2 flex justify-between">
            <PieChart />
            <div className="w-full flex justify-around">
              <Products mini={true} which="Reselling" />
              <Rent mini={true} />
            </div>
          </div>
          <div className="h-1/2 flex justify-between">
            <Products mini={true} which="Purchasing" />
            <Salary mini={true} />
            <EBill mini={true} />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">Expense Tracking</h1>
            {outlets && (
              <select
                id="outlets"
                value={outlet}
                onChange={(e) => setOutlet(e.target.value)}
                className="form-control block w-fit p-1 text-sm font-normal text-docs-blue bg-white bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none"
              >
                <option selected value="main">
                  Main
                </option>
                {outlets.map((item, i) => (
                  <option value={item.hotel_id}>{item.hotel_name}</option>
                ))}

                {/* {outlets.map((b, i) => (
            <option value={b.hotel_name}>{b.hotel_name}</option>
          ))} */}
              </select>
            )}
          </div>
          {outlet === "main" ? (
            <div className="w-full h-full flex-col">
              <div className="h-1/2 flex justify-between">
                <PieChart />
                <div className="w-full flex justify-around">
                  <Products mini={true} which="Reselling" />
                  <Rent mini={true} />
                </div>
              </div>
              <div className="h-1/2 flex justify-between">
                <Products mini={true} which="Purchasing" />
                <Salary mini={true} />
                <EBill mini={true} />
              </div>
            </div>
          ) : (
            <>
              <div className="h-1/2 flex justify-between">
                <PieChart outlet={outlet} />
                <div className="w-full flex justify-around">
                  <Products mini={true} which="Reselling" outlet={outlet} />
                  <Rent mini={true} outlet={outlet} />
                </div>
              </div>
              <div className="h-1/2 flex justify-between">
                <Products mini={true} which="Purchasing" outlet={outlet} />
                <Salary mini={true} outlet={outlet} />
                <EBill mini={true} outlet={outlet} />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ExpenseTracking;
