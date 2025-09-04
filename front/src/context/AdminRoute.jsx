import { useAuth } from "./AuthContext";
import { Navigate } from 'react-router-dom';

function AdminRoute ({ children }) {

    const { isAuthenticated, isAdmin, authLoaded } = useAuth()

    if (!authLoaded) {
        return null;
    }
    
    if (!isAuthenticated && !isAdmin) {
        return <Navigate to="/" />
    }

    return children;
}

export default AdminRoute;