import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import moment from "moment-timezone";

function KitchenCard({ order, type }) {
  let timeZone = moment.tz.guess();
  const [time, setTime] = useState("");

  const getTimeDiff = (orderDate) => {
    setTime(moment(orderDate).fromNow());
  };

  useEffect(() => {
    let ttc = order.created_at;
    if (order.order_status === "accepted") {
      ttc = order.accepted_at;
    } else if (order.order_status === "rejected") {
      ttc = order.rejected_at;
    } else if (order.order_status === "ready") {
      ttc = order.ready_at;
    } else if(order.order_status==="delivered") {
      ttc = order.delivered_at;
    }
    const interval = setInterval(() => getTimeDiff(ttc), 1000);

    return () => clearInterval(interval);
  }, []);

  const options = {
    created: ["Accept", "Reject"],
    accepted: ["Ready"],
    rejected: [],
    ready: ["Delivered"],
    delivered: [],
  };
  const [status, setStatus] = useState("created");

  useEffect(() => {
    setStatus(order.order_status);
  }, [order]);

  const getBg = () => {
    if (order.order_status === "created") {
      return "bg-yellow-500";
    } else if (order.order_status === "accepted") {
      return "bg-blue-500";
    } else if (order.order_status === "rejected") {
      return "bg-red-500";
    } else if (order.order_status === "ready") {
      return "bg-orange-500";
    } else {
      return "bg-green-500";
    }
  };

  const getBgText = (val) => {
    if (val === "created") {
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

  const updateStatus = (e, status) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    status =
      (status === "accept"
        ? "accepted"
        : ((status === "reject")
        ? "rejected"
        : status));
    let itemData = {
      id: order.id,
      hotel_id: hotel_id,
      order_status: status,
    };

    let url = `${
      type === "table"
        ? `/kitchen_orders/${order.id}/`
        : `/kitchen_takeaway/${order.id}/`
    }`;

    axiosInstance
      .put(url, itemData)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeItemStatus = (e, id, status) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let itemData = {
      id: id,
      status: status,
    };

    let url = `/kitchen_item_ordered/${id}/`;

    axiosInstance
      .put(url, itemData)
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
        className={`${getBg()} border-b-2 p-2 border-gray-200 pb-1 mb-1 flex w-full items-center justify-center`}
      >
        <p className="font-semibold text-white text-lg text-center">
          {type === "table"
            ? `Table - ${order.table_details[0].number}`
            : "Takeaway"}
          {type === "takeaway" && (
            <p className="text-sm font-light">
              {order.customer_details.customer_name + " " + order.id}
            </p>
          )}
        </p>
      </div>

      <div className="p-2 px-4">
        <p className="text-sm mb-2">
          {order.order_status[0].toUpperCase() + order.order_status.slice(1)} At
          : {time}
        </p>
        {order.order_details.map((item, i) => (
          <div className="mb-1 flex items-center justify-between">
            <div>
              <p className="text-lg">
                {item.quantity} x {item.products}
              </p>
              {item.variant && (
                <p className="text-sm text-gray-500">Variant: {item.variant}</p>
              )}
              {item.addon_details.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-500">Addons :</p>
                  {item.addon_details.map((addon, index) => (
                    <p className="text-sm text-gray-500">{addon}</p>
                  ))}
                </div>
              ) : (
                <></>
              )}
              {item.item_remarks && (
                <p className="text-sm text-gray-500">
                  Note: {item.item_remarks}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Status : {item.status[0].toUpperCase() + item.status.slice(1)}
              </p>
            </div>
            {(item.status === "created" || item.status === "sent") && (
              <div className="flex ml-4">
                <button
                  className="text-red-500 border-2 border-red-500 rounded-full p-1 mr-1"
                  onClick={(e) => {
                    e.preventDefault();
                    changeItemStatus(e, order.order_id[i], "rejected");
                  }}
                >
                  <RxCross2 />
                </button>
                <button
                  className="text-blue-500 border-2 border-blue-500 rounded-full p-1 ml-1"
                  onClick={(e) => {
                    e.preventDefault();
                    changeItemStatus(e, order.order_id[i], "accepted");
                  }}
                >
                  <TiTick />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {options[order.order_status].map((b, i) => (
        <button
          onClick={(e) => {
            e.preventDefault();
            updateStatus(e, b.toLowerCase());
          }}
          className={`${getBgText(
            b.toLowerCase()
          )} w-full p-2.5 flex-1 text-white outline-none`}
        >
          {b}
        </button>
      ))}
    </div>
  );
}

export default KitchenCard;
