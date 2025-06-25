import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Header from './components/Header';

function App() {

  return (
    <AuthProvider>
      <Header/>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/' element={<Home />} />
      </Routes>  
    </AuthProvider>
  )
}

export default App
