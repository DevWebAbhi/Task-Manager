import React from 'react'
import {Routes,Route} from "react-router-dom";
import Authentication from './Components/Authentication';
import Tasks from './Components/Tasks';

const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Authentication/>} />
        <Route path='/tasks' element={<Tasks/>} />
    </Routes>
  )
}

export default AllRoutes
