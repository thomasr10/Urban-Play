function AdminActivity() {
    return (
        <div className="admin-section">
            <h1>Dashboard Activité</h1>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sport</th>
                            <th>ID user</th>
                            <th>Nom</th>
                            <th>Lieu</th>
                            <th>Date de l'activité</th>
                            <th>De</th>
                            <th>À</th>
                            <th>Nb joueurs max</th>
                            <th>Nb joueurs actuel</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Date de création</th>
                            <th>Description</th>
                            <th>Passée</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}

export default AdminActivity;