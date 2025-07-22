import { Routes, Route, useLocation } from 'react-router-dom';
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
import CreateActivity from './pages/CreateActivity';
import ActivityPage from './pages/ActivityPage';
import MessagePage from './pages/MessagePage';
import GroupChatPage from './pages/GroupChatPage';
import UserActivity from './pages/UserActivity';
import ErrorPage from './pages/ErrorPage';

function App() {

  const location = useLocation();

  const isGroupChatPage = location.pathname.startsWith('/discussion/')

  return (
    <AuthProvider>
      {!isGroupChatPage && <Header />}
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/new-user/:id" element={<NewUser/>} />
        <Route path="/verify-token" element={<VerifiyToken/>} />
        <Route path="/new-token" element={<NewToken/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/' element={<Home />} />
        <Route path='/activite/:id' element={<ActivityPage />} />
        <Route path='/mes-activites' element={<UserActivity />} />
        <Route path='/profil' element={<Profil />} />
        <Route path='/modifier-profil' element={<ModifyProfil />} />
        <Route path='/activite/creer' element={<CreateActivity />} />
        <Route path='/messagerie' element={<MessagePage />} />
        <Route path='/discussion/:id' element={<GroupChatPage />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
      {!isGroupChatPage && <Menu />}
    </AuthProvider>
  )
}

export default App
