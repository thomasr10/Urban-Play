import { Home, Volleyball, MessageCircle, User} from 'lucide-react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MenuMobile() {

    const { isAuthenticated, isUser } = useAuth();
    return (isAuthenticated && isUser) ? (
        <nav className='menu-container'>
            <ul className='menu'>
                <li>
                    <Link to='/' className='link-container'>
                        <Home className='menu-icon' />
                        <span>Accueil</span>
                    </Link>
                </li>
                <li>
                    <Link to='/mes-activites' className='link-container'>
                        <Volleyball className='menu-icon'/>
                        <span>Activités</span>
                    </Link>
                </li>
                <li>
                    <Link to='/messagerie' className='link-container'>
                        <MessageCircle className='menu-icon'/>
                        <span>Discussions</span>
                    </Link>
                </li>
                <li>
                    <Link to='/profil' className='link-container'>
                        <User className='menu-icon'/>
                        <span>Mon profil</span>
                    </Link>
                </li>
            </ul>
        </nav>
    ) : '';
}

export default MenuMobile;