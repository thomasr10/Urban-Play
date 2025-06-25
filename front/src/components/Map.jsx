import { useEffect } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map ({ lat = 48.8566, long = 2.3522, zoom = 13 }) {

    useEffect(() => {
        const mapContainer = document.getElementById('map');

         // sécurité pour éviter de créer une 2e carte

        const map = L.map('map').setView([lat, long], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
    }, [lat, long, zoom])

    return (
        <div id="map"></div>
    );
}

export default Map;