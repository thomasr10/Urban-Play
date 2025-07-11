import { ArrowLeft, BellRing, Users, BellOff, Send } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TextareaMessage from "../components/TextareaMessage";
import Loader from "../components/Loader";
import { getUserInfos } from '../api/userInfo';
import Message from "../components/Message";

function GroupChatPage() {

    const [loadingCount, setLoadingCount] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState();
    const [firstName, setFirstName] = useState('');

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }

    function goToGroupChatPage() {
        navigate('/messagerie');
    }

    function changeNotificationParam() {
        !isMuted ? setIsMuted(true) : setIsMuted(false);
        // créer une propriété notifcation dans l'entité UGC et la modif selon le cas
    }

    useEffect(() => {
        startFetch();
        getUserInfos()
            .then((data) => {
                setUserId(data.id);
                setFirstName(data.firts_name);
            })
            .catch(err => console.error(err))
            .finally(endFetch);
    }, [])

    useEffect(() => {
        startFetch();
        const socket = new WebSocket('ws://localhost:8080');
        socketRef.current = socket;

        socket.addEventListener('open', () => {
            console.log('Server On');
        });

        socket.addEventListener('message', async (event) => {
            let text = event.data;

            if (event.data instanceof Blob) {
                text = await event.data.text(); 
            }

            try {
                const data = JSON.parse(text);

                if (data.type === 'message') {
                    setMessages((prev) => [...prev, data]);
                }
            } catch (err) {
                console.error('Erreur lors du parsing JSON :', err);
                console.log('Contenu brut reçu :', text);
            }
        });


        endFetch();

        return () => {
            socket.close();
        }
    }, []);

    function sendMessage(message) {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'message',
                content: message,
                id: userId,
                name: firstName
            }));
        } else {
            console.error('Socket non prêt');
        }
    }


    return (
        <>
            {
                loadingCount > 0 ? <Loader /> :

                    <section className="raw-limit-size center group-chat-page">
                        <div className="group-chat-header">
                            <div className="icon-container">
                                <ArrowLeft onClick={() => goToGroupChatPage()} />
                            </div>
                            <div className="group-chat-pp">
                                <div className="background">
                                    <Users className="icon" />
                                </div>
                            </div>
                            <div className="content">
                                <span className="activity-name">{'activityName'}</span>
                                <span className="activity-users">Tata, toto, titi, tutu</span>
                            </div>
                            <div className="icon-container">
                                {
                                    (isMuted === false) ? <BellRing onClick={() => changeNotificationParam()} /> :
                                        <BellOff onClick={() => changeNotificationParam()} />
                                }
                            </div>
                        </div>
                        <div className="msg-container">
                            {
                                messages && (
                                    messages.map((message, index) => (
                                        <Message key={index} senderId={message.id} userId={userId} senderName={message.name} content={message.content} />
                                    ))
                                )
                            }
                        </div>
                        <div className="send-msg-container">
                            <div className="input-container">
                                <TextareaMessage onSend={sendMessage} />
                            </div>
                        </div>
                    </section>
            }
        </>
    )
}

export default GroupChatPage;