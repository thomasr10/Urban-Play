import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        (token !== null) ? setIsAuthenticated(true) : setIsAuthenticated(false);
    })
}

export default AuthProvider;