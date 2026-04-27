import React from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Register from './pages/Register'
import Login from './pages/Login'
import OtpVerify from './pages/OtpVerify'
import Feed from './pages/Feed'
import Reels from './pages/Reels'
import FoodDetail from './pages/FoodDetail'
import Cart from './pages/Cart'
import Create from './pages/Create'
import AdminDashboard from './pages/AdminDashboard'
import Edit from './pages/Edit'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-otp' element={<OtpVerify />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/reels' element={<Reels />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/food/:id' element={<FoodDetail />} />
        <Route path='/create' element={<Create />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/edit/:id' element={<Edit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App