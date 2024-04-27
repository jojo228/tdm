import React from 'react'
import SetupSidebar from './../../Layout/SetupSidebar';
import SetupContent from './SetupContent';

function Setup() {
  return (
    <div className="flex">
      <div
        className="px-7 max-h-[100vh] overflow-auto scrollbar-hide"
        style={{ width: "calc(100% - 18rem)" }}
      >
        <SetupContent />
      </div>
      <SetupSidebar />

    </div>
  )
}

export default Setup