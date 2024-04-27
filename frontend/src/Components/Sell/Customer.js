import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI";

function Customer({ isCharged, setCustomer, setShowModal, customer,mmobile }) {
  const [tab, setTab] = useState("General");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occupants, setOccupants] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");

  useEffect(() => {
    if (customer) {
      setName(customer.customer_name);
      setPhone(customer.customer_mobile);
    }
  }, [customer]);

  const addCustomer = (e) => {
    e.preventDefault();
    let hotel_id=localStorage.getItem('hotel_id')
    
    var cdata = {
      customer_name: name,
      customer_mobile: parseInt(phone),
      hotel_id: hotel_id,
    };
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    axiosInstance
      .post("/customers/", cdata)
      .then((res) => {
        console.log(res.data);
        setCustomer(res.data);
        setShowModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(()=>{
    if(mmobile){
      setPhone(mmobile)
    }
  },[mmobile])

  return (
    <div
      className={`${
        isCharged ? "m-4 mt-0 w-1/2 p-4" : "mt-2 w-full"
      } flex flex-col bg-white rounded-md`}
    >
      <div className="mb-4">
        <button
          className={`p-2 ${
            tab === "General" ? "bg-white font-semibold" : "bg-[#f9fafb]"
          } border`}
          onClick={(e) => {
            e.preventDefault();
            setTab("General");
          }}
        >
          General
        </button>
        <button
          className={`p-2 ${
            tab === "Delivery" ? "bg-white font-semibold" : "bg-[#f9fafb]"
          } border`}
          onClick={(e) => {
            e.preventDefault();
            setTab("Delivery");
          }}
        >
          Details
        </button>
      </div>

      {tab === "General" ? (
        <div>
          <label>Customer Phone</label>
          <input
            type="tel"
            className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Phone"
            value={phone}
            disabled={customer ? true : false}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />

          <label> Customer Name</label>
          <input
            type="text"
            className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={customer ? true : false}
          />
        </div>
      ) : (
        <div>
          {isCharged ? (
            <>
              <label> Customer Email</label>
              <input
                type="email"
                className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label> Occupants</label>
              <input
                type="text"
                className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
                placeholder="Number of Occupants"
                value={occupants}
                onChange={(e) => setOccupants(e.target.value)}
              />
            </>
          ) : (
            <></>
          )}
          <label>Address</label>
          <input
            type="address"
            className="mb-4 form-control block w-1/2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="flex">
            <div className="mr-4">
              <label>City</label>
              <input
                type="text"
                className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="ml-4">
              <label>Pincode</label>
              <input
                type="email"
                className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
                placeholder="Pincode"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {!customer && (
        <div className="items-center gap-2 mt-3 sm:flex">
          <button
            className="w-full mt-2 p-2.5 flex-1 text-white bg-docs-blue rounded-md outline-none "
            onClick={(e) => {
              addCustomer(e);
            }}
          >
            Ok
          </button>
        </div>
      )}
    </div>
  );
}

export default Customer;
