import React from "react";

function SideMenuCurrents({ categories, setSelected }) {
  return (
    <div className="w-48 max-h-[75vh] overflow-auto" >
      {categories.map((item, index) => (
        <div className="h-12 border flex items-center justify-center" >
          <button
            className="text-docs-blue w-full h-full"
            onClick={(e) => {
              setSelected(item.item_category_name);
            }}
          >
            {item.item_category_name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default SideMenuCurrents;
