import React from "react";
import { useState } from "react";
import axiosInstance from "../../../axiosAPI";

function ToggleBar({ text, service }) {
  const toggleClass = " bg-blue-500 transform translate-x-5";

  const updateService = () => {
    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let data = {
      hotel: hotel_id,
      enabled: !service.enabled,
    };

    console.log(service);

    axiosInstance
      .put(`/kitchen_service/${service.id}/`, data)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p>{text}</p>
      </div>
      <div className="flex items-center">
        {/*   Switch Container */}
        <p className="mr-2" >No</p>
        <div
          className="md:w-10 md:h-5 w-10 h-5 flex items-center bg-gray-200 rounded-full p-1 cursor-pointer"
          onClick={() => {
            updateService();
          }}
        >
          {/* Switch */}
          <div
            className={
              " md:w-4 md:h-4 h-3 w-3 rounded-full shadow-md transform duration-100 ease-in-out" +
              (!service.enabled ? " bg-gray-400" : toggleClass)
            }
          ></div>
        </div>
        <p className="ml-2" >Yes</p>
      </div>
    </div>
  );
}

export default ToggleBar;
