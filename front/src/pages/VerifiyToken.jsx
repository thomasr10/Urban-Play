import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

function VerifiyToken() {

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState('');
    const [isExpired, setIsExpired] = useState(false);
    const navigate = useNavigate();

    async function sendToken() {

        try {
            const response = await fetch('http://localhost:8000/verify-token', {
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

            navigate('/login');

            return data;
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        sendToken();
    }, []);

    return (
        <section className="raw-limit-size center">
            <h1>Vérification de l'utilisateur</h1>
            <p>{message}</p>
            {isExpired && (
                <p>
                    Le lien a expiré. <Link to="">Renvoyer l’e-mail</Link>
                </p>
            )}
        </section>
    )
}

export default VerifiyToken;