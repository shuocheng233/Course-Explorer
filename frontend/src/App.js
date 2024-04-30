import { Routes, Route, BrowserRouter, Navigate, Outlet } from 'react-router-dom'
import AuthPage from './components/auth/AuthPage'
import Header from './components/common/Header'
import HomePage from './components/home/HomePage'
import Favorites from './components/favorites/Favorites'
import Sections from './components/section/Sections'
import SectionInfo from './components/section/SectionInfo'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage showLogin={true} />} />
        <Route path="/signup" element={<AuthPage showLogin={false} />} />
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/sections" element={<Sections />} />
          <Route path="/sectionInfo" element={<SectionInfo />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default App