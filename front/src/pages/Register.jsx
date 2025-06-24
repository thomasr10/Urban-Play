import Button from "../components/Button";
import {useState} from "react";


function Register() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function sendUserData(e) {
        e.preventDefault();

        try  {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ firstName, lastName, birthDate, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            
            alert(data.message);

        } catch (err) {
            console.error(`Erreur lors de l'inscription : ${err.message}`);
            alert(`Erreur lors de l'inscription : ${err.message}`);
        }
    }

    return(
        <>
            <h1 className="h1-form">Inscription</h1>
            <form onSubmit={sendUserData}>
                <div>
                    <label htmlFor="firstName">Prénom</label>
                    <input type="text" name="firstName" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" required/>
                </div>
                <div>
                    <label htmlFor="lastName">Nom</label>
                    <input type="text" name="lastName" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" required/>
                </div>
                <div>
                    <label htmlFor="birthDate">Date de naissance</label>
                    <input type="date" name="birthDate" id="birthDate" value={birthDate} onChange={e => setBirthDate(e.target.value)} required/>
                </div>
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

export default Register;