import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import AuthPage from './components/auth/AuthPage';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage showLogin={true} />} />
        <Route path="/signup" element={<AuthPage showLogin={false} />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;