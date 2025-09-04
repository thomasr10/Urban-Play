import Loader from "../components/Loader";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {

    const [loadingCount, setLoadingCount] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated, isAdmin } = useAuth();

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, navigate])

    async function sendAdminLoginData(e) {
        e.preventDefault();
        startFetch();
        try {
            const response = await fetch('http://127.0.0.1:8000/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Erreur Http : ${response.status} | ${data.message}`)
            }

            login(data.token);
            navigate('/admin/dashboard');

        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            endFetch();
        }
    }

    return (
        <>
            {
                loadingCount > 0 ? <Loader /> :
                    <section className="raw-limit-size center">
                        <h1 className="h1-form">Connexion</h1>
                        <form className="form" onSubmit={sendAdminLoginData}>
                            <div>
                                <label htmlFor="email">Adresse mail</label>
                                <input type="text" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Adresse mail" required />
                            </div>
                            <div>
                                <label htmlFor="password">Mot de passe</label>
                                <input type="password" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required minLength={3} />
                            </div>
                            <div className="btn-container">
                                <Button type="submit">Valider</Button>
                            </div>
                        </form>
                    </section>
            }
        </>
    )
}

export default AdminLogin;