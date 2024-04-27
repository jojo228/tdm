import React from "react";
import EditInventory from "./EditInventory";
import EditAudit from "./EditAudit";
import AddEntry from "./AddEntry";

function Modal({ openModal, setOpenModal, editObject, type }) {
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
                className={`relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg`}
              >
                {type === "Add" ? (
                  <h1 className="text-2xl font-semibold">Add Inventory</h1>
                ) : (
                  <h1 className="text-2xl font-semibold">
                    Edit {type === "Inventory" ? "Inventory" : "Audit"} Item
                  </h1>
                )}
                <div className="mt-3 sm:flex">
                  {type === "Inventory" ? (
                    <EditInventory editObject={editObject} />
                  ) : type === "Add" ? (
                    <AddEntry />
                  ) : (
                    <EditAudit editObject={editObject} />
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
