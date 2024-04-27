import React from 'react'
import { BsShieldLockFill } from 'react-icons/bs'

function NoAccess() {
  return (
    <div className='w-full h-[80vh] flex flex-col items-center justify-center' >
        <BsShieldLockFill size="160" className='text-docs-blue' />
        <p className='mt-2 font-semibold' >You Don't Have Access to this Feature</p>
    </div>
  )
}

export default NoAccess