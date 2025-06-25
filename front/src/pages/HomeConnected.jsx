import Logout from "../components/Logout";
import { Search } from 'lucide-react';
import Map from "../components/Map";
import { useEffect, useState } from "react";

function HomeConnected() {
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    useEffect(() => {
        const checkPosition = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLat(latitude);
                setLong(longitude);
            },
            (err) => {
                console.error(err);
                setLat(48.8566);
                setLong(2.3522);
            }
        );

        return () => navigator.geolocation.clearWatch(checkPosition);
    }, []);
    
    return (
        <section className="raw-limit-size center home-connected">
            {/* <Logout/> */}
            <section className="search-activities">
                <div className="search-container">
                    <input type="search" name="search-bar" id="search-bar" placeholder="Rechercher une activité"/>
                    <Search className="search-input"/>
                </div>
                <Map lat={lat} long={long}/>
            </section>
        </section>
    )
}

export default HomeConnected;