import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI";
import Bar from "./Bar";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from 'react-router-dom';

function Notifications({ parent }) {
  const [notifications, setNotifications] = useState([]);
  const [outletNotifications, setOutletNotifications] = useState([]);

  const getNotifications = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/notification/?hotel=${hotel_id}`)
      .then((response) => {
        let newNotifications=response.data
        newNotifications=newNotifications.sort(compareStatus)
        setNotifications(newNotifications);
        console.log(response.data,newNotifications);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getOutletNotifications = () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/notifications/?hotel=${hotel_id}`)
      .then((response) => {
        let newOutletNotifications=response.data
        Object.keys(newOutletNotifications).map((key,index)=>{
          newOutletNotifications[key]=newOutletNotifications[key].sort(compareStatus)
        })
        setOutletNotifications(newOutletNotifications)    
        console.log(response.data,newOutletNotifications);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    if (parent === null) {
      getOutletNotifications();
    }
  }, [parent]);

  function compareStatus(a, b) {
    const q1 = (a.status.toUpperCase()==='SENT')?'CREATED':a.status.toUpperCase();
    const q2 = (b.status.toUpperCase()==='SENT')?'CREATED':b.status.toUpperCase();

    let comparison = 0;

    if (q1 > q2) {
        comparison = 1;
    } else if (q1 < q2) {
        comparison = -1;
    }
    return comparison;
}

  return (
    <div>
      <div className="flex items-start">
        <h1 className="mb-2 text-2xl w-full font-semibold">Notifications</h1>
        {/* {parent ? ( */}
          <Link
            className="bg-white text-docs-blue p-1 px-2 rounded-md border-2 flex items-center"
            to='/request'
          >
            Request
            <AiOutlinePlus className="ml-1" />
          </Link>
        {/* ) : (
          <></>
        )}{" "} */}
      </div>
      {notifications.length > 0 ? (
        <div>
          {notifications.map((notification, index) => (
            <Bar notification={notification} parent={parent} />
          ))}
        </div>
      ) : (
        <></>
      )}

      {Object.keys(outletNotifications).length > 0 ? (
        <>
          {Object.keys(outletNotifications).map((outlet, index) => (
            <div>
              {outletNotifications[outlet].length > 0 && (
                <div>
                  <p className="text-lg m-1 font-semibold">{outlet}</p>
                  {outletNotifications[outlet][0].map((notification, index) => (
                    <Bar notification={notification} parent={parent} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <></>
      )}


    </div>
  );
}

export default Notifications;
