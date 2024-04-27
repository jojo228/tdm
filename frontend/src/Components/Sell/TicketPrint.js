import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI";

function TicketPrint({ printDetails, componentRef }) {
  console.log(printDetails);
  const [hotel, setHotel] = useState([]);
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
        </div>
      </div>
      <div className="text-sm">
        <div className="flex flex-col text-left">
          Date: {moment(Date.now()).format("DD/MM/YY, hh:mm A")}
        </div>
        <div className="flex justify-between text-left">
          <p>
            {printDetails.type[0].toUpperCase() + printDetails.type.slice(1)}
          </p>
          <p>Customer: {printDetails.customer.customer_name}</p>
        </div>
        <div className="flex justify-between text-left">
          <p>Table Number : {printDetails.tableIndex}</p>
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
          </tr>
        </thead>
        <tbody>
          {printDetails.products.map((order, i) => (
            <tr>
              <td
                className={`px-1 py-1 border-b border-gray-200 bg-white text-sm`}
              >
                <p className="text-[#4338ca] whitespace-no-wrap ml-2">
                  {order.name}
                </p>
                {order.variant_name && (
                  <p className=" whitespace-no-wrap ml-2 text-[12px]">
                    Variant : {order.variant_name}
                  </p>
                )}
                {order.add_on_name && order.add_on_name.length>0 && (
                  <p className="whitespace-no-wrap ml-2 text-[12px]">
                    Addons:
                    {order.add_on_name.map((aon, i) => (
                      <span className="block whitespace-no-wrap ml-2 text-[12px]">
                        {aon}
                      </span>
                    ))}
                  </p>
                )}
                {printDetails.notes[i] && (
                  <p className=" whitespace-no-wrap ml-2 text-[12px]">
                    Note: {printDetails.notes[i]}
                  </p>
                )}
              </td>
              <td
                className={`px-1 py-1 border-b border-gray-200 bg-white test-sm`}
              >
                <p className="whitespace-no-wrap w-fit p-1">
                  {order.item_quantity}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketPrint;
