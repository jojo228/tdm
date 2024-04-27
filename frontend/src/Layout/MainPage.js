import React, { useState } from "react";
import Content from "./Content";
import Sidebar from "./Sidebar";

function MainPage() {
  const [open, setOpen] = useState(true);
  const [isSetup, setIsSetup] = useState(false);

  return (
    <div className="flex">
      <Sidebar open={open} setOpen={setOpen} isSetup={isSetup} setIsSetup={setIsSetup}  />
      <div
        className={` ${isSetup?'p-0':'p-7'} max-h-[100vh] overflow-auto scrollbar-hide`}
        style={{ width: open?"calc(100% - 18rem)":"calc(100% - 5rem)" }}
      >
        <Content />
      </div>
    </div>
  );
}

export default MainPage;
