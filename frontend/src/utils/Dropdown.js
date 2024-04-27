import React from "react";

const Dropdown = ({ list, addItem, removeTag, selectedItems,setSelected,type }) => {
  return (
    <div
      id={`dropdown${type}`}
      className="absolute shadow top-100 bg-white z-40 w-fit left-[-30px] rounded max-h-select overflow-y-auto "
    >
      <div className="flex flex-col w-full">
        <div
          key='all'
          className={`cursor-pointer w-full hover:bg-blue-500 border-b border-gray-200 `}
          onClick={() => {
            if (selectedItems.length===list.length) {
              setSelected([])
            } else {
              setSelected(list)
            }
          }}
        >
          <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
            <div className="w-full items-center flex">
              <input type="checkbox" checked={selectedItems.length===list.length} />
              <div className="mx-2 leading-6  ">All</div>
            </div>
          </div>
        </div>
        {list.map((item, key) => {
          return (
            <div
              key={key}
              className={`cursor-pointer w-full hover:bg-blue-500 border-b border-gray-200 `}
              onClick={() => {
                if (selectedItems.includes(item)) {
                  removeTag(item);
                } else {
                  addItem(item);
                }
              }}
            >
              <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                <div className="w-full items-center flex">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item)}
                  />
                  <div className="mx-2 leading-6  ">
                    {type==="categories"?item.item_category_name:item}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;
