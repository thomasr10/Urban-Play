import { useEffect } from "react";
import Map from "../components/Map";
import Button from "../components/Button"

function HomeUnconnected() {

    return (
        <>
        <section className="home-unco">
            <section className="hero">
                <figure>
                    <img src="/img/home-city-img.webp" alt="Image d'un city stade" />
                    <p className="home-unco-hero-title">Bienvenue sur Urban Play</p>
                </figure>                
            </section>
            <section className="home-unco-content raw-limit-size center">
                <h1>Le sport commence dans ta rue</h1>
                <h2>Rejoins des parties près de chez toi ou crée la tienne</h2>
                <p>Urban play est la plateforme qui connecte les passionné.es de sport en ville. Découvre les terrains accessibles autour de toi (city-stades, paniers de quartier, espaces en libre accès...) et rejoins des parties de foot ou de basket en quelques clics.</p>
                <Map />
                <p>Grâce à une carte intéractive, tu peux voir où et quand se dérouleront les prochaines activités. Tu veux lancer ton propre match ? Crée une activité, choisis ton lieu et laisse les joueurs du coin s’y inscrire librement.</p>
                <p>Plus besoin d’attendre que ça s’organise : Urban Play fait du sport un réflexe local et spontané.</p>
            </section>
            <div className="btn-container">
                {/* <Button to={'/register'}>S'inscrire</Button> */}
            </div>
        </section>
        <footer className="footer">
            <div className="links">
                <span>Contact</span>
                <span>CGU</span>
                <span>Réseaux sociaux</span>
            </div>
            <div className="credit">
                <span>© 2025 Urban Play</span>
            </div>
        </footer>
        </>
    )
}

export default HomeUnconnected;