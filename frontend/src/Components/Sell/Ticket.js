import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../axiosAPI";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { SET_ERRORS } from "../../actions/types";
import { setErrors } from "../../actions/authActions";
import TicketPrint from "./TicketPrint";
import ReactToPrint from "react-to-print";

function Ticket({
  orders,
  deliveryType,
  tableId,
  tableIndex,
  setShowModal,
  customer,
  setTicket,
}) {
  const [notes, setNotes] = useState([]);
  const [created, setCreated] = useState(false);
  const [printDetails, setPrintDetails] = useState(null);
  const componentRef = useRef();

  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.errors);

  const MakeOrder = (orderData) => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");
    axiosInstance
      .post(`/order_ticket/?hotel=${hotel_id}`, orderData)
      .then((res) => {
        console.log(res.data);
        setTicket(res.data);
        setCreated(true);
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setErrors({
            detail: err.response.data[0],
          })
        );
      });
  };

  useEffect(() => {
    console.log(errorMessage);
    toast.error(errorMessage.errors.detail, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }, [errorMessage]);

  const createOrderTicket = (e) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    let processedItems = [];

    for (let i = 0; i < orders.length; i++) {
      console.log(orders);

      processedItems.push({
        product: orders[i].id,
        quantity: orders[i].item_quantity,
        item_remarks: notes[i],
      });

      if (orders[i].add_on && orders[i].add_on.length > 0) {
        processedItems[processedItems.length - 1]["add_on"] = orders[i].add_on;
      }

      if (orders[i].variant && parseInt(orders[i].variant) !== -1) {
        processedItems[processedItems.length - 1]["variant"] = parseInt(
          orders[i].variant
        );
      }
    }

    let orderData = {
      hotel_id: hotel_id,
      table_id: tableId,
      products: processedItems,
      customer: {
        hotel_id: hotel_id,
        customer_name: customer.customer_name,
        customer_mobile: customer.customer_mobile,
      },
      type: deliveryType,
    };

    setPrintDetails({
      hotel_id: hotel_id,
      products: orders,
      notes: notes,
      customer: {
        hotel_id: hotel_id,
        customer_name: customer.customer_name,
        customer_mobile: customer.customer_mobile,
      },
      type: deliveryType,
      tableIndex: tableIndex,
    });

    console.log(orderData);

    if (deliveryType === "takeaway") {
      MakeOrder(orderData);
    } else {
      axiosInstance
        .post(`table_update/${tableId}/`, {
          status: "occupied",
          hotel_id: hotel_id,
          number: tableIndex,
          customer_id: customer.customer_id,
        })
        .then((res) => {
          MakeOrder(orderData);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    let newNotes = [];
    for (let i = 0; i < orders.length; i++) {
      newNotes.push("");
    }
    setNotes(newNotes);
  }, [orders]);

  const addNotes = (input, index) => {
    let newNotes = [];
    for (let i = 0; i < notes.length; i++) {
      if (i !== index) {
        newNotes.push(notes[i]);
      } else {
        newNotes.push(input);
      }
    }

    console.log(newNotes);
    setNotes(newNotes);
  };

  return (
    <div className="mt-2 w-full text-center sm:ml-4 sm:text-left">
      {!created ? (
        <>
          <h4 className="text-lg font-medium text-gray-800">Order Ticket</h4>

          <p className="mt-2 text-[15px] leading-relaxed text-gray-600 font-semibold">
            Draft Name
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
            Order for Table {tableIndex}
          </p>

          {/* <p className="mt-2 text-[15px] leading-relaxed text-gray-600 font-semibold">
            Order Ticket Notes
          </p>
          <input
            type="text"
            className="mt-2 p-2 text-[15px] border w-full leading-relaxed text-black outline-none"
            placeholder="Order Ticket Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Main Kitchen updated Now
          </p> */}
          <div className="w-full border my-4"></div>
          <div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 flex items-center">
              <span className="block w-2 h-2 rounded-full bg-green-500">
                &nbsp;
              </span>
              &nbsp; Added Items
            </p>
            <div className="max-h-[450px] overflow-auto">
              {orders.length === notes.length &&
                orders.map((order, i) => (
                  <div className="my-3">
                    <div className="flex justify-between">
                      <p className="text-md">
                        &nbsp;&nbsp;&nbsp;&nbsp;{order.item_quantity} X{" "}
                        {order.name}
                        {order.variant_name && (
                          <p className="whitespace-no-wrap ml-2 text-[12px]">
                            &nbsp;&nbsp;&nbsp;&nbsp;{order.variant_name}
                          </p>
                        )}
                        {order.add_on_name &&
                          order.add_on_name.map((add_on, i) => (
                            <p className="whitespace-no-wrap ml-2 text-[12px]">
                              &nbsp;&nbsp;&nbsp;&nbsp;{add_on}
                            </p>
                          ))}
                      </p>
                      <p className="text-md">
                        &nbsp;&nbsp;&nbsp;&nbsp;&#8377;
                        {order.net_price * order.item_quantity}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <input
                        id={i}
                        type="text"
                        className="mt-2 p-2 text-[15px] border w-full leading-relaxed text-black outline-none"
                        placeholder={`Notes for ${order.name}`}
                        // value={notes[i]}
                        // onChange={(e) => addNotes(e, e.target.value, i)}
                      />
                      <button
                        className="w-full mx-2 mt-2 p-2.5 flex-1 text-white text-sm bg-docs-blue rounded-md outline-none"
                        onClick={(e) => {
                          e.preventDefault();
                          let text = document.getElementById(i).value;
                          addNotes(text, i);
                        }}
                      >
                        {notes[i] === "" ? "Add" : "Change"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="items-center gap-2 mt-3 sm:flex">
            <button
              className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border "
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="w-full mt-2 p-2.5 flex-1 text-white bg-docs-blue rounded-md outline-none "
              onClick={(e) => {
                createOrderTicket(e);
              }}
            >
              Create Order Ticket
            </button>
          </div>
        </>
      ) : (
        <>
          <h4 className="text-lg font-medium text-gray-800">
            Order Ticket Created
          </h4>

          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Order ticket #1 created
          </p>

          <div className="hidden" >
            <TicketPrint
              printDetails={printDetails}
              orders={orders}
              componentRef={componentRef}
            />
          </div>

          <div className="items-center gap-2 mt-3 sm:flex">
            <ReactToPrint
              trigger={() => (
                <button
                  className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border "
                  onClick={() => setShowModal(false)}
                >
                  Print
                </button>
              )}
              content={() => componentRef.current}
            />

            <button
              className="w-full mt-2 p-2.5 flex-1 text-white bg-docs-blue rounded-md outline-none "
              //   onClick={() => setShowModal(false)}
              onClick={() => setShowModal(false)}
            >
              Ok
            </button>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default Ticket;
