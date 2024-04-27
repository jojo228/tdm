import React, { useState } from "react";
import {
  BsArrowLeftShort,
  BsFillTagFill,
  BsChevronDown,
  BsFillPersonFill,
  BsCashStack,
  BsReceiptCutoff,
} from "react-icons/bs";
import {
  GiMoneyStack,
  GiPerspectiveDiceSixFacesRandom,
  GiKitchenKnives,
} from "react-icons/gi";
import {
  RiDashboardFill,
  RiShoppingCartFill,
  RiSettings5Fill,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { IoIosApps } from "react-icons/io";
import {IoNotificationsCircleSharp} from "react-icons/io5"
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "./../actions/authActions";
import { RoleActions } from "../utils/roles";

const ConditionalLink = ({ children, ...props }) => {
  return props.to ? <Link {...props}>{children}</Link> : <>{children}</>;
};

function Sidebar({ open, setOpen, isSetup, setIsSetup }) {
  let role = localStorage.getItem("role");

  const dispatch = useDispatch();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const Menu = [
    { title: "Dashboard", to: "/" },
    { title: "Sell", icon: <RiShoppingCartFill />, to: "/sell" },
    { title: "Products", icon: <BsFillTagFill />, to: "/products" },
    { title: "Inventory", icon: <IoIosApps />, to: "/inventory" },
    { title: "Petty Cash", icon: <BsCashStack />, to: "/cashflow" },
    { title: "Expense Tracking", icon: <GiMoneyStack />, to: "/tracker" },
    { title: "Receipts", icon: <BsReceiptCutoff />, to: "/receipts" },
    { title: "Customers", icon: <BsFillPersonFill />, to: "/customers" },
    { title: "Kitchen", icon: <GiKitchenKnives />, to: "/kitchen" },
    { title: "Notifications", icon: <IoNotificationsCircleSharp />, to: "/notifications" },
  ];

  return (
    <div
      className={`bg-dark-purple h-screen p-5 pt-8 ${
        open ? "w-72" : "w-20"
      } duration-300 relative`}
    >
      <BsArrowLeftShort
        className={`bg-white text-dark-purple text-3xl rounded-full absolute -right-3 top-9 border border-dark-purple cursor-pointer ${
          !open && "rotate-180"
        }`}
        onClick={() => setOpen(!open)}
      />
      <div className="inline-flex">
        <GiPerspectiveDiceSixFacesRandom
          className={`text-white text-4xl rounded cursor-pointer block float-left mr-2 duration-500 ${
            open && "rotate-[360deg]"
          }`}
        />
        <h1
          className={`text-white origin-left font-medium text-2xl duration-300 ${
            !open && "scale-0"
          }`}
        >
          BIMS
        </h1>
      </div>

      <ul className="pt-2">
        {role !== "undefined" &&
          Menu.map((item, index) => (
            <>
              {RoleActions[role].includes(item.title) ||
              RoleActions[role][0] === "All" ? (
                <ConditionalLink to={item.to && item.to}>
                  <li
                    key={index}
                    className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md ${
                      item.spacing ? "mt-6" : "mt-2"
                    } `}
                  >
                    <span className="text-2xl text-gray-300 block float-left">
                      {item.icon ? item.icon : <RiDashboardFill />}
                    </span>
                    <span
                      className={`text-base font-medium flex-1 duration-200 ${
                        !open && "hidden"
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.submenu && open && (
                      <BsChevronDown
                        className={`duration-300 ${
                          subMenuOpen && "rotate-180"
                        }`}
                        onClick={() => setSubMenuOpen(!subMenuOpen)}
                      />
                    )}
                  </li>
                  {item.submenu && subMenuOpen && open && (
                    <ul>
                      {item.submenuItems.map((subMenuItem, sindex) => (
                        <ConditionalLink to={subMenuItem.to && subMenuItem.to}>
                          <li
                            key={sindex}
                            className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-12 hover:bg-light-white rounded-md"
                          >
                            {subMenuItem.title}
                          </li>
                        </ConditionalLink>
                      ))}
                    </ul>
                  )}
                </ConditionalLink>
              ) : (
                <></>
              )}
            </>
          ))}

        {role !== "undefined" &&
        (RoleActions[role].includes("Setup") ||
          RoleActions[role][0] === "All") ? (
          <Link to="/setup">
            <li
              key="setup"
              className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md mt-2`}
            >
              <span className="text-2xl text-gray-300 block float-left">
                <RiSettings5Fill />
              </span>
              <span
                className={`text-base font-medium flex-1 duration-200 ${
                  !open && "hidden"
                }`}
              >
                Setup
              </span>
            </li>
          </Link>
        ) : (
          <></>
        )}

        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            dispatch(logoutUser());
          }}
        >
          <li
            key="logout"
            className={`w-full text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md mt-2`}
          >
            <span className="text-2xl text-gray-300 block float-left">
              <RiLogoutBoxRLine />
            </span>
            <span
              className={`text-base font-medium flex-1 duration-200 ${
                !open && "hidden"
              }`}
            >
              Logout
            </span>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Sidebar;
