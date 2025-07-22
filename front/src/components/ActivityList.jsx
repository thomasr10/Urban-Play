import {formatDate, formatTime} from '../assets/js/formatDate'

function ActivityList({ userName, date, from, to, currentPlayers, maxPlayers, onClick, creatorId, userId }) {

    return (
        <div className="activity-list" onClick={onClick}>
            <div className="flex">
                <div>
                    <p className="title">{ (userId === creatorId) ? 'Mon activité' : `Activité de ${userName}` }</p>
                    <p>{formatDate(date)} - de {formatTime(from)} à {formatTime(to)}</p>
                </div>
                <span>
                    {(currentPlayers / maxPlayers === 1) ?
                        'Complet' : `${currentPlayers} / ${maxPlayers}` 
                    }
                </span>
            </div>
        </div>
    )
}

export default ActivityList;