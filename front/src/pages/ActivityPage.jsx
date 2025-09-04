import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDate, formatTime } from '../assets/js/formatDate';
import { getUserInfos } from '../api/userInfo';
import { capitalizeText } from '../assets/js/capitalizeText';
import SignalButton from '../components/SignalButton';
import Button from '../components/Button';
import Loader from '../components/Loader';
import ErrorPage from './ErrorPage';
import MessageModal from '../components/MessageModal';
import { useAuth } from '../context/AuthContext';

function ActivityPage() {

    const { id } = useParams();
    const [creatorName, setCreatorName] = useState('');
    const [activityLocation, setActivityLocation] = useState('');
    const [hourFrom, setHourFrom] = useState('');

    const [hourTo, setHourTo] = useState('');
    const [currentPlayers, setCurrentPlayers] = useState(null);
    const [maxPlayers, setMaxPlayers] = useState(null);
    const [description, setDescription] = useState(null);

    const [creatorId, setCreatorId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [activityDate, setActivityDate] = useState('');
    const [isInActivity, setIsInActivity] = useState(false);

    const [loadingCount, setLoadingCount] = useState(0);
    const [picturePath, setPicturePath] = useState('');
    const [notFound, setNotFound] = useState(false);
    const [groupChatId, setGroupChatId] = useState(null);

    const [modalVisibility, setModalVisibility] = useState(false);
    const [modalData, setModalData] = useState({});

    const { loggedFetch, isAuthenticated, isUser } = useAuth();

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }

    useEffect(() => {
        if (isAuthenticated && isUser) {
            startFetch();
            getUserInfos(loggedFetch).then((data) => {
                setUserId(data.id);
            })
                .catch(err => console.error(err))
                .finally(endFetch);
        }

    }, []);

    async function getActivityInfos() {
        try {
            const data = await loggedFetch(`/api/activity/${id}`, {
                method: 'GET',
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
        if (id) {
            startFetch();

            getActivityInfos(id)
                .then((data) => {
                    console.log(data);
                    if (data.success === true) {

                        setCreatorName(data.activity.user.first_name);
                        setActivityLocation(capitalizeText(data.activity.location_name));
                        setHourFrom(formatTime(data.activity.hour_from.date));

                        setHourTo(formatTime(data.activity.hour_to.date));
                        setCurrentPlayers(data.activity.current_players);
                        setMaxPlayers(data.activity.max_players);

                        setDescription(data.activity.description);
                        setCreatorId(data.activity.user.id);
                        setActivityDate(formatDate(data.activity.activity_date.date));
                        setPicturePath(data.activity.picture_path);
                    } else {
                        setNotFound(true);
                    }
                })
                .catch(err => console.error(err))
                .finally(endFetch);

        }
    }, [id]);

    async function getActivityGroupChat() {
        try {
            const data = await loggedFetch('/api/activity/groupchat', {
                method: 'POST',
                body: JSON.stringify({ id })
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
        if (id) {

            startFetch();
            getActivityGroupChat()
                .then((data) => {
                    setGroupChatId(data.groupChatId);
                })
                .catch(err => console.error(err))
                .finally(endFetch)
        }
    }, [id]);

    async function isUserInActivity() {
        try {
            const data = await loggedFetch('/api/user/activity', {
                method: 'POST',
                body: JSON.stringify({ userId, id })
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
        if (id && userId && userId !== creatorId) {
            startFetch();
            isUserInActivity().then((data) => {
                if (data) {
                    if (data.isInActivity === true) {
                        setIsInActivity(true);
                    }
                }
            })
                .catch(err => console.error(err))
                .finally(endFetch);
        }

    }, [id, userId, creatorId]);

    async function registerToActivity(e) {
        e.preventDefault();
        startFetch();

        try {
            const data = await loggedFetch('/api/activity/add-user', {
                method: 'POST',
                body: JSON.stringify({ id, userId })
            });

            if (!data) {
                throw new Error('Aucune donnée reçue');
            }

            setIsInActivity(true);
            setMaxPlayers(maxPlayers + 1);
            setModalData(
                {
                    title: 'Féliciations',
                    message: `Vous avez rejoins l'activité de ${creatorName}`,
                    btnMessage: 'Retour',
                    to: null,
                    onClose: () => setModalVisibility(false)
                }
            );

            setModalVisibility(true);

        } catch (err) {
            console.error(err);
        } finally {
            endFetch();
        }
    }

    return (
        <>
            {
                loadingCount > 0 ? <Loader /> :

                    notFound === true ? <ErrorPage /> :

                        <section className="raw-limit-size center activity-page">
                            {
                                (creatorId === userId) ?
                                    <h1>Mon activité</h1> : <h1>Activité de {creatorName}</h1>
                            }
                            <div className='picture-container'>
                                <figure>
                                    <img src={picturePath} alt="Image d'un city stade" />
                                </figure>
                            </div>
                            <div className="flex-between">
                                <span className="title">Lieu :</span>
                                <span className="value">{activityLocation}</span>
                            </div>
                            <div className="flex-between">
                                <span className="title">Date :</span>
                                <span className="value">{activityDate}</span>
                            </div>
                            <div className="flex-between">
                                <span className="title">Horaire :</span>
                                <span className="value">{hourFrom} - {hourTo} </span>
                            </div>
                            <div className="flex-between">
                                <span className="title">Nombre de participants :</span>
                                <span className="value">{currentPlayers} / {maxPlayers}</span>
                            </div>
                            <div>
                                <span className="title">Description : </span>
                                <p className="value-desc">{description}</p>
                            </div>
                            {/* BOUTON MESSAGE SI LE USER A REJOINT OU A CREE L ACTIVITE */}
                            {
                                (creatorId === userId) || (isInActivity === true) ?

                                    <div className="btn-container">
                                        <Button to={`/discussion/${groupChatId}`}>Discussion</Button>
                                    </div>

                                    :
                                    <div className="btn-container">
                                        <Button onClick={(e) => registerToActivity(e)}>M'inscrire</Button>
                                    </div>
                            }
                            {
                                (creatorId !== userId) ?
                                    <div className="btn-container">
                                        <SignalButton />
                                    </div>
                                    : ''
                            }
                        </section>

            }
            {
                modalVisibility && (
                    <MessageModal {...modalData} />
                )
            }
        </>


    )
}

export default ActivityPage;