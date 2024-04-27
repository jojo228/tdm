import React from "react";
import { Route, Routes } from "react-router-dom";
import ExpenseTracking from "./ExpenseTracking";
import Rent from "./Rent/Rent";
import EBill from "./EBill/EBill";
import Products from "./Products/Products";
import Salary from "./Salary/Salary";

function ExpenseTrackingRouter({parent}) {
  return (
    <Routes>
      <Route path="/rents" element={<Rent />} />
      <Route path="/EBills" element={<EBill />} />
      <Route path="/PProducts" element={<Products which="Purchasing" />} />
      <Route path="/RProducts" element={<Products which="Reselling" />} />
      <Route path="/salaries" element={<Salary />} />
      <Route path="/" element={<ExpenseTracking parent={parent} />} />
    </Routes>
  );
}

export default ExpenseTrackingRouter;
