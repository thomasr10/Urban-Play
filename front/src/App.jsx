import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Header from './components/Header';
import Menu from './components/Menu';
import Profil from './pages/Profil';
import ModifyProfil from './pages/ModifyProfil';
import NewUser from './pages/NewUser';
import VerifiyToken from './pages/VerifiyToken';
import NewToken from './pages/NewToken';

function App() {

  return (
    <AuthProvider>
      <Header/>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/new-user/:id" element={<NewUser/>} />
        <Route path="/verify-token" element={<VerifiyToken/>} />
        <Route path="/new-token" element={<NewToken/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/' element={<Home />} />
        <Route path='/profil' element={<Profil />} />
        <Route path='/modifier-profil' element={<ModifyProfil />} />
      </Routes>
      <Menu/>
    </AuthProvider>
  )
}

export default App
