import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
// import Brand from "./../Components/Configs/Brand";
// import Category from "./../Components/Configs/Category";
// import Miscellaneous from "./../Components/Configs/Miscellaneous";
// import AddStock from "./../Components/Stocks/AddStock";
// import ViewStock from "./../Components/Stocks/ViewStock";
// import ViewOrder from "./../Components/Orders/ViewOrder";
// import MakeOrder from "./../Components/Orders/MakeOrder";
import Dashboard from "../Components/Dashboard/Dashboard";
import ViewReceipts from "../Components/Receipts/viewReceipts";
import ViewProduct from "./../Components/Products/ViewProduct";
import AddProduct from "./../Components/Products/AddProduct";
import AddProductCategory from "./../Components/Setup/ProductCategory/AddProductCategory";
import AddTaxGroup from "../Components/Setup/Taxes/AddTaxGroup";
import Setup from "./../Components/Setup/Setup";
import Sell from "../Components/Sell/Sell";
import AddProductOption from "../Components/Setup/ProductOption/AddProductOption";
import Register from "./Register";
import ViewCustomers from "./../Components/Customers/viewCustomers";
import ViewTaxGroup from "../Components/Setup/Taxes/ViewTaxGroup";
import PettyCash from "../Components/PettyCash/PettyCash";
import AddPaymentType from "../Components/Setup/PaymentTypes/AddPaymentType";
import ExpenseTrackingRouter from "../Components/ExpenseTracking/ExpenseTrackingRouter";
import Inventory from "../Components/Inventory/Inventory";
import Audit from "../Components/Inventory/Audit";
import axiosInstance from "../axiosAPI";
import ParentDashboard from "../Components/Dashboard/ParentDashboard";
import NoAccess from "./NoAccess";
import { RoleActions } from "../utils/roles";
import Kitchen from "../Components/Kitchen/Kitchen";
import Notifications from "../Components/Notifications/Notifications";
import RequestModal from "../Components/Notifications/RequestModal";

function Content() {
  const [parent, setParent] = useState(null);

  let role = localStorage.getItem("role");

  const getHotelDetails = () => {
    let hotel_id = localStorage.getItem("hotel_id");

    axiosInstance
      .get(`/hotel_info/${hotel_id}/`)
      .then((res) => {
        let hotelData = res.data;
        setParent(hotelData.parent);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const hotel_id = localStorage.hotel_id;
    const pathname = window.location.pathname;
    console.log(pathname);
    if (pathname !== "/register" && hotel_id == -1) {
      window.location.href = "./register";
    } else {
      getHotelDetails();
    }
  }, []);

  return (
    <Routes>
      {/* <Route path="/addOrder" element={<MakeOrder />} />
      <Route path="/orders" element={<ViewOrder />} />
      <Route path="/addStock" element={<AddStock />} />
      <Route path="/stocks" element={<ViewStock />} />
      <Route path="/config/brand" element={<Brand />} />
      <Route path="/config/category" element={<Category />} />
      <Route path="/config/miscellaneous" element={<Miscellaneous />} /> */}

      <Route
        exact
        path="/"
        element={parent ? <Dashboard /> : <ParentDashboard />}
      />

      <Route
        exact
        path="/sell"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Sell")) ? (
            <Sell />
          ) : (
            <NoAccess />
          )
        }
      />

      <Route
        exact
        path="/setup/*"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Setup")) ? (
            <Setup />
          ) : (
            <NoAccess />
          )
        }
      />

      <Route
        exact
        path="/tracker/*"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Expense Tracking")) ? (
            <ExpenseTrackingRouter parent={parent} />
          ) : (
            <NoAccess />
          )
        }
      />
      <Route
        exact
        path="/audit/:id"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Inventory")) ? (
            <Audit />
          ) : (
            <NoAccess />
          )
        }
      />
      <Route
        exact
        path="/inventory"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Inventory")) ? (
            <Inventory />
          ) : (
            <NoAccess />
          )
        }
      />

      <Route
        exact
        path="/notifications"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Notifications")) ? (
            <Notifications parent={parent} />
          ) : (
            <NoAccess />
          )
        }
      />

      <Route
        exact
        path="/request"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Notifications")) ? (
            <RequestModal parent={parent} />
          ) : (
            <NoAccess />
          )
        }
      />

      <Route exact path="/register" element={<Register />} />

      <Route
        exact
        path="/products"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Products")) ? (
            <ViewProduct />
          ) : (
            <NoAccess />
          )
        }
      />
      <Route
        exact
        path="/addProduct"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Products")) ? (
            <AddProduct />
          ) : (
            <NoAccess />
          )
        }
      />
      <Route
        exact
        path="/addProductCategory"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Products")) ? (
            <AddProductCategory />
          ) : (
            <NoAccess />
          )
        }
      />

      <Route
        path="/addProductOption"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Setup")) ? (
            <AddProductOption />
          ) : (
            <NoAccess />
          )
        }
      />
      <Route
        path="/addPaymentType"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Setup")) ? (
            <AddPaymentType />
          ) : (
            <NoAccess />
          )
        }
      />

      <Route
        exact
        path="/addTax"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Setup")) ? (
            <AddTaxGroup />
          ) : (
            <NoAccess />
          )
        }
      />
      <Route
        exact
        path="/viewTax"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Setup")) ? (
            <ViewTaxGroup />
          ) : (
            <NoAccess />
          )
        }
      />

      <Route
        exact
        path="/receipts"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Receipts")) ? (
            <ViewReceipts />
          ) : (
            <NoAccess />
          )
        }
      />
      <Route
        exact
        path="/cashflow"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Petty Cash")) ? (
            <PettyCash />
          ) : (
            <NoAccess />
          )
        }
      />

      <Route
        exact
        path="/customers"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Customers")) ? (
            <ViewCustomers />
          ) : (
            <NoAccess />
          )
        }
      />

      <Route
        exact
        path="/kitchen"
        element={
          role !== "undefined" &&
          (RoleActions[role][0] === "All" ||
            RoleActions[role].includes("Kitchen")) ? (
            <Kitchen parent={parent} />
          ) : (
            <NoAccess />
          )
        }
      />

      <Route exact path="/NotAllowed" element={<NoAccess />} />
    </Routes>
  );
}

export default Content;
