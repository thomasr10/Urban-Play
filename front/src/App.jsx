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
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './context/AdminRoute';
import UserRoute from './context/UserRoute';

function App() {

  const location = useLocation();

  const isGroupChatPage = location.pathname.startsWith('/discussion/')
  const isAdminDashboard = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      {!isGroupChatPage && <Header />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/new-user/:id" element={<NewUser />} />
        <Route path="/verify-token" element={<VerifiyToken />} />
        <Route path="/new-token" element={<NewToken />} />
        <Route path="/login" element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/activite/:id' element={
          <UserRoute>
            <ActivityPage />
          </UserRoute>
          } />
        <Route path='/mes-activites' element={
          <UserRoute>
            <UserActivity />
          </UserRoute>
          } />
        <Route path='/profil' element={
          <UserRoute>
            <Profil />
          </UserRoute>
          } />
        <Route path='/modifier-profil' element={
          <UserRoute>
            <ModifyProfil />
          </UserRoute>
          } />
        <Route path='/activite/creer' element={
          <UserRoute>
            <CreateActivity />
          </UserRoute>
          } />
        <Route path='/messagerie' element={
          <UserRoute>
            <MessagePage />
          </UserRoute>
          } />
        <Route path='/discussion/:id' element={
          <UserRoute>
            <GroupChatPage />
          </UserRoute>
          } />
        <Route path='*' element={<ErrorPage />} />
        <Route path='/admin/admin-login' element={<AdminLogin />} />
        <Route path='/admin/dashboard'
          element={
            <AdminRoute >
              <AdminDashboard />
            </AdminRoute>
          } />
      </Routes>
      {(!isGroupChatPage && !isAdminDashboard) && <Menu />}
    </AuthProvider>
  )
}

export default App
