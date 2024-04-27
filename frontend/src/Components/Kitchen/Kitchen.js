import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI";
import KitchenCard from "./KitchenCard";
import RequestCard from "./RequestCard";

function Kitchen({ parent }) {
  const [orders, setOrders] = useState([]);
  const [takeaways, setTakeaways] = useState([]);
  const [requests, setRequests] = useState([]);

  const getOrders = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/kitchen_orders/?hotel=${hotel_id}`)
      .then((response) => {
        setOrders(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTakeAwayOrders = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/kitchen_takeaways/?hotel=${hotel_id}`)
      .then((response) => {
        setTakeaways(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRequests = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/kitchen_requests/?hotel=${hotel_id}`)
      .then((response) => {
        setRequests(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getOrders();
    getTakeAwayOrders();
    getRequests();
  }, []);
  return (
    <div>
      <div className="flex items-start">
        <h1 className="text-2xl w-full font-semibold">Kitchen Orders</h1>
        <div className="flex w-[500px] items-center justify-between mx-2">
          <span className="mx-2 block w-2 h-2 rounded-full bg-yellow-500">
            &nbsp;
          </span>
          <p>Created/Sent</p>
          <span className="mx-2 block w-2 h-2 rounded-full bg-blue-500">
            &nbsp;
          </span>
          <p>Accepted</p>
          <span className="mx-2 block w-2 h-2 rounded-full bg-orange-500">
            &nbsp;
          </span>
          <p>Ready</p>
          <span className="mx-2 block w-2 h-2 rounded-full bg-green-500">
            &nbsp;
          </span>
          <p>Delivered</p>
          <span className="mx-2 block w-2 h-2 rounded-full bg-red-500">
            &nbsp;
          </span>
          <p>Rejected</p>
        </div>
      </div>
      {orders.length > 0 && (
        <h1 className="text-xl mt-4 w-full font-semibold">Table Orders</h1>
      )}
      <div>
        <div className="mt-2 h-fit lg:flex lg:justify-start lg:items-center">
          <div className="grid lg:grid-cols-4 gap-12 lg:gap-2 overflow-auto">
            {orders.map((order, index) => (
              <KitchenCard order={order} type="table" />
            ))}
          </div>
        </div>
      </div>
      {takeaways.length > 0 && (
        <h1 className="text-xl mt-4 w-full font-semibold">Takeaway Orders</h1>
      )}
      <div>
        <div className="mt-2 h-fit lg:flex lg:justify-start lg:items-center">
          <div className="grid lg:grid-cols-4 gap-12 lg:gap-2 overflow-auto">
            {takeaways.map((order, index) => (
              <KitchenCard order={order} type="takeaway" />
            ))}
          </div>
        </div>
      </div>
      {!parent && requests.length > 0 && (
        <>
          <h1 className="text-xl mt-4 w-full font-semibold">
            Kitchen Requests
          </h1>
          <div>
            <div className="mt-2 h-fit lg:flex lg:justify-start lg:items-center">
              <div className="grid lg:grid-cols-4 gap-12 lg:gap-2 overflow-auto">
                {requests.map((order, index) => (
                  <RequestCard order={order} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Kitchen;
