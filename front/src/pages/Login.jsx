import Button from "../components/Button";
import {useState} from "react";
import { useNavigate } from "react-router-dom";


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function sendLoginData(e) {
        e.preventDefault();

        try {
            const response = await fetch('/api/login_check', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Erreur Http : ${response.status} | ${data.message}`)
            }

            localStorage.setItem('token', data.token);
            navigate('/');

        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

    return (
        <>
            <h1 className="h1-form">Connexion</h1>
            <form onSubmit={sendLoginData}>
                <div>
                    <label htmlFor="email">Adresse mail</label>
                    <input type="text" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Adresse mail" required/>
                </div>
                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required minLength={3}/>
                </div>
                <div>
                    <Button type="submit">Valider</Button>
                </div>
            </form>        
        </>
    )
}

export default Login;