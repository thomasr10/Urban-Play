import { Menu, Home, Volleyball, MessageCircle, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

function MenuDesktop() {

    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    function openMenu() {
        isOpen === false ? setIsOpen(true) : setIsOpen(false);
    }

    const { isAuthenticated, isUser } = useAuth();

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname])

    return (isAuthenticated && isUser) && (
        <div className='burger-menu-container'>
            <div className="icon-container" onClick={() => openMenu()}>
                {
                    (isOpen === false) ? <Menu className='burger-icon' /> : <X className='burger-icon'/>
                }    
            </div>
            <div className={(isOpen === true) ? 'open list-icon' : 'none list-icon'}>
                <ul className='menu'>
                    <li>
                        <Link to='/' className='link-container'>
                            <Home className='menu-icon' />
                            <span>Accueil</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/mes-activites' className='link-container'>
                            <Volleyball className='menu-icon' />
                            <span>Activités</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/messagerie' className='link-container'>
                            <MessageCircle className='menu-icon' />
                            <span>Discussions</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/profil' className='link-container'>
                            <User className='menu-icon' />
                            <span>Mon profil</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default MenuDesktop;