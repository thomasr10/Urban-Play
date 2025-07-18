import { useEffect, useState } from "react";
import { getUserInfos } from "../api/userInfo";
import Loader from "../components/Loader";
import UserActivities from "../components/UserActivity";
import { useNavigate } from "react-router-dom";

function UserActivity() {

    const [userId, setUserId] = useState(null);
    const [futureActivities, setFutureActivities] = useState([]);
    const [pastActivities, setPastActivities] = useState([]);

    const navigate = useNavigate();

    // Loader
    const [loadingCount, setLoadingCount] = useState(0);

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
        .finally(endFetch)
    }, []);


    async function getUserActivity() {
        try {
            const response = await fetch('/api/user/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId })
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
        if (userId) {
            startFetch();
            getUserActivity()
                .then((data) => {
                    console.log(data);
                    setFutureActivities(data.futureActivities);
                    setPastActivities(data.pastActivities);
                })
                .catch(err => console.error(err))
                .finally(endFetch);
        }
    }, [userId]);

    function goToActivity(id) {
        navigate(`/activite/${id}`);
    }

    return (
        <>
        {
            loadingCount > 0 ? <Loader /> :

            <section className="raw-limit-size center">
                <section className="future-activities">
                    <h1>Mes futures activités</h1>
                    <div className="activities-container">
                    {
                        futureActivities.length > 0 ? (
                            futureActivities.map((activity) => (
                                <UserActivities key={activity.activity.id} creatorId={activity.activityCreator.id} creatorName={activity.activityCreator.name} activityDate={activity.activity.date.date} activityDescription={activity.activity.description} currentPlayers={activity.activity.current_players} maxPlayers={activity.activity.max_players} location={activity.activity.location_name} userId={userId} from={activity.activity.hour_from.date} to={activity.activity.hour_to.date} onClick={() => goToActivity(activity.activity.id)}/>
                            ))
                        ) :
                        
                        <p className='no-activity-msg'>Aucune activité prévue prochainement</p>
                    }
                    </div>
                </section>
                <section className="past-activities">
                    <h1>Mes activités passées</h1>
                    <div className="activities-container">
                    {
                        pastActivities && (
                            pastActivities.map((activity) => (
                                <UserActivities key={activity.activity.id} creatorId={activity.activityCreator.id} creatorName={activity.activityCreator.name} activityDate={activity.activity.date.date} activityDescription={activity.activity.description} currentPlayers={activity.activity.current_players} maxPlayers={activity.activity.max_players} location={activity.activity.location_name} userId={userId} from={activity.activity.hour_from.date} to={activity.activity.hour_to.date} onClick={() => goToActivity(activity.activity.id)}/>
                            ))
                        )
                    }
                    </div>
                </section>
            </section>
        }
        </>
    )
}

export default UserActivity;