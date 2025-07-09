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