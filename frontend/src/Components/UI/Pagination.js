import React from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

export default function Pagination({
  perPage,
  total,
  paginateFront,
  paginateBack,
  currentPage,
}) {

  return (
    <div className="pt-2 flex w-full justify-end">
      <div className="flex items-center">
        <p className="text-sm text-gray-700">
          Showing&nbsp;
          <span className="font-medium">
            {currentPage * perPage - 8}&nbsp;
          </span>
          to
          <span className="font-medium"> {currentPage * perPage} </span>
          of
          <span className="font-medium"> {total} </span>
          results
        </p>

        <nav
          className="ml-4 relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            onClick={() => {
              if (currentPage - 1 > 0) {
                paginateBack();
              }
            }}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span>
              <AiOutlineArrowLeft />
            </span>
          </button>

          <button
            onClick={() => {
              if (currentPage + 1 <= Math.ceil(total / perPage)) {
                paginateFront();
              }
            }}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span>
              <AiOutlineArrowRight />
            </span>
          </button>
        </nav>
      </div>
      {/* <nav className="block"></nav>
      <div>
        
      </div> */}
    </div>
  );
}
