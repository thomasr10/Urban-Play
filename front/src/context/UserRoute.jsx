import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function UserRoute ({ children }) {
    const { isAuthenticated, isUser, authLoaded } = useAuth()

    if (!authLoaded) {
        return null;
    }
    if (!isAuthenticated && !isUser) {
        return <Navigate to="/" />
    }

    return children;
}

export default UserRoute;