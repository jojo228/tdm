import React, { useEffect, useState } from "react";
import ToggleBar from "./ToggleBar";
import axiosInstance from "../../../axiosAPI";

function Services() {

  const [services, setServices] = useState()

  const getServices = async () => {
    let hotel_id = localStorage.getItem("hotel_id");
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    await axiosInstance
      .get(`/kitchen_service/?hotel=${hotel_id}`)
      .then((res) => {
        console.log(res.data);
        setServices(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(()=>{
    getServices()
  },[])


  return (
    <div>
      <div className="flex items-start">
        <h1 className="w-full text-2xl font-semibold">Services</h1>
      </div>
      <div>
        {
          services && services.map((service,i)=>(
            <ToggleBar text="Do you need kitchen Module?" service={service}  />

          ))
        
        }
        
      </div>
    </div>
  );
}

export default Services;
