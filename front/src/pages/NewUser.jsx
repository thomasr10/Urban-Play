import { useEffect } from "react";
import Button from "../components/Button";
import { useParams } from "react-router-dom";

function NewUser () {

    const { id } = useParams();
    async function sendMail () {
        
        try {
            const response = await fetch('/api/mail/new-user', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id })
            });

            const data = response.json();

            if (!response.ok) {
                throw new Error(`Erreur http : ${response.status}, ${data.message}`);
            }

            return data;

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        sendMail().then((data) => {
            console.log(data);
        }).then((err) => {console.error(err)});
    }, [])

    return (
        <section className="raw-limit-size center verif-mail">
            <h1>Bienvenue sur Urban Play !</h1>
            <p>Pour pouvoir utiliser les fonctionnalités de notre site vous devez faire vérifier votre compte en cliquant sur le lien du mail que nous vous avons envoyé.</p>
            <div className="btn-container">
                <Button onClick={sendMail}>Renvoyer un mail</Button>
            </div>
        </section>
    )
}

export default NewUser;