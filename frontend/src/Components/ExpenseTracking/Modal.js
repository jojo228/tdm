import React from "react";
import EditRent from "./Rent/EditRent";
import AddRent from "./Rent/AddRent";
import EditSalary from "./Salary/EditSalary";
import AddSalary from "./Salary/AddSalary";
import EditEBill from "./EBill/EditEBill";
import AddEBill from "./EBill/AddEBill";
import EditProduct from "./Products/EditProduct";
import AddProduct from "./Products/AddProduct";

function Modal({ openModal, setOpenModal, category, type, editObject, which }) {
  return (
    <>
      {openModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => setOpenModal(false)}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div
                className={`relative w-full ${
                  category === "Product" && type === "Edit"
                    ? "max-w-[40rem]"
                    : "max-w-lg"
                } p-4 mx-auto bg-white rounded-md shadow-lg`}
              >
                <h1 className="text-2xl font-semibold">
                  {type} {which} {category}
                </h1>
                <div
                  className={`mt-3 ${
                    (category === "Product" && type === "Edit")?'':'sm:flex'
                  } `}
                >
                  {category === "Rent" ? (
                    type === "Edit" ? (
                      <EditRent editObject={editObject} />
                    ) : (
                      <AddRent />
                    )
                  ) : category === "Salary" ? (
                    type === "Edit" ? (
                      <EditSalary editObject={editObject} />
                    ) : (
                      <AddSalary />
                    )
                  ) : category === "EBill" ? (
                    type === "Edit" ? (
                      <EditEBill editObject={editObject} />
                    ) : (
                      <AddEBill />
                    )
                  ) : category === "Product" ? (
                    type === "Edit" ? (
                      <EditProduct editObject={editObject} which={which} />
                    ) : (
                      <AddProduct which={which} />
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Modal;
