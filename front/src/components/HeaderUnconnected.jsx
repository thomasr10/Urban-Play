import { Link, useNavigate } from "react-router-dom";

function HeaderUnconnected () {

    const navigate = useNavigate();

    function goHome() {
        navigate('/');
    }

    return (
        <div className="header-unconnected">
            <span className="title-header" onClick={goHome}>Urban Play</span>
            <Link to='/login'>Connexion</Link>
        </div>
    )
}
export default HeaderUnconnected;