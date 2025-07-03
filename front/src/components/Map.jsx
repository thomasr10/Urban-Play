import { useEffect, useRef } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ lat = 48.8566, long = 2.3522, zoom = 13, markers = [], onMarkerClick }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersLayerRef = useRef(null);

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

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        if (markersLayerRef.current) {
            markersLayerRef.current.clearLayers();
        }

        const sportIcon = L.icon({
            iconUrl: '/img/city-marker.webp',
            iconSize: [35, 35],
            iconAnchor: [20, 40]
        })

        const layerGroup = L.layerGroup();
        markers.forEach((data) => {
            const newMarker = L.marker([data[0][1], data[0][0]], {icon: sportIcon}).addTo(layerGroup);
            newMarker.addEventListener('click', () => {
                onMarkerClick({coords: data[0], name: data[1]});
            });
        });

        layerGroup.addTo(map);
        markersLayerRef.current = layerGroup;
    }, [markers]);

    return (
        <div id="map" ref={mapContainerRef}/>
    );
}

export default Map;
