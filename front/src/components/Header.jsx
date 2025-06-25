import HeaderConnected from './HeaderConnected';
import HeaderUnconnected from './HeaderUnconnected';
import { useAuth } from "../context/AuthContext";

function Header () {

    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <HeaderConnected /> : <HeaderUnconnected />;
 
}

export default Header;