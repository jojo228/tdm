import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import axiosInstance from "../../axiosAPI";
import { BiRupee } from "react-icons/bi";
import { BsPercent } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { setErrors } from "../../actions/authActions";
import Bill from "./Bill";
import ReactToPrint from "react-to-print";

function Payment({
  setIsCharged,
  customer,
  billId,
  table,
  deliveryType,
  current,
}) {
  const componentRef = useRef();

  const [OrderType, setOrderType] = useState("sale");
  const [paymentType, setPaymentType] = useState();
  const [paymentName, setPaymentName] = useState("");
  const [PaymentTypes, setPaymentTypes] = useState([]);

  const [isPrinted, setIsPrinted] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);

  const [discounted, setDiscounted] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percent");
  const [paymentData, setPaymentData] = useState(null);
  const [amount, setAmount] = useState(0);

  const [tendered, setTendered] = useState(0);
  const [balance, setBalance] = useState(0);
  const [card, setCard] = useState("");
  const [notes, setNotes] = useState("");

  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.errors);

  useEffect(() => {
    if (tendered !== 0) {
      setBalance(tendered - amount);
    }
  }, [tendered]);

  const onChangeValue = (event) => {
    setOrderType(event.target.value);
  };

  const applyDiscount = (e) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    let data = {
      hotel_id: parseInt(hotel_id),
      bill_id: parseInt(billId),
      discount_type: discountType,
      discount_value: parseInt(discount),
      bill_status: "unpaid",
    };

    console.log(data);

    axiosInstance
      .put(`/receipts/print/${billId}/`, data)
      .then((res) => {
        console.log(res.data);
        setDiscounted(true);
        setPaymentData(res.data);
      })
      .catch((err) => {
        console.log(err);
        dispatch(setErrors({ detail: err.response.data[0] }));
      });
  };

  const updateTableStatus = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .post(`table_update/${table}/`, {
        status: "free",
        hotel_id: hotel_id,
      })
      .then((res) => {
        console.log(res.data);
        window.location.href = "./sell";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeBill = (e) => {
    e.preventDefault();
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");
    let data = {
      hotel_id: parseInt(hotel_id),
      bill_id: parseInt(billId),
      discount_type: discountType,
      discount_value: parseInt(discount),
      bill_status: "paid",
      payment_type: parseInt(paymentType),
    };

    if (paymentName === "cash" || parseInt(paymentType) === 1) {
      data["cash_recieved"] = parseInt(tendered);
    }

    console.log(data);

    axiosInstance
      .put(`/receipts/print/${billId}/`, data)
      .then((res) => {
        if (deliveryType === "takeaway") {
          window.location.href = "./sell";
        } else {
          updateTableStatus();
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(setErrors({ detail: err.response.data[0] }));
      });
  };

  const getPaymentTypes = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;
    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/get_payment_types/?hotel=${hotel_id}`)
      .then((res) => {
        console.log(res.data);
        setPaymentTypes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPaymentTypes();
  }, []);

  useEffect(() => {
    if (paymentData) {
      setAmount(paymentData.net_amount);
    }
  }, [paymentData]);

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

  return (
    <div className="my-4 mt-0">
      {/* <div className="flex items-center mb-4" onChange={onChangeValue}>
          <input
            id="sale"
            type="radio"
            name="type"
            checked={OrderType === "sale"}
            value="sale"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
          />
          <label for="sale" className="ml-2 text-sm font-medium text-gray-900 ">
            Immediate Sale
          </label>
          <input
            id="booking"
            type="radio"
            checked={OrderType === "booking"}
            name="type"
            value="booking"
            className="ml-4 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
          />
          <label
            for="booking"
            className="ml-2 text-sm font-medium text-gray-900 "
          >
            Booking
          </label>
        </div> */}

      {/* {!isPrinted ? (
        
      ) : ( */}
      <>
        {discounted ? (
          <div>
            <div className="m-2 mt-0">
              <p className="mb-4 text-md underline font-medium text-gray-900 ">
                Payment Details
              </p>
              <p className="mb-4 text-sm text-gray-900 ">
                <span className="font-medium">Total Amount: </span>&#8377;
                {paymentData.total_amount}
              </p>
              <p className="mb-4 text-sm text-gray-900 ">
                <span className="font-medium">Round Off Amount: </span>&#8377;
                {paymentData.round_off_amount}
              </p>
              <p className="mb-4 text-sm text-gray-900 ">
                <span className="font-medium">Discount Value: </span>&#8377;
                {paymentData.discount_value}
                {paymentData.discount_type === "percent" ? "%" : "/-"}
              </p>
              <p className="mb-4 text-sm text-gray-900 ">
                <span className="font-medium">Discount Amount: </span>&#8377;
                {paymentData.discount_amount}
              </p>
              <p className="mb-4 text-sm text-gray-900 ">
                <span className="font-medium">Net Amount Payable: </span>
                &#8377;{paymentData.net_amount}
              </p>

              <div>
                {/* <div className="flex items-center mb-4">
                  <button
                    className="w-24 mx-2 p-2 bg-[#e7e7e7]"
                    onClick={(e) => {
                      setIsCharged(false);
                    }}
                  >
                    Back
                  </button>
                  <button className="w-24 mx-2 p-2 bg-[#e7e7e7]">Split</button>
                  <button className="w-24 mx-2 p-2 bg-[#e7e7e7]">
                    Complete
                  </button>
                </div> */}

                <div className="hidden">
                  <Bill
                    billId={billId}
                    current={current}
                    deliveryType={deliveryType}
                    customer={customer}
                    paymentData={paymentData}
                    componentRef={componentRef}
                  />
                </div>
              </div>

              {isPrinted ? (
                <>
                  <p className="mb-4 text-md underline font-medium text-gray-900 ">
                    Payment Method
                  </p>
                  <div>
                    {PaymentTypes.map((type, i) => (
                      <button
                        className={`p-2 border rounded-md mr-2 ${
                          paymentType === type.id
                            ? "text-docs-blue"
                            : "text-black"
                        }`}
                        onClick={(e) => {
                          setPaymentName(type.name);
                          setPaymentType(type.id);
                        }}
                      >
                        {type.name[0].toUpperCase()+type.name.slice(1)}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            {paymentName === "cash" ? (
              <div>
                <label>Cash Tendered</label>
                <input
                  type="text"
                  className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
                  placeholder="Cash Tendered"
                  value={tendered}
                  onChange={(e) => setTendered(e.target.value)}
                />

                <label>Balance To Customer</label>
                <input
                  disabled
                  type="text"
                  className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
                  placeholder="Balance"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                />
              </div>
            ) : paymentType === "Card" ? (
              <div>
                {/* <label>Card Details</label>
                  <input
                    type="text"
                    className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
                    placeholder="Card Details"
                    value={card}
                    onChange={(e) => setCard(e.target.value)}
                  /> */}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        ) : (
          <div>
            <div
              class="flex flex-wrap my-4 mt-0"
              onChange={(e) => {
                console.log(e.target.value);
                setDiscountType(e.target.value);
              }}
            >
              <div class="flex items-center mr-4">
                <input
                  id="red-radio"
                  type="radio"
                  value="percent"
                  name="colored-radio"
                  class="w-4 h-4 text-docs-blue bg-gray-100 border-gray-300"
                  checked={discountType === "percent"}
                />
                <label for="red-radio" class="ml-2 text-sm font-medium">
                  Percent
                </label>
              </div>
              <div class="flex items-center mr-4">
                <input
                  id="green-radio"
                  type="radio"
                  value="amount"
                  name="colored-radio"
                  class="w-4 h-4 text-docs-blue bg-gray-100 border-gray-300"
                  checked={discountType === "amount"}
                />
                <label for="green-radio" class="ml-2 text-sm font-medium">
                  Amount
                </label>
              </div>
            </div>
            {/* <label>Discount</label> */}
            <div className="my-2 mb-4 flex form-control w-1/2 p-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300">
              {discountType === "amount" && (
                <BiRupee className="text-gray-400 m-2" />
              )}

              <input
                type="text"
                className="bg-white outline-none text-sm flex-1"
                placeholder="Discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
              {discountType === "percent" && (
                <BsPercent className="text-gray-400 m-2" />
              )}
            </div>
          </div>
        )}
        <div className="mt-8">
          <button
            className="w-24 mr-2 p-2 bg-[#e7e7e7] rounded-md"
            onClick={(e) => {
              setDiscounted(false);
              setIsPrinted(false);
            }}
          >
            Back
          </button>
          {discounted ? (
            <>
              {isPrinted && (
                <button
                  className="mr-2 p-2 bg-docs-blue text-white rounded-md"
                  onClick={(e) => {
                    if (paymentType) {
                      if (
                        paymentType === 1 &&
                        parseInt(tendered) >= parseInt(amount)
                      ) {
                        console.log(paymentType, tendered, amount);
                        closeBill(e);
                      } else if (paymentType !== 1) {
                        closeBill(e);
                        console.log(paymentType);
                      }
                    }
                  }}
                >
                  Received &#8377;
                  {paymentType === 1 && tendered ? tendered : amount}
                </button>
              )}
              <ReactToPrint
                trigger={() => (
                  <button className={`${isPrinted?'w-[350px] mt-4':'rounded-md mt-2'} mx-0 p-2 bg-docs-blue text-white`}>
                    Print Receipt
                  </button>
                )}
                content={() => componentRef.current}
                onAfterPrint={() => {
                  setShowChargeModal(true);
                }}
              />
            </>
          ) : (
            <button
              className="mr-2 p-2 bg-docs-blue text-white rounded-md"
              onClick={(e) => {
                applyDiscount(e);
              }}
            >
              Apply Discount
            </button>
          )}
        </div>
      </>
      {/* )} */}

      <Modal
        modalOf="Charge"
        name="ReceiptName"
        showModal={showChargeModal}
        setShowModal={setShowChargeModal}
        setIsPrinted={setIsPrinted}
        componentRef={componentRef}
      />
      <ToastContainer />
    </div>
  );
}

export default Payment;
