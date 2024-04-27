import React, { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import axiosInstance from "../../axiosAPI";

function AddIncoming({ showModal, setShowModal, item }) {
  const [openingAmount, setOpeningAmount] = useState(0);
  const [outgoingAmount, setOutgoingAmount] = useState(0);

  useEffect(() => {
    if (item) {
      setOpeningAmount(item.openingAmount ? item.openingAmount : 0);
      setOutgoingAmount(item.outgoingAmount ? item.outgoingAmount : 0);
    }
  }, [item]);

  const submitData = (e) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .put(`/update_pettycash/${item.id}/`, {
        id: item.id,
        hotel: hotel_id,
        opening_amount: openingAmount,
        outgoing_amount: outgoingAmount,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {showModal ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-black opacity-40"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
              <div className="mt-3">
                <h3 className="text-xl font-semibold mb-4 ">Edit Details</h3>

                <label className="font-semibold">Opening Amount</label>
                <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
                  <BiRupee className="text-gray-400 border-r" />
                  <input
                    type="number"
                    className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                    placeholder="Opening Balance"
                    value={openingAmount}
                    onChange={(e) => {
                      setOpeningAmount(e.target.value);
                    }}
                  />
                </div>

                <label className="font-semibold">Outgoing Amount</label>
                <div className=" w-[250px] p-1 flex items-center mb-3 border border-solid ">
                  <BiRupee className="text-gray-400 border-r" />
                  <input
                    type="number"
                    className={`form-control block ml-0 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none`}
                    placeholder="Outgoing Amount"
                    value={outgoingAmount}
                    onChange={(e) => {
                      setOutgoingAmount(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="my-4 h-full flex ">
                <button
                  className="w-18 h-18 bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
                  onClick={(e) => {
                    submitData(e);
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default AddIncoming;
