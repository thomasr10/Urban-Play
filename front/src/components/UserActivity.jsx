import { formatDate, formatTime } from "../assets/js/formatDate";
import { capitalizeText } from "../assets/js/capitalizeText";

function UserActivities ({ creatorName, creatorId, activityDate, activityDescription, currentPlayers, maxPlayers, location, userId, from, to, onClick }) {
    
    function mergedDateAndTime(date, time) {
        
        const datePart = date.split(' ')[0];
        const timePart = time.split(' ')[1];
        
        return `${datePart} ${timePart}`;
    }

    return (
        <div onClick={onClick} className={(new Date(mergedDateAndTime(activityDate, from)) > new Date()) ? 'future-activity' : 'past-activity' }>
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

export default UserActivities;