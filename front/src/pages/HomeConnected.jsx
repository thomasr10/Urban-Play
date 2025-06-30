import Logout from "../components/Logout";
import { Search } from 'lucide-react';
import Map from "../components/Map";
import { useEffect, useState } from "react";

function HomeConnected() {
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLat(latitude);
                setLong(longitude);
            },
            (error) => {
                console.error("Erreur géolocalisation :", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);


    return (
        <section className="raw-limit-size center home-connected">
            <section className="search-activities">
                <div className="search-container">
                    <input type="search" name="search-bar" id="search-bar" placeholder="Rechercher une activité" />
                    <Search className="search-input" />
                </div>

                {lat !== null && long !== null ? (
                    <Map lat={lat} long={long} />
                ) : (
                    <div className="loading-msg-container">
                        <p className="loading-message">Chargement de votre position...</p>
                    </div>
                )}

            </section>
            <section className="home-activities">
                <h2>Mes prochaines activités</h2>
            </section>
        </section>
    )
}

export default HomeConnected;