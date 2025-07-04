function ActivityList({ userName, date, from, to, currentPlayers, maxPlayers }) {

    return (
        <div className="activity-list">
            <div className="flex">
                <div>
                    <p className="title">Activité de {userName}</p>
                    <p>{date} - de {from} à {to}</p>
                </div>
                <span>
                    { (currentPlayers / maxPlayers === 1) ? 
                    'Complet' : currentPlayers + '/' + maxPlayers
                    }
                </span>
            </div>
        </div>
    )
}

export default ActivityList;