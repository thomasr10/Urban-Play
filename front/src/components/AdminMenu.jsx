import Logout from "../components/Logout";

function AdminMenu ({ onSelect }) {

    return (
        <div className="admin-menu-container">
            <div className="admin-menu">
                <ul>
                    <li>
                       <span className='link' id="1" onClick={onSelect}>Activités</span> 
                    </li>
                    <li>
                        <span className='link' id="2" onClick={onSelect}>Utilisateurs</span>
                    </li>
                    <li>
                        <span className='link' id="3" onClick={onSelect}>Signalement activités</span>
                    </li>
                    <li>
                        <span className='link' id="4" onClick={onSelect}>Signalement Utilisateurs</span>
                    </li>
                    <li>
                        <Logout/>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default AdminMenu;