import { useEffect, useState } from "react";
import { getUserInfos } from "../api/userInfo";
import Loader from "../components/Loader";
import UserActivities from "../components/UserActivity";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function UserActivity() {

    const [userId, setUserId] = useState(null);
    const [futureActivities, setFutureActivities] = useState([]);
    const [pastActivities, setPastActivities] = useState([]);

    const navigate = useNavigate();

    // Loader
    const [loadingCount, setLoadingCount] = useState(0);

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
            getUserInfos(loggedFetch)
                .then((data) => {
                    setUserId(data.id);
                })
                .catch(err => console.error(err))
                .finally(endFetch);
        }
    }, []);


    async function getUserActivity() {
        try {
            const data = await loggedFetch('/api/user/activities', {
                method: 'POST',
                body: JSON.stringify({ userId })
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
                                            <UserActivities key={activity.activity.id} creatorId={activity.activityCreator.id} creatorName={activity.activityCreator.name} activityDate={activity.activity.date.date} activityDescription={activity.activity.description} currentPlayers={activity.activity.current_players} maxPlayers={activity.activity.max_players} location={activity.activity.location_name} userId={userId} from={activity.activity.hour_from.date} to={activity.activity.hour_to.date} onClick={() => goToActivity(activity.activity.id)} />
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
                                            <UserActivities key={activity.activity.id} creatorId={activity.activityCreator.id} creatorName={activity.activityCreator.name} activityDate={activity.activity.date.date} activityDescription={activity.activity.description} currentPlayers={activity.activity.current_players} maxPlayers={activity.activity.max_players} location={activity.activity.location_name} userId={userId} from={activity.activity.hour_from.date} to={activity.activity.hour_to.date} onClick={() => goToActivity(activity.activity.id)} />
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