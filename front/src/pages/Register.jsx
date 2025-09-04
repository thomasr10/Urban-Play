import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Register() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');

    const navigate = useNavigate();
    const { login, isAuthenticated, isUser } = useAuth();

    // Loader
    const [loadingCount, setLoadingCount] = useState(0);

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }


    useEffect(() => {
        if (isAuthenticated && isUser) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    async function sendUserData(e) {
        e.preventDefault();
        startFetch();

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, birthDate, email, password, gender })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert(data.message);
            navigate(`/new-user/${data.id}`);

        } catch (err) {
            console.error(`Erreur lors de l'inscription : ${err.message}`);
            alert(`Erreur lors de l'inscription : ${err.message}`);
        } finally {
            endFetch();

        }
    }

    return (
        <>
            <h1 className="h1-form">Inscription</h1>
            <section className="raw-limit-size center page-section">
                <form onSubmit={sendUserData} className="form">
                    <div>
                        <label htmlFor="firstName">Prénom</label>
                        <input type="text" name="firstName" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" required />
                    </div>
                    <div>
                        <label htmlFor="lastName">Nom</label>
                        <input type="text" name="lastName" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" required />
                    </div>
                    <section className="input-container">
                        <div>
                            <label htmlFor="birthDate">Date de naissance</label>
                            <input type="date" name="birthDate" id="birthDate" value={birthDate} onChange={e => setBirthDate(e.target.value)} required />
                        </div>
                        <div>
                            <label htmlFor="gender">Genre</label>
                            <select name="gender" id="gender" value={gender} onChange={e => setGender(e.target.value)} required>
                                <option value="">Choisir une option</option>
                                <option value="H">Homme</option>
                                <option value="F">Femme</option>
                                <option value="A">Autre</option>
                            </select>
                        </div>
                    </section>
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
                <Link to='/login' className="account-link">J'ai déjà un compte</Link>
            </section>
        </>

    )
}

export default Register;