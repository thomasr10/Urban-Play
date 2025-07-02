import { Search } from 'lucide-react';
import Map from "../components/Map";
import { useEffect, useState } from "react";
import { getUserInfos } from "../api/userInfo";

function HomeConnected() {
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const token = localStorage.getItem('token');
    const [perimeter, setPerimeter] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        getUserInfos().then((data) => {
            setPerimeter(data.perimeter);
        }).catch((err) => {
            console.error(err);
        });
    }, [])

    async function getSportsLocation() {

        try {
            const response = await fetch('/api/sports-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({userInfos: { lat: lat, long: long, perimeter: perimeter}})
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(`Erreur Http : ${response.status}, ${data.message}`);
            }

            return data;

        } catch (err) {
            console.error(err);
        }
    }

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

    useEffect(() => {
        if (lat !== null && long !== null && perimeter !== null) {
            getSportsLocation()
            .then((data) => {
                if (Object.keys(data.data).length > 0){
                    console.log(data);
                    setMarkers(data.data.records.geometry);
                    console.log(markers)
                } else {
                    console.error(data.message);
                }
            });
        }
    }, [lat, long, perimeter])


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