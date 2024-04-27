import React from "react";
import AddUser from './Users/AddUser';
import AddRole from './Users/AddRole';

function SetupModal({ showModal, setShowModal, type }) {
  return (
    <>
      {showModal ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-black opacity-40"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
              <div className="mt-3 sm:flex">
                <div className="mt-2 w-full text-center sm:ml-4 sm:text-left">
                  <h4 className="text-lg font-medium text-gray-800">
                    Add Employee
                  </h4>

                  <div className="border my-4"></div>
                  {type === "user" ? <AddUser /> : <AddRole/>}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default SetupModal;
