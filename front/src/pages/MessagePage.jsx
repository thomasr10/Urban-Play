import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { getUserInfos } from "../api/userInfo";
import GroupChat from "../components/GroupChat";
import { useNavigate } from "react-router-dom";

function MessagePage() {

    const [loadingCount, setLoadingCount] = useState(0);
    const [userId, setUserId] = useState(null);
    const [arrayGroupChat, setArrayGroupChat] = useState([]);
    const navigate = useNavigate();

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }

    function goToMessage(id) {
        navigate(`/discussion/${id}`);
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
                setArrayGroupChat(data.groupChat);
            })
            .catch(err => console.error(err))
            .finally(endFetch);
        }
    }, [userId])

    return (
        <>
        {
            loadingCount > 0 ? <Loader/> :

            <section className="raw-limit-size-center">
                <h1>Discussions</h1>

                <div className="group-chat-container">
                    {
                        arrayGroupChat ?
                        arrayGroupChat.map((groupChat) => (
                            <GroupChat key={groupChat.id} onClick={() => goToMessage(groupChat.id)} activityName={groupChat.activity.name} messageSender={(groupChat.last_message) ? (groupChat.last_message.user.id === userId) ? 'Moi : ' : `${groupChat.last_message.user.first_name} : ` : ''} messageContent={(groupChat.last_message) ? groupChat.last_message.content : 'Aucun message'}/>
                        )) :
                        'Aucun groupe de discussion pour le moment. Rejoignez une activité pour faire partie d\'un groupe.'
                    }
                </div>
            </section>
        }

        </>
    )
}

export default MessagePage;