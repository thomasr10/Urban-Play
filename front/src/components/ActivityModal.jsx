import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { X } from 'lucide-react'
import ActivityList from "./ActivityList";

function ActivityModal ({coordinates, name, adress, onClose}) {

    const [arrayActivities, setArrayActivities] = useState([]);
    
    // le nom du lieu est stocké en uppercase (va savoir pourquoi) dcp je le rends + stylé
    function capitalizeText(string) {
        let newString = '';
        
        for(let i = 0; i <= string.length; i++) {
            if (string[i] === string[0] || string[i - 1] === ' ' || string[i - 1] === '"' || string[i - 1] === '-') {
                newString += string.charAt(i);
            } else {
                newString += string.charAt(i).toLowerCase();
            }
        }

        return newString;
    }
    
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
                                <ActivityList key={activity.id} userName={activity.user.first_name} date={activity.activity_date.date} from={activity.hour_from.date} to={activity.hour_to.date} currentPlayers={activity.current_players} maxPlayers={activity.max_players}/>
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