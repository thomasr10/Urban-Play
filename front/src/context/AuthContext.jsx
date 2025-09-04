import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const navigate = useNavigate();
    const [authLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {

            const decodedToken = jwtDecode(token);
            setIsAuthenticated(true);
            decodedToken.roles === 'ROLE_ADMIN' ? setIsAdmin(true) : setIsUser(true);

        } else {
            setIsAuthenticated(false);
        }

        setAuthLoaded(true);
    }, []);

    const login = (token) => {
        const decodedToken = jwtDecode(token);
        localStorage.setItem('token', token);

        if (decodedToken.roles === 'ROLE_ADMIN') {
            setIsAdmin(true);
            setIsUser(false);
            setIsAuthenticated(true);
            navigate('/admin/dashboard');
        } else {
            setIsAdmin(false);
            setIsUser(true);
            setIsAuthenticated(true);
            navigate('/');
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsUser(false);
    }

    async function loggedFetch(url, options = {}) {
        const token = localStorage.getItem('token');

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.status === 401) {
            logout();
            alert('Votre session a expiré. Veuillez vous reconnecter');
            navigate('/');
            return null;
        }

        return response.json();
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isAdmin, isUser, loggedFetch, authLoaded }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider };