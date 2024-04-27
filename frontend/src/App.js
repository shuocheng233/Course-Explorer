import { Routes, Route, BrowserRouter, Navigate, Outlet } from 'react-router-dom'
import AuthPage from './components/auth/AuthPage';
import Header from './components/commmon/Header'
import HomePage from './components/home/HomePage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage showLogin={true} />} />
        <Route path="/signup" element={<AuthPage showLogin={false} />} />
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default App;