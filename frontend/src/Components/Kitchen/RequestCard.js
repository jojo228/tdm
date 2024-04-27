import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment-timezone";

function RequestCard({ order }) {

  let timeZone = moment.tz.guess();
  const [time, setTime] = useState("");

  const getTimeDiff = (orderDate) => {
    setTime(moment(orderDate).fromNow());
  };

  useEffect(() => {
    let ttc = order.created_at;
    if (order.status === "accepted") {
      ttc = order.accepted_at;
    } else if (order.status === "rejected") {
      ttc = order.rejected_at;
    } else if (order.status === "ready") {
      ttc = order.ready_at;
    } else if(order.status==="delivered") {
      ttc = order.delivered_at;
    }
    const interval = setInterval(() => getTimeDiff(ttc), 1000);

    return () => clearInterval(interval);
  }, []);

  const options = {
    sent: ["Accept", "Reject"],
    accepted: ["Ready"],
    rejected: [],
    ready: ["Delivered"],
    delivered: [],
  };

  const [status, setStatus] = useState("created");

  useEffect(() => {
    setStatus(order.status);
  }, [order]);

  const getBg = () => {
    if (order.status === "created" || order.status === "sent") {
      return "bg-yellow-200";
    } else if (order.status === "accepted") {
      return "bg-blue-200";
    } else if (order.status === "rejected") {
      return "bg-red-200";
    } else if (order.status === "ready") {
      return "bg-orange-200";
    } else {
      return "bg-green-200";
    }
  };

  const getBgText = (val) => {
    console.log(val);
    if (val === "sent") {
      return "bg-yellow-500";
    } else if (val === "accept") {
      return "bg-blue-500";
    } else if (val === "reject") {
      return "bg-red-500";
    } else if (val === "ready") {
      return "bg-blue-500";
    } else {
      return "bg-orange-500";
    }
  };

  const updateStatus = (e,status) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");
    status=(status==='accept'?'accepted':(status==='reject'?'rejected':status));

    let itemData = {
      id: order.id,
      status: status,
      quantity: order.request_details.quantity,
      uom: order.request_details.uom,
      request: order.request_details.request,
      type: order.request_details.type,
      hotel: order.request_details.hotel,
      product: order.request_details.product,
    };

    axiosInstance
      .put(`/kitchen_request/${order.id}/`, itemData)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteRequest = (e, id) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance
      .delete(`/kitchen_request/${id}/`)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className={`text-black h-fit w-full bg-white cursor-pointer border border-b-4 border-gray-300 shadow-[0px 5px 20px 1px] rounded-md`}
    >
      <div
        className={`${getBg()} border-b-2 p-2 border-gray-200 pb-1 mb-1 flex w-full items-center justify-between`}
      >
        <div className="w-1/7"></div>
        <p className="font-semibold text-lg text-center">
          {order.request_details.hotel_name}
        </p>
        <AiFillDelete
          color="red"
          onClick={(e) => {
            deleteRequest(e, order.id);
          }}
        />
      </div>

      <div className="p-2 px-4">
      <p className="text-sm mb-2">
          {order.status[0].toUpperCase() + order.status.slice(1)} At
          : {time}
        </p>
        <div className="mb-1">
          <p className="text-lg">
            {order.request_details.quantity} x{" "}
            {order.request_details.product_details.name}
          </p>
          {order.request_details.product_details.variant && (
            <p className="text-sm text-gray-500">
              Variant: {order.request_details.product_details.variant}
            </p>
          )}

          {order.request_details.request && (
            <p className="text-sm text-gray-500">
              Request: {order.request_details.request}
            </p>
          )}
        </div>
      </div>
      {options[order.status].map((b, i) => (
        <button onClick={(e)=>{
          e.preventDefault();
          updateStatus(e,b.toLowerCase())
        }}  className={`${getBgText(b.toLowerCase())} w-full p-2.5 flex-1 text-white outline-none`}>
          {b}
        </button>
      ))}
    </div>
  );
}

export default RequestCard;
