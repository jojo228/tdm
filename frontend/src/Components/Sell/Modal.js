import React from "react";
import Customer from "./Customer";
import Ticket from "./Ticket";
import ReactToPrint from "react-to-print";

function Modal({
  modalOf,
  data,
  deliveryType,
  tableId,
  name,
  tableIndex,
  showModal,
  setShowModal,
  setIsPrinted,
  setCustomer,
  customer,
  setTicket,
  mobile,
  componentRef,
}) {
  return (
    <>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => setShowModal(false)}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                <div className="mt-3 sm:flex">
                  {modalOf === "Ticket" ? (
                    <Ticket
                      orders={data}
                      tableId={tableId}
                      setShowModal={setShowModal}
                      customer={customer}
                      setTicket={setTicket}
                      tableIndex={tableIndex}
                      deliveryType={deliveryType}
                    />
                  ) : modalOf === "Charge" ? (
                    <div className="mt-2 w-full text-center sm:ml-4 sm:text-left">
                      <h4 className="text-lg font-medium text-gray-800">
                        Receipt Printed
                      </h4>

                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        Receipt #1 Printed
                      </p>

                      <div className="items-center gap-2 mt-3 sm:flex">
                        <ReactToPrint
                          trigger={() => (
                            <button
                              className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border "
                              onClick={() => setShowModal(false)}
                            >
                              Print Copy
                            </button>
                          )}
                          content={() => componentRef.current}
                        />

                        <button
                          className="w-full mt-2 p-2.5 flex-1 text-white bg-docs-blue rounded-md outline-none "
                          //   onClick={() => setShowModal(false)}
                          onClick={() => {
                            setIsPrinted(true);
                            setShowModal(false);
                          }}
                        >
                          Ok
                        </button>
                      </div>
                    </div>
                  ) : modalOf === "Customer" ? (
                    <div className="mt-2 w-full text-center sm:ml-4 sm:text-left">
                      <h4 className="text-lg font-medium text-gray-800">
                        Add Customer
                      </h4>

                      <div className="border my-4"></div>

                      <Customer
                        isCharged={false}
                        setCustomer={setCustomer}
                        setShowModal={setShowModal}
                        mmobile={mobile}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Modal;
