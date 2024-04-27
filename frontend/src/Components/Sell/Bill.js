import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import axiosInstance from "../../axiosAPI";

function Bill({
  billId,
  current,
  deliveryType,
  customer,
  componentRef,
  paymentData,
}) {
  const [hotel, setHotel] = useState([]);
  const [existingOrders, setExistingOrders] = useState([]);
  const [billAmount, setBillAmount] = useState(0);

  const getHotelDetails = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/hotel_info/${hotel_id}/`)
      .then((res) => {
        console.log(res.data);
        setHotel(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getHotelDetails();
  }, []);

  useEffect(() => {
    if (
      deliveryType === "table order" &&
      current &&
      current.progress &&
      current.progress.toLowerCase() === "occupied"
    ) {
      axiosInstance.defaults.headers["Authorization"] =
        "Bearer " + localStorage.access_token;

      let hotel_id = localStorage.getItem("hotel_id");
      let url = `/table_orders/${current.name}/?hotel=${hotel_id}&status=occupied`;
      console.log(url);
      axiosInstance
        .get(`${url}`)
        .then((res) => {
          console.log(res.data);
          setExistingOrders(res.data.orders);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (deliveryType === "takeaway") {
      axiosInstance.defaults.headers["Authorization"] =
        "Bearer " + localStorage.access_token;

      let hotel_id = localStorage.getItem("hotel_id");
      let url = `/takeaway_orders/${current}/?hotel=${hotel_id}`;
      console.log(url);
      axiosInstance
        .get(url)
        .then((res) => {
          console.log(res.data);
          setExistingOrders(res.data.orders);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [current]);

  const calculateOptionsPrice = (order, id) => {
    let totalPrice = order.products.net_price;

    if (order.variant) {
      totalPrice = totalPrice + order.variant.price;
    }

    if (order.addon.length > 0) {
      for (let i = 0; i < order.addon.length; i++) {
        totalPrice = totalPrice + order.addon[i].price;
      }
    }

    return totalPrice * order.quantity;
  };

  const calculateExistingOrdersPrice = () => {
    let completeTotal = 0;

    for (let i = 0; i < existingOrders.length; i++) {
      if (existingOrders[i].status === "rejected") {
        continue;
      }
      let totalPrice = existingOrders[i].products.net_price
        ? existingOrders[i].products.net_price
        : 0;

      if (existingOrders[i].variant) {
        totalPrice = totalPrice + existingOrders[i].variant.price;
      }

      if (existingOrders[i].addon.length > 0) {
        for (let j = 0; j < existingOrders[i].addon.length; j++) {
          totalPrice = totalPrice + existingOrders[i].addon[j].price;
        }
      }

      totalPrice = totalPrice * existingOrders[i].quantity;

      completeTotal = completeTotal + totalPrice;
    }

    setBillAmount(completeTotal);
  };

  useEffect(() => {
    calculateExistingOrdersPrice();
  }, [existingOrders]);

  return (
    <div
      className="p-2 border-2 m-[5px 10px 0px 0px] pb-3 w-[350px] h-fit "
      ref={(el) => (componentRef.current = el)}
    >
      <div>
        <div className="flex flex-col items-center border-b-2 pb-1 mb-2 ">
          <h4 className="text-center font-semibold text-lg">
            {hotel.hotel_name}
          </h4>
          <h6 className="text-center w-3/4 text-sm">
            {" "}
            {hotel.address}, {hotel.location}
          </h6>
          <h6 className="text-center text-sm"> GST NO: </h6>
          <h6 className="text-center text-sm"> Ph: {hotel.contact_number} </h6>
        </div>
      </div>
      <div className="text-sm">
        <div className="flex flex-col text-left">
          Date: {moment(Date.now()).format("DD/MM/YY, hh:mm A")}
        </div>
        <div className="flex justify-between text-left">
          <p>Bill No: {billId}</p>
          {customer && customer.customer_name (
            <p>Customer: {customer.customer_name}</p>
          )}
        </div>
        <div className="flex justify-between text-left">
          {/* <p>Order No: {billId}</p> */}
          {customer && customer.customer_id (
            <p>CID: {customer.customer_id}</p>
          )}
        </div>
      </div>
      <table className="w-full my-2 text-sm" border="1">
        <thead>
          <tr>
            <th className="px-1 py-2 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Item
            </th>
            <th className="px-1 py-2 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-1 py-2 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {existingOrders.map((order, i) => {
            return order.status === "rejected" ? (
              <></>
            ) : (
              <tr>
                <td
                  className={`px-1 py-1 border-b border-gray-200 ${
                    order.status === "rejected" ? "bg-red-200" : "bg-white"
                  } text-sm`}
                >
                  <p className="text-[#4338ca] whitespace-no-wrap ml-2">
                    {order.products.name}
                  </p>
                  {order.variant && (
                    <p className=" whitespace-no-wrap ml-2 text-[12px]">
                      {order.variant.variant_value} - &#8377;
                      {order.variant.price}
                    </p>
                  )}
                  {order.addon &&
                    order.addon.map((order, i) => (
                      <p className=" whitespace-no-wrap ml-2 text-[12px]">
                        {order.add_on_value} - &#8377;{order.price}
                      </p>
                    ))}
                </td>
                <td
                  className={`px-1 py-1 border-b border-gray-200 ${
                    order.status === "rejected" ? "bg-red-200" : "bg-white"
                  } test-sm`}
                >
                  <p className="whitespace-no-wrap w-fit p-1">
                    {order.quantity}
                  </p>
                </td>
                <td
                  className={`px-1 py-1 border-b border-gray-200 ${
                    order.status === "rejected" ? "bg-red-200" : "bg-white"
                  } test-sm`}
                >
                  <p id={order.id} className="whitespace-no-wrap w-fit p-1">
                    {calculateOptionsPrice(order, order.id)}
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p />

      <div className="text-sm my-2 w-full flex flex-col items-end" >
        <div className="my-1">
          Bill Amount : &#8377;{billAmount}
        </div>
        <div className="my-1">
          Discount : {paymentData.discount_value}
          {paymentData.discount_type === "percent" ? "%" : "/-"}
        </div>
        <div className="my-1">
          Bill Payable : &#8377;{paymentData.net_amount}
        </div>
      </div>
      <p />
      <div>
        <div className="flex flex-col text-center">&#127801;Thank You...Visit Again!!&#127801;</div>
      </div>
    </div>
  );
}

export default Bill;
