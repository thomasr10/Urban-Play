import { Link } from "react-router-dom";

function ErrorPage() {

    return (
        <section className="error-page">
            <h1>Oups, cette page n'existe pas ou n'existe plus !</h1>
            <div className="btn-container">
                <Link to='/' className="link">Retourner à l'accueil</Link>
            </div>
           
        </section>

    )
}

export default ErrorPage;