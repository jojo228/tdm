import React, { useEffect, useState } from "react";
import axiosInstance from "./../axiosAPI";
import { useSelector } from "react-redux";

function Register() {
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

  const submitHotelDetails = (e) => {
    e.preventDefault();

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    const hotelData = {
      owner: parseInt(auth.user.user_id),
      hotel_name: name,
      location: location,
      address: address,
      contact_number: contact,
      hotel_type: type,
      web_site: website,
      facebook_link: facebook,
      instagram_link: instagram,
      status: "active",
    };
    axiosInstance
      .post("/create_hotel/", hotelData)
      .then((res) => {
        localStorage.setItem("hotel_id", res.data.hotel_id);
        localStorage.setItem("role", "owner");
        window.location.href = "./";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let hotel_id = parseInt(localStorage.getItem("hotel_id"));
    if (hotel_id !== -1) {
      window.location.href = "./";
    }
  }, []);

  return (
    <div>
      <div className=" my-4 flex ">
        <div className="m-4 w-1/2 flex flex-col bg-white p-4 rounded-md">
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
              className="w-fit h-fit bg-dark-purple text-white p-2 pl-4 pr-4 rounded-md"
              onClick={(e) => {
                submitHotelDetails(e);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
