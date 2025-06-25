import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <button className="logout" onClick={handleLogout}>Déconnexion</button>
    )

}

export default Logout;