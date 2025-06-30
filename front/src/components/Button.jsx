import { useNavigate } from 'react-router-dom';

function Button({ type, children, to, onClick }) {
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (onClick) onClick(e);
        if (to) navigate(to);
    };
    return (
        <button className="btn btn-orange" type={type} to={to} onClick={handleClick}>{children}</button>
    )
}

export default Button;