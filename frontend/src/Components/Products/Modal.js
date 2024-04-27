import React from "react";
import AddProduct from "./AddProduct";

function Modal({ editModal, setEditModal, editItem }) {
  return (
    <>
      {editModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => setEditModal(false)}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                <div className="mt-3 sm:flex">
                  <AddProduct
                    modal={true}
                    editid={editItem?editItem.id:""}
                    mname={editItem ? editItem.name : ""}
                    mcategory={editItem ? editItem.item_category_name : ""}
                    mtaxGroup={editItem ? editItem.tax_group_name : ""}
                    mprice={editItem ? editItem.net_price : ""}
                    mquantity={
                      editItem
                        ? editItem.quantity
                          ? editItem.quantity
                          : 1
                        : ""
                    }
                  />
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
