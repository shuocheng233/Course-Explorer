import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import UsersList from './components/UsersList'
import HomePage from './components/home/HomePage';
import LoginPage from './components/login/LoginPage';
import './App.css'

function App() {
  const BASE_URL = "http://127.0.0.1"
  const PORT = 5000
  const apiUrl=`${BASE_URL}:${PORT}/`

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/users" element={<UsersList url={apiUrl} />} />
        <Route path="/login" element ={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
