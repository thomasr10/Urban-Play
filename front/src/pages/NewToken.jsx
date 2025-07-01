import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function NewToken () {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('expired_token');
    const [id, setId] = useState('');
    const navigate = useNavigate();
    
    async function sendNewToken() {
        try {
            const response = await fetch('/api/new-token', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({token})
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Erreur http : ${response.status}, ${data.message}`)
            }

            return data

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        sendNewToken().then((data) => {
            setId(data.id);
        }).catch((err) => {console.log(err)});
    }, []);

    useEffect(() => {
        if (id) {
            navigate(`/new-user/${id}`);
        }
    }, [id]);


    return (
        <h1>Test</h1>
    )
}

export default NewToken;