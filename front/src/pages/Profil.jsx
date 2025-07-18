import Button from "../components/Button";
import Logout from "../components/Logout";
import { getUserInfos } from "../api/userInfo";
import { useEffect, useState } from "react";
import Loader from '../components/Loader';
import { User } from 'lucide-react';

function Profil() {

    const [activities, setActivities] = useState('');
    const [userId, setUserId] = useState(null);
    const [countAllActivities, setCountAllActivities] = useState(null);
    const [userDesc, setUserDesc] = useState('');

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
        getUserInfos().then((data) => {
            console.log(data)
            setActivities(data.activities);
            setUserId(data.id);
            setUserDesc(data.description);
        }).catch((err) => console.error(err))
            .finally(endFetch);
    }, [])

    async function getUserActivity () {
        try {
            const response = await fetch('/api/user/activity/count', {
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
                setCountAllActivities(data.count_activities);
            })
            .catch(err => console.error(err))
            .finally(endFetch);
        }
    }, [userId]);

    return (
        <>
            {
                loadingCount > 0 ? <Loader /> :

                    <section className="profil raw-limit-size center">
                        <section className="profil-top">
                            <h1>Mon profil</h1>
                            <div className="pp-container">
                                <div className="background">
                                    <User className="icon"/>
                                </div>
                            </div>
                        </section>
                        <section className="profil-content">
                            <div className="flex-col">
                                <span className="title">Ma biographie</span>
                                <p className="bio-value">{ userDesc }</p>
                            </div>
                            {/* <div className="flex-between">
                                <span className="title">Mes intérêts</span>
                                <span className="value"></span>
                            </div> */}
                            <div className="flex-between">
                                <span className="title">Activités réalisées</span>
                                <span className="value">{ countAllActivities }</span>
                            </div>
                            <div className="flex-between">
                                <span className="title">Activités créées</span>
                                <span className="value">{activities}</span>
                            </div>
                            {/* <div className="flex-between">
                                <span className="title">Recommadations</span>
                                <span className="value"></span>
                            </div> */}
                        </section>
                        <div className="btn-container">
                            <Button type="button" to='/modifier-profil'>Modifier</Button>
                        </div>
                        <div className="btn-container logout-container">
                            <Logout />
                        </div>

                    </section>
            }
        </>
    )
}

export default Profil;