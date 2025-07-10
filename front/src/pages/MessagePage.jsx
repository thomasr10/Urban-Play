import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { getUserInfos } from "../api/userInfo";

function MessagePage() {

    const [loadingCount, setLoadingCount] = useState(0);
    const [userId, setUserId] = useState(null);

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }

    useEffect(() => {
        startFetch();
        getUserInfos()
        .then((data) => {
            setUserId(data.id);
        })
        .catch(err => console.error(err))
        .finally(endFetch);
    }, []);

    async function getUserGroupChat() {
        try {
            const response = await fetch('/api/user/group-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId })
            });

            const data  = await response.json();

            if (!response.ok) {
                throw new Error(`Erreur Http : ${response.status}, ${data.message}`);
            }

            return data;

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (userId) {
            startFetch();
            getUserGroupChat()
            .then((data) => {
                console.log(data);
            })
            .catch(err => console.error(err))
            .finally(endFetch);
        }
    }, [userId])

    return (
        <>
        {
            loadingCount > 0 ? <Loader/> :

            <section>
                <h1>Discussions</h1>
            </section>
        }

        </>
    )
}

export default MessagePage;