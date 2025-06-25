import { Link } from "react-router-dom";

function HeaderUnconnected () {

    return (
        <div className="header-unconnected">
            <span className="title-header">Urban Play</span>
            <Link to='/login'>Connexion</Link>
        </div>
    )
}
export default HeaderUnconnected;