import './App.css';
import { Routes, Route } from 'react-router-dom'
import UsersList from './components/UsersList'

function App() {
  const BASE_URL = ""
  const PORT = 5000
  const apiUrl=`${BASE_URL}:${PORT}/view`

  return (
    <Routes>
      <Route path="/users" element={<UsersList url={apiUrl} />} />
    </Routes>
  );
}

export default App;
