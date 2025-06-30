import { useEffect, useRef } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ lat = 48.8566, long = 2.3522, zoom = 13, markers = [] }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const container = mapContainerRef.current;

        if (!container) return;

        if (mapRef.current) {
            mapRef.current.remove();
        }

        const map = L.map(container).setView([lat, long], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        L.marker([lat, long]).addTo(map);

        mapRef.current = map;

        return () => {
            map.remove();
        };
    }, [lat, long, zoom]);

    return (
        <div id="map" ref={mapContainerRef}/>
    );
}

export default Map;
