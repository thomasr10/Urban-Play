import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        (token !== null) ? setIsAuthenticated(true) : setIsAuthenticated(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider };