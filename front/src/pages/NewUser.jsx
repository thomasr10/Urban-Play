import { useEffect } from "react";
import Button from "../components/Button";
import { useParams } from "react-router-dom";

function NewUser() {

    const { id } = useParams();
    // Loader
    const [loadingCount, setLoadingCount] = useState(0);

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }

    async function sendMail() {

        try {
            const response = await fetch('/api/mail/new-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        startFetch();
        sendMail().then((data) => {
            console.log(data);
        }).catch((err) => { console.error(err) })
            .finally(endFetch);
    }, [])

    return (
        <>
            {
                loadingCount > 0 ? <Loader /> :

                    <section className="raw-limit-size center verif-mail">
                        <h1>Bienvenue sur Urban Play !</h1>
                        <p>Pour pouvoir utiliser les fonctionnalités de notre site vous devez faire vérifier votre compte en cliquant sur le lien du mail que nous vous avons envoyé.</p>
                        <div className="btn-container">
                            <Button onClick={sendMail}>Renvoyer un mail</Button>
                        </div>
                    </section>
            }
        </>
    )
}

export default NewUser;