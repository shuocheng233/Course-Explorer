import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import UsersList from './components/UsersList'
import HomePage from './components/home/HomePage';

function App() {
  const BASE_URL = "http://127.0.0.1"
  const PORT = 5000
  const apiUrl=`${BASE_URL}:${PORT}/`

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersList url={apiUrl} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
