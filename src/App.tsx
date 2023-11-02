import { useEffect, useState } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/index.tsx';
import DetailPage from './pages/DetailPage/index.tsx';
import LoginPage from './pages/LoginPage/index.tsx';
import NavBar from './components/NavBar.jsx';
import { v4 } from 'uuid';

const Layout = () => {
  console.log( v4())
  return (
    <>
      <NavBar />
      <br />
      <br />
      <br />
      <Outlet />
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />}/>
          <Route path="login" element={<LoginPage />}/>
          <Route path="/pokemon/:id" element={<DetailPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
