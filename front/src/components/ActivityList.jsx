function ActivityList({ userName, date, from, to, currentPlayers, maxPlayers }) {

    function formatDate(dateString) {
        const date = new Date(dateString);

        if (isToday(date)) {
            return 'Aujourd\'hui';
        }

        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit'
        });
    }

    function formatTime(dateString) {
        const time = new Date(dateString);
        return time.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function isToday(date) {
        const today = new Date();

        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    return (
        <div className="activity-list">
            <div className="flex">
                <div>
                    <p className="title">Activité de {userName}</p>
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