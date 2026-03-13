import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '../features/home/pages/Home'

const AppRouter = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<HomePage />} />

    </Routes>
    
    </BrowserRouter>
  )
}

export default AppRouter