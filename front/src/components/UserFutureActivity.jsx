import { formatDate, formatTime } from "../assets/js/formatDate";
import { capitalizeText } from "../assets/js/capitalizeText";
import { useNavigate } from "react-router-dom";

function UserFutureActivities ({ creatorName, creatorId, activityDate, activityDescription, currentPlayers, maxPlayers, location, userId, from, to, onClick }) {
    
    return (
        <div onClick={onClick} className="future-activity">
            <div>
                <span className="title">{(userId === creatorId) ? 'Mon activité' : `Activité de ${creatorName}`}</span>
                <span className="date"> - { formatDate(activityDate) }</span>
            </div>
            <div>
                <span className="desc">{ activityDescription }</span>
                <span className="players"> - { (currentPlayers / maxPlayers === 1) ? 'Complet' : currentPlayers + '/' + maxPlayers} </span>
            </div>
            <div>
                <span className="location"> { capitalizeText(location) } - </span><span className="hours"> { formatTime(from) } - { formatTime(to)} </span>
            </div>
        </div>
    )
}

export default UserFutureActivities;