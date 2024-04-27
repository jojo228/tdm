import React from "react";

function SideMenu({ Menu, setSelected }) {
  return (
    <div className="w-48" >
      {Object.keys(Menu).map((item, index) => (
        <div className="h-12 border flex items-center justify-center" >
          <button
            className="text-docs-blue w-full h-full"
            onClick={(e) => {
              setSelected(item);
            }}
          >
            {item}
          </button>
        </div>
      ))}
    </div>
  );
}

export default SideMenu;
