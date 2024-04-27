import React, { useEffect, useState } from "react";
import axiosInstance from "./../../axiosAPI";
import { useDispatch, useSelector } from "react-redux";
import { setErrors } from "../../actions/authActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Link } from "react-router-dom";

function Shop() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  // const [pin, setPin] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [type, setType] = useState("restaurant");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [parent, setParent] = useState(null);

  const [ownerID, setOwnerID] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.errors);

  const getOwnerDetails = () => {
    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/hotel/?id=${hotel_id}&user=owner`)
      .then((res) => {
        let ownerData = res.data[0].user;
        console.log(res.data);
        setOwnerID(res.data[0].id);
        setOwnerName(ownerData.username);
        setFirstName(ownerData.first_name);
        setLastName(ownerData.last_name);
        setEmail(ownerData.email);
        setMobile(res.data[0].mobile_number);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getHotelDetails = () => {
    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/hotel_info/${hotel_id}/`)
      .then((res) => {
        let hotelData = res.data;
        console.log(hotelData);
        setAddress(hotelData.address);
        setContact(hotelData.contact_number);
        setFacebook(hotelData.facebook_link);
        setName(hotelData.hotel_name);
        setType(hotelData.hotel_type);
        setInstagram(hotelData.instagram_link);
        setLocation(hotelData.location);
        setWebsite(hotelData.web_site);
        setParent(hotelData.parent);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;
    getHotelDetails();
    getOwnerDetails();
  }, []);

  const submitHotelDetails = (e) => {
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
      owner: ownerID,
    };

    console.log(hotelData);

    axiosInstance
      .post(`/hotel_update/${hotel_id}/`, hotelData)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        dispatch(setErrors({ detail: "Check All the required fields" }));
      });
  };

  const submitOwnerDetails = (e) => {
    e.preventDefault();
    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    const ownerData = {
      hotel_id: hotel_id,
      role: {
        role_name: "Owner",
      },
      user: {
        username: ownerName,
        first_name: firstName,
        last_name: lastName,
        email: email,
        mobile_number: parseInt(mobile),
        password: password,
      },
      mobile_number: parseInt(mobile),
    };

    axiosInstance
      .put(`/hotel/onwer/update_account/${hotel_id}/`, ownerData)
      .then((res) => {
        window.location.reload();
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
      <h1 className="text-2xl font-semibold">Shop</h1>
      <div className=" my-4 flex ">
        <div className="m-4 w-1/3">
          <h1 className="font-semibold text-lg mb-2">Your Shop Setup</h1>
          <p className="mb-2">Your shop details and settings</p>
          {parent === null ? (
            <Link to="/setup/outlets" className="mb-2 text-docs-blue">
              View Outlet Details
            </Link>
          ) : (
            <></>
          )}
        </div>
        <div className="m-4 w-2/3 flex flex-col bg-white p-4 rounded-md">
          {/* <div className="flex items-center mb-4">
            <img src="https://picsum.photos/125" width="125" height="125" />
            <button className="text-docs-blue ml-4">Remove</button>
          </div> */}

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

          <div>
            <button
              className=" w-fit h-fit bg-gray-500 text-white p-2 pl-4 pr-4 rounded-md"
              onClick={(e) => {
                getHotelDetails();
              }}
            >
              Reset
            </button>
            <button
              className="ml-4 w-fit h-fit bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
              onClick={(e) => {
                submitHotelDetails(e);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className=" my-4 flex ">
        <div className="m-4 w-1/3">
          <h1 className="font-semibold text-lg mb-2">Your Account Details</h1>
          <p className="mb-2">Your details help us serve you better</p>
        </div>
        <div className="m-4 w-2/3 flex flex-col bg-white p-4 rounded-md">
          <label>Owner Username</label>
          <input
            type="text"
            className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-white bg-gray-500 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Owner Name"
            value={ownerName}
            disabled
          />

          <label>Email</label>
          <input
            type="email"
            className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-white bg-gray-500 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Email"
            value={email}
            disabled
          />

          <label>First Name</label>
          <input
            type="name"
            className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Owner Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label>Last Name</label>
          <input
            type="text"
            className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Owner Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label>Mobile</label>
          <input
            type="tel"
            className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <label>Password</label>
          <input
            type="tel"
            className="mb-4 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark-purple focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <button
              className=" w-fit h-fit bg-gray-500 text-white p-2 pl-4 pr-4 rounded-md"
              onClick={(e) => {
                getOwnerDetails();
              }}
            >
              Reset
            </button>
            <button
              className="ml-4 w-fit h-fit bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
              onClick={(e) => {
                submitOwnerDetails(e);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Shop;
