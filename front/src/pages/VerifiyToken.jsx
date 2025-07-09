import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Loader from "../components/Loader";

function VerifiyToken() {

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState('');
    const [isExpired, setIsExpired] = useState(false);

    // Loader
    const [loadingCount, setLoadingCount] = useState(0);

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }

    async function sendToken() {

        try {
            const response = await fetch(`/api/verify-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            const data = await response.json();
            setMessage(data.message);

            if (!response.ok) {
                if (data.message === 'Le lien a expiré') {
                    setIsExpired(true);
                }
                throw new Error(`Erreur http : ${response.status}, ${message}`);
            }

            return data;

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        startFetch();
        sendToken();
        endFetch();
    }, []);

    return (
        <>
            {
                loadingCount > 0 ? <Loader /> :

                    <section className="raw-limit-size center verify-user">
                        <h1>Vérification de l'utilisateur</h1>
                        {isExpired ? (
                            <>
                                <p>
                                    Le lien de vérification que vous avez utilisé a expiré.
                                    Pas de panique ! Vous pouvez en demander un nouveau pour activer votre compte.
                                </p>
                                <div className="btn-container">
                                    <Link to={`/new-token?expired_token=${token}`}>Renvoyer l’e-mail</Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>{message}</p>
                                <div className="btn-container">
                                    <Link to='/login'>Se connecter</Link>
                                </div>
                            </>
                        )}
                    </section>
            }
        </>
    )
}

export default VerifiyToken;