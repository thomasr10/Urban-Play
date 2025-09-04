import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Loader from '../components/Loader';

function NewToken () {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('expired_token');
    const [id, setId] = useState('');
    const navigate = useNavigate();
    // Loader
    const [loadingCount, setLoadingCount] = useState(0);

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }    

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
        startFetch();
        sendNewToken().then((data) => {
            setId(data.id);
        }).catch((err) => {console.log(err)})
        .finally(endFetch);
    }, []);

    useEffect(() => {
        if (id) {
            navigate(`/new-user/${id}`);
        }
    }, [id]);


    return (
        <>
        {
            loadingCount > 0 ? <Loader/> :
            <h1>Test</h1>
        }
        </>
        
    )
}

export default NewToken;