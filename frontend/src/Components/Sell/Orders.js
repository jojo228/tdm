import React, { useEffect, useState } from "react";
import Card from "./Card";
import SideMenu from "./SideMenuOrders";
import axiosInstance from "../../axiosAPI";

function Orders({
  type,
  setType,
  setCurrent,
  tableIndex,
  setTableIndex,
  setDeliveryType,
}) {
  const [selected, setSelected] = useState("Tables");
  const [menu, setMenu] = useState({});
  const [tables, setTables] = useState([]);
  const [takeaways, setTakeaways] = useState([]);

  const getTables = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");

    await axiosInstance
      .get(`/table_status/?hotel=${hotel_id}`)
      .then((res) => {
        setTables(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTakeaways = async () => {
    axiosInstance.defaults.headers["Authorization"] =
      "Bearer " + localStorage.access_token;

    let hotel_id = localStorage.getItem("hotel_id");
    let url = `/sell_takeaways/?hotel=${hotel_id}`;
    axiosInstance
      .get(`${url}`)
      .then((res) => {
        console.log(res.data);
        setTakeaways(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTables();
    getTakeaways();
  }, []);

  useEffect(() => {
    let free = {};
    let occupied = {};
    let allTables = {};
    for (let i = 0; i < tables.length; i++) {
      if (tables[i].status === "occupied") {
        if (!occupied["data"]) {
          occupied["data"] = [];
        }

        occupied["data"].push({
          name: tables[i].table_id,
          progress: tables[i].status,
        });
      } else {
        if (!free["data"]) {
          free["data"] = [];
        }

        free["data"].push({
          name: tables[i].table_id,
          progress: tables[i].status,
        });
      }

      if (!allTables["data"]) {
        allTables["data"] = [];
      }

      allTables["data"].push({
        name: tables[i].table_id,
        progress: tables[i].status,
      });
    }

    console.log({
      Tables: allTables,
      Free: free,
      Occupied: occupied,
    });

    setMenu({
      Tables: allTables,
      Free: free,
      Occupied: occupied,
    });
  }, [tables]);

  const getTableIndex = (table) => {
    return tables.findIndex((x) => x.table_id === table.name) + 1;
  };

  return (
    <div>
      <div>
        <div className="p-2 flex bg-white">
          {menu && <SideMenu Menu={menu} setSelected={setSelected} />}
          <div className="ml-4 h-full lg:flex lg:justify-center lg:items-center">
            <div className="grid lg:grid-cols-7 gap-12 lg:gap-2">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setType("Current");
                  setDeliveryType("takeaway");
                }}
              >
                <div
                  className={`w-32 h-32 p-2 cursor-pointer border border-b-4 shadow-[0px 5px 20px 1px] rounded-md flex items-center justify-center text-center border-b-blue-500 `}
                >
                  TakeAway
                </div>
              </div>
              {takeaways.map((takeaway, i) => (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setType("Current");
                    setDeliveryType("takeaway");
                    setCurrent(takeaway.id)
                  }}
                >
                  <div
                    className={`w-32 h-32 p-2 cursor-pointer border border-b-4 shadow-[0px 5px 20px 1px] rounded-md flex flex-col items-center justify-center text-center border-b-blue-500 `}
                  >
                    TakeAway
                    <p className="font-light" >{takeaway.customer_details.customer_name} - {takeaway.id}</p>
                  </div>
                </div>
              ))}
              {Object.keys(menu).length > 0 &&
                Object.keys(menu[selected]).length > 0 &&
                menu[selected].data.map((item, i) => (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrent(item);
                      setTableIndex(getTableIndex(item));
                      setType("Current");
                      setDeliveryType("table order");
                    }}
                  >
                    <Card data={item} type={type} index={getTableIndex(item)} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
