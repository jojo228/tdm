import React, { useEffect, useState } from "react";
import axiosInstance from "./../../../axiosAPI";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { setErrors } from "../../../actions/authActions";

function AddOutlet() {
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.errors);
  const auth = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  // const [pin, setPin] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [type, setType] = useState("restaurant");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");

  const createOutlet = (e) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;
    let hotel_id = localStorage.getItem("hotel_id");

    const hotelData = {
      hotel_name: name,
      location: location,
      address: address,
      contact_number: contact,
      hotel_type: type,
      web_site: website,
      facebook_link: facebook,
      instagram_link: instagram,
      status: "active",
      owner: auth.user.user_id,
      parent:hotel_id
    };

    console.log(hotelData);

    axiosInstance
      .post(`/create_hotel/`, hotelData)
      .then((res) => {
        window.location.href='/setup/outlets'
      })
      .catch((err) => {
        console.log(err);
        dispatch(setErrors({ detail: "Check All the required fields" }));
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

  return (
    <div>
      <h1 className="w-full text-2xl font-semibold">Register an Outlet</h1>

      <div className="m-4 ml-0 w-2/3 flex flex-col bg-white p-4 rounded-md">
        <label>Name</label>
        <input
          type="text"
          className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Business Type</label>
        <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
          >
            <option selected disabled>
              Choose Type
            </option>

            {["Restaurant", "Bakery"].map((b, i) => (
              <option value={b.toLowerCase()}>{b}</option>
            ))}
          </select>


        <label> Address</label>
        <input
          type="text"
          className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label> Location</label>
        <input
          type="text"
          className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
          placeholder="Address"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label>Contact</label>
        <input
          type="tel"
          className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />

        {/* <label>Shop Owner Pin</label>
          <input
            type="text"
            className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          /> */}

        <label>Website Link</label>
        <input
          type="text"
          className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
          placeholder="Website Link (Optional)"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <label>Facebook Link</label>
        <input
          type="text"
          className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
          placeholder="Facebook Link (Optional)"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
        />

        <label>Instagram Link</label>
        <input
          type="text"
          className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
          placeholder="Instagram Link (Optional)"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />

        <button
          className="ml-0 w-fit h-fit bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
          onClick={(e) => {
            createOutlet(e);
          }}
        >
          Create
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddOutlet;
