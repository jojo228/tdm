import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import axiosInstance from "../../axiosAPI";

function Bar({ notification, parent }) {
  const options = ["sent", "in progress", "resolved"];
  const [edit, setEdit] = useState(false);
  const [expiryDate, setExpiryDate] = useState();
  const [change, setChange] = useState(false);
  const [action, setAction] = useState("sent");
  const [quantity, setQuantity] = useState(0);

  const changeExpiryDate = (e, id, productId, hotel) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let itemData = {
      id: id,
      request: "This product is expiring today... Please take action",
      status: "resolved",
      hotel: hotel,
      action: {
        value: "change expiry date",
        expiry_date: expiryDate,
      },
    };

    console.log(itemData);

    axiosInstance
      .put(`/update_notification/${id}/`, itemData)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateRequest = (e, id, productId, hotel,newStatus) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let itemData = {
      id: id,
      request: notification.request,
      status: edit ? "in progress" : newStatus,
      hotel: hotel,
      quantity: edit
        ? quantity
          ? quantity
          : notification.quantity
        : notification.quantity,
      uom: notification.uom,
      type: notification.type,
      product: notification.product,
    };

    console.log(itemData);

    axiosInstance
      .put(`/update_notification/${id}/`, itemData)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const disposeProduct = (e, id, productId, hotel) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let itemData = {
      id: id,
      request: "This product is expiring today... Please take action",
      status: "resolved",
      hotel: hotel,
      action: {
        value: "dispose",
        expiry_date: null,
      },
      quantity: notification.quantity,
      uom: notification.uom,
      type: notification.type,
      product: notification.product,
    };

    console.log(itemData);

    axiosInstance
      .put(`/update_notification/${id}/`, itemData)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (notification) {
      setAction(notification.status);
    }
  }, [notification]);

  return (
    <div className="mb-2 w-full bg-white flex items-center justify-between p-3 rounded-md border-2">
      <p className="flex items-center">
        <span
          className={`mr-4 ${
            notification.status === "sent"
              ? "bg-red-400"
              : notification.status === "resolved"
              ? "bg-green-400"
              : "bg-blue-400"
          } mx-2 block w-2 h-2 rounded-full`}
        ></span>
        {notification.type === "expiry" ? (
          <div>
            
            {(notification.product_details.variant
              ? notification.product_details.variant + " of "
              : "") +
              notification.product_details.name +
              " is going to expire"}
            <br/>
            <span className="text-sm font-light">
              status :{" "}
              {notification.status[0].toUpperCase() +
                notification.status.slice(1)}
            </span>
          </div>
        ) : notification.product ? (
          <div>
            {notification.request}
            <br />
            <p>
              {" We need " +
                notification.quantity +
                " " +
                notification.uom +
                " of " +
                notification.product_details.name +
                (notification.product_details.variant
                  ? " - " + notification.product_details.variant
                  : "")}
            </p>
            <span className="text-sm font-light">
              status :{" "}
              {notification.status[0].toUpperCase() +
                notification.status.slice(1)}
            </span>
          </div>
        ) : (
          notification.request
        )}
      </p>

      {notification.status === "resolved" ? (
        <p className="bg-green-100 p-1 px-2 mx-1 rounded-md">Action Taken</p>
      ) : (
        <div className="flex items-center">
          {notification.type === "expiry" ? (
            <button
              className="bg-red-100 p-1 px-2 mx-1 rounded-md"
              onClick={(e) => {
                disposeProduct(
                  e,
                  notification.id,
                  notification.product,
                  notification.hotel
                );
              }}
            >
              Remove
            </button>
          ) : notification.status === "sent" && !parent ? (
            <button
              className="bg-red-100 p-1 px-2 mx-1 rounded-md"
              onClick={(e) => {
                setEdit(true);
              }}
            >
              Edit
            </button>
          ) : (
            <></>
          )}
          {!change ? (
            notification.type === "expiry" ? (
              <button
                className="bg-orange-100 p-1 px-2 mx-1 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  setChange(true);
                }}
              >
                Change Expiry Date
              </button>
            ) : !parent ? (
              <button
                className="bg-orange-100 p-1 px-2 mx-1 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  setChange(true);
                }}
              >
                Take Action
              </button>
            ) : (
              <></>
            )
          ) : (
            <div className="flex items-center">
              {notification.type === "expiry" ? (
                <input
                  type="date"
                  className={`p-1 px-2 mx-1 bg-white rounded focus:outline-none border-2`}
                  placeholder="Expiry Date"
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                  }}
                />
              ) : (
                // <select
                //   id="type"
                //   value={action}
                //   onChange={(e) => {
                //     setAction(e.target.value);
                //   }}
                //   className={`w-full p-2 border-2 py-1 text-gray-700 focus:outline-none`}
                // >
                //   {options.map((b, i) => (
                //     <option className="bg-white" value={b.toLowerCase()}>
                //       {b[0].toUpperCase() + b.slice(1)}
                //     </option>
                //   ))}
                // </select>
                <></>
              )}
              <button
                className="bg-green-400 p-1 rounded-md mx-1 text-white"
                onClick={(e) => {
                  if (notification.type === "expiry") {
                    if (expiryDate) {
                      changeExpiryDate(
                        e,
                        notification.id,
                        notification.product,
                        notification.hotel
                      );
                    }
                  } else {
                    updateRequest(
                      e,
                      notification.id,
                      notification.product,
                      notification.hotel,
                      notification.status === "sent"?"in progress":"resolved"
                    );
                  }
                }}
              >
                {notification.type === "expiry"?<TiTick size="24px" color="white" />:`${notification.status === "sent"?"In progress":"Resolved"}`}
              </button>
              <button
                className="bg-red-400 p-1 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  setChange(false);
                }}
              >
                <RxCross2 size="24px" color="white" />
              </button>
            </div>
          )}
        </div>
      )}
      <>
        {edit ? (
          <>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div
                className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={() => setEdit(false)}
              ></div>
              <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                  <div className="mt-3 sm:flex flex-col">
                    <h1 className="font-semibold text-2xl border-b-2">
                      Edit Requests
                    </h1>

                    <div className="my-2">
                      <p className="font-semibold">Product Name</p>
                      <p>{notification.product_details.name}</p>
                    </div>
                    <div className="my-2">
                      <p className="font-semibold">Variant Name</p>
                      <p>{notification.product_details.variant}</p>
                    </div>
                    <div className="my-2">
                      <p className="font-semibold">Existing Quantity</p>
                      <p>
                        {notification.quantity} {notification.uom}
                      </p>
                    </div>
                    <div className="my-2">
                      <p className="font-semibold">New Quantity</p>
                      <input
                        type="number"
                        className={`form-control block px-3 py-1.5 outline-none text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                        placeholder="Product Name"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <button
                      className="w-18 h-18 bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
                      onClick={(e) => {
                        updateRequest(
                          e,
                          notification.id,
                          notification.product,
                          notification.hotel
                        );
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </>
    </div>
  );
}

export default Bar;
