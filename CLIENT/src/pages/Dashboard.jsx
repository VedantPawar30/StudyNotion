import React from 'react'
import { useSelector } from 'react-redux';
import {RotatingLines} from 'react-loader-spinner';
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/core/Dashboard/Sidebar';
function Dashboard() {
  const {loading : authLoading} = useSelector((state) => state.auth);
  const {loading : profileLoading} = useSelector((state) => state.profile);
  if(authLoading || profileLoading){
    return (
      <div className='h-[80vh] flex justify-center items-center'>
        <RotatingLines
          strokeColor="#FFE83D"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    )
  }


  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard