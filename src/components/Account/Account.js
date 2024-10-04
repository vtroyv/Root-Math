import React from 'react'
import AccountSidebar from './AccountSidebar'
import { Outlet } from 'react-router-dom'

const Account = () => {
  return (
    
      <div className="account-container">
        <div className="sidebar-container">
      <AccountSidebar color="info" style={{height: '100vh'}}/>
      </div>

      <div className="account-outlet">
      <Outlet/>
      </div>
      

      
      </div>
  )
}

export default Account