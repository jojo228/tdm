import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ConditionalLink = ({ children, ...props }) => {
  return props.to ? <Link {...props}>{children}</Link> : <>{children}</>;
};

function SetupSidebar() {
  const auth = useSelector((state) => state.auth);

  const Menu = [
    { title: "Shop", to: "/setup" },
    // { title: "Registers", to: "/setup/registers" },
    { title: "Product Categories", to: "/setup/viewProductCategories" },
    { title: "Product Options", to: "/setup/viewProductOptions" },
    { title: "Taxes", to: "/setup/viewTax" },
    { title: "Users", to: "/setup/users" },
    { title: "Tables", to: "/setup/tables" },
    { title: "Payment Types", to: "/setup/paymentTypes" },
    { title: "Services", to: "/setup/services" },
    // { title: "Discount Rules", to: "/setup/discounts" },
    // { title: "Additional Charges", to: "/setup/charges" },
    // { title: "Custom Fields", to: "/setup/customFields" },
    // { title: "Preferences", to: "/setup/Preferences" },
    // { title: "Printers", to: "/setup/Printers" },
  ];

  return (
    <div
      className={`fixed bg-dark-purple h-fit p-5 pt-8 w-72 duration-300 rounded-l-md right-0`}
    >
      <div className="inline-flex">
        <h1
          className={`text-white origin-left font-medium text-2xl duration-300 `}
        >
          Setup
        </h1>
      </div>

      <ul className="pt-2">
        {Menu.map((item, index) => (
          <>
            <ConditionalLink to={item.to && item.to}>
              <li
                key={index}
                className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md `}
              >
                <span className={`text-base font-medium flex-1 duration-200`}>
                  {item.title}
                </span>
              </li>
            </ConditionalLink>
          </>
        ))}
      </ul>
    </div>
  );
}

export default SetupSidebar;
