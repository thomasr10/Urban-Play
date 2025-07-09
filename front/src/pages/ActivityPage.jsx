import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDate, formatTime } from '../assets/js/formatDate';
import { getUserInfos } from '../api/userInfo';
import { capitalizeText } from '../assets/js/capitalizeText';
import SignalButton from '../components/SignalButton';
import Button from '../components/Button';
import Loader from '../components/Loader';

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

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }

    useEffect(() => {
        startFetch();
        getUserInfos().then((data) => {
            setUserId(data.id);
        })
        .catch(err => console.error(err))
        .finally(endFetch);

    }, []);

    async function getActivityInfos() {
        try {
            const response = await fetch(`/api/activity/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = response.json();

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

            getActivityInfos(id).then((data) => {
                setCreatorName(data.activity.user.first_name);
                setActivityLocation(capitalizeText(data.activity.location_name));
                setHourFrom(formatTime(data.activity.hour_from.date));

                setHourTo(formatTime(data.activity.hour_to.date));
                setCurrentPlayers(data.activity.current_players);
                setMaxPlayers(data.activity.max_players);

                setDescription(data.activity.description);
                setCreatorId(data.activity.user.id);
                setActivityDate(formatDate(data.activity.activity_date.date));
            })
            .catch(err => console.error(err))
            .finally(endFetch);
        }
    }, [id]);


    async function isUserInActivity() {
        try {
            const response = await fetch('/api/user/activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId, id })
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

    return (
        <>
        {
            loadingCount > 0 ? <Loader /> :

            <section className="raw-limit-size center activity-page">
            {
                (creatorId === userId) ?
                    <h1>Mon activité</h1> : <h1>Activité de {creatorName}</h1>
            }
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
                (creatorId === userId)||(isInActivity === true) ?

                    <div className="btn-container">
                        <Button>Discussion</Button>
                    </div>

                    : ''
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
        
        </>
        

    )
}

export default ActivityPage;