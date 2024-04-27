import React from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Shop from "./Shop";
import ProductOptions from "./ProductOption/ProductOptions";
import Users from "./Users/Users";
import Tables from "./Tables";
import ProductCategories from "./ProductCategory/ProductCategories";
import ViewTaxGroup from "./Taxes/ViewTaxGroup";
import PaymentTypes from "./PaymentTypes/PaymentTypes";
import Outlets from "./Outlets/Outlets";
import AddOutlet from "./Outlets/AddOutlet";
import Services from "./Services/Services";

function SetupContent() {
  return (
    <Routes>
      <Route path="/users" element={<Users />} />

      <Route path="/viewTax" element={<ViewTaxGroup />} />

      <Route path="/viewProductOptions" element={<ProductOptions />} />
      <Route path="/viewProductCategories" element={<ProductCategories />} />
      <Route path="/tables" element={<Tables />} />
      <Route path="/paymentTypes" element={<PaymentTypes />} />
      <Route path="/outlets" element={<Outlets />} />
      <Route path="/addOutlet" element={<AddOutlet />} />
      <Route path="/services" element={<Services />} />
      <Route path="/" element={<Shop />} />
    </Routes>
  );
}

export default SetupContent;
