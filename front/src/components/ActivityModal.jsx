import { Link, useNavigate } from "react-router-dom";
import { act, useEffect, useState } from "react";
import { X } from 'lucide-react'
import ActivityList from "./ActivityList";
import { capitalizeText } from "../assets/js/capitalizeText";
import { getUserInfos } from "../api/userInfo";

function ActivityModal ({coordinates, name, adress, onClose}) {

    const [arrayActivities, setArrayActivities] = useState([]);
    const [userId, setUserId] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        getUserInfos()
        .then((data) => {
            setUserId(data.id);
        })
    }, []);

    async function getActivitiesFromLocation() {
        
        try {
            const response = await fetch('/api/activity/location', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ coordinates, name })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(`Erreur http : ${response.status}, ${data.message}`);
            }

            return data;
            
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getActivitiesFromLocation().then((data) => {
            console.log(data);
            setArrayActivities(data.activities);
        })
        .catch(err => console.error(err));
    }, []);

    function goToActivity(id) {
        navigate(`/activite/${id}`);
    }

    return (
        <div className="modal-bg">
            <div className="modal">
                <X className="x-icon" onClick={onClose}/>
                <h1>Les prochaines activités</h1>
                <div className="info-container">
                    <h2>{ capitalizeText(name) }</h2>
                    <p>{ adress }</p>
                </div>
                <div className="btn-container">
                    <Link to='/activite/creer' state= {{coords: coordinates, locationName: name, adress: adress}} >Ajouter une activité +</Link>
                </div>
                <div className="activity-list-container">
                    {
                        arrayActivities ? (
                            arrayActivities.map((activity) => (
                                <ActivityList key={activity.id} userName={activity.user.first_name} date={activity.activity_date.date} from={activity.hour_from.date} to={activity.hour_to.date} currentPlayers={activity.current_players} maxPlayers={activity.max_players} creatorId={activity.user.id} userId={userId} onClick={() => goToActivity(activity.id)}/>
                            ))
                        ) : 
                        <p className="alert-message">
                            Aucune activité pour ce lieu
                        </p>
                    }
                </div>
            </div>
        </div>
    )
}

export default ActivityModal;