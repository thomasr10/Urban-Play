import { Link } from "react-router-dom";
import { useEffect } from "react";
import { X } from 'lucide-react'

function ActivityModal ({coordinates, name, onClose}) {
    
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

        }
    }

    useEffect(() => {
        getActivitiesFromLocation();
    }, [])

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
            </div>
        </div>
    )
}

export default ActivityModal;