import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { X } from 'lucide-react'
import ActivityList from "./ActivityList";

function ActivityModal ({coordinates, name, onClose}) {

    // const [userName, setUserName] = useState('');
    // const [date, setDate] = useState('');
    // const [from, setFrom] = useState('');
    // const [to, setTo] = useState('');
    // const [currentPlayers, setCurrentPlayers] = useState(null);
    // const [maxPlayers, setMaxPlayers] = useState(null);

    const [arrayActivities, setArrayActivities] = useState([]);
    
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
            console.log(data);

            if (!response.ok) {
                throw new Error(`Erreur http : ${response.status}, ${data.message}`);
            }

            return data;
            
        } catch (err) {

        }
    }

    useEffect(() => {
        getActivitiesFromLocation().then((data) => {
            setArrayActivities(data.activities);
        })
        .catch(err => console.error(err));
    }, []);

    console.log(arrayActivities)
    return (
        <div className="modal-bg">
            <div className="modal">
                <X className="x-icon" onClick={onClose}/>
                <h1>Les prochaines activités</h1>
                <div className="info-container">
                    <h2>{ name }</h2>
                    <p>Adresse</p>
                </div>
                <div className="btn-container">
                    <Link to='/activite/creer' state= {{coords: coordinates, locationName: name}} >Ajouter une activité +</Link>
                </div>
                <div className="activity-list-container">
                    {
                        arrayActivities && (
                            arrayActivities.map((activity) => {
                                <ActivityList userName={activity.user.first_name} date={activity.activity_date} from={activity.from} to={activity.to} currentPlayers={activity.currentPlayers} maxPlayers={activity.maxPlayers}/>
                            })
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ActivityModal;