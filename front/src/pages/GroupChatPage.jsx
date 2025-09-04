// Page d'une discussion

import { ArrowLeft, BellRing, Users, BellOff, Send } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TextareaMessage from "../components/TextareaMessage";
import Loader from "../components/Loader";
import { getUserInfos } from '../api/userInfo';
import Message from "../components/Message";
import { formatTime } from '../assets/js/formatDate'
import ErrorPage from './ErrorPage';
import { useAuth } from '../context/AuthContext';

function GroupChatPage() {

    const [loadingCount, setLoadingCount] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState();
    const [firstName, setFirstName] = useState('');
    const { id } = useParams(); // groupChatId
    const [lastMessage, setLastMessage] = useState(null);
    const [activityName, setActivityName] = useState('');
    const [usersInActivity, setUsersInActivity] = useState([]);

    const [notFound, setNotFound] = useState(false);

    const { isAuthenticated, isUser, loggedFetch } = useAuth();

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

    async function getActivityInfos() {
        try {
            const response = await fetch('/api/activity/infos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ id })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Erreur Http : ${response.status}, ${data.message}`);
            }

            return data;

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (id) {
            startFetch();
            getActivityInfos()
                .then((data) => {
                    console.log(data);
                    setActivityName(data.activityInfos.name);
                    setUsersInActivity(data.users);
                })
                .catch(err => console.error(err))
                .finally(endFetch);
        }
    }, [id])

    useEffect(() => {
        if (isAuthenticated && isUser) {
            startFetch();
            getUserInfos(loggedFetch)
                .then((data) => {
                    setUserId(data.id);
                    setFirstName(data.first_name);
                })
                .catch(err => console.error(err))
                .finally(endFetch);
        }
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
                console.log(data)
                if (data.type === 'message') {
                    setMessages((prev) => [...prev, data]);
                }
            } catch (err) {
                console.error('Erreur JSON :', err);
            }
        });


        endFetch();

        return () => {
            socket.close();
        }
    }, []);

    async function getMessages() {
        try {
            const data = await fetch('/api/message/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ id, lastMessage })
            });

            if (!data) {
                throw new Error('Aucune donnée reçue');
            }

            return data;

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        startFetch();
        getMessages()
            .then((data) => {
                if (data.success === true) {
                    setLastMessage(data.lastMessages[0].id);
                    data.lastMessages.forEach(message => {
                        setMessages((prev) => [...prev, message]);
                    });
                } else {
                    setNotFound(true);
                }

            })
            .catch(err => console.error(err))
            .finally(endFetch);
    }, [id])

    async function sendMessage(message) {
        try {
            const response = await fetch('/api/message/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ message, id, userId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Erreur Http : ${response.status}, ${data.message}`);
            }

            return data;

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            {
                loadingCount > 0 ? <Loader /> :

                    notFound === true ? <ErrorPage /> :
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
                                    <span className="activity-name">{activityName}</span>
                                    <div>
                                        {
                                            usersInActivity && (
                                                usersInActivity.map((user, index) => (
                                                    <span key={index} className="activity-users">
                                                        {
                                                            (index === 5) ? '...' : (index < usersInActivity.length - 1) ? (userId == user.id) ? 'Moi, ' : `${user.first_name}, ` : (userId == user.id) ? 'Moi' : user.first_name
                                                        }
                                                    </span>
                                                ))
                                            )
                                        }

                                    </div>
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
                                        messages.map((message) => (
                                            <Message key={message.id} senderId={message.senderId} userId={userId} senderName={message.senderName} content={message.content} sentAt={formatTime(message.sentAt)} />
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