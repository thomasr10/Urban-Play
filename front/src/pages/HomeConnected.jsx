import { Search, User } from 'lucide-react';
import Map from "../components/Map";
import { act, useEffect, useState } from "react";
import { getUserInfos } from "../api/userInfo";
import ActivityModal from "../components/ActivityModal";
import UserFutureActivities from '../components/UserFutureActivity';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

function HomeConnected() {
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const token = localStorage.getItem('token');
    const [perimeter, setPerimeter] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [countResult, setCountResult] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [userId, setUserId] = useState(null);
    const [futureActivities, setFutureActivities] = useState([]);
    const navigate = useNavigate();
    const [loadingCount, setLoadingCount] = useState(0);

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setTimeout(() => {
            setLoadingCount(prev => prev - 1);
        }, 600);
    }

    const openModal = ({ coords, name, adress }) => {
        setSelectedMarker({ coords, name, adress });
    }

    const closeModal = () => setSelectedMarker(null);

    // Redirection pour la liste d'activités

    function goToActivity(id) {
        navigate(`/activite/${id}`);
    }

    // Récupérer les infos du user (périmètre pour établir la recherche)
    useEffect(() => {
        startFetch();
        getUserInfos().then((data) => {
            setPerimeter(data.perimeter);
            setUserId(data.id);
        })
            .catch((err) => {
                console.error(err);
            })
            .finally(endFetch);
    }, []);

    // Récupérer les lieux sportifs via l'api du gvt
    async function getSportsLocation() {

        try {
            const response = await fetch('/api/sports-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userInfos: { lat: lat, long: long, perimeter: perimeter } })
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

    // Récupérer la loc du user
    useEffect(() => {
        startFetch();
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLat(latitude);
                setLong(longitude);
                endFetch();
            },
            (error) => {
                console.error("Erreur géolocalisation :", error);
                endFetch();
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
        // s'assurer que la fonction ne se lance pas avant que les données soient récup
        if (lat !== null && long !== null && perimeter !== null) {
            startFetch();
            getSportsLocation()
                .then((data) => {
                    if (Object.keys(data.data).length > 0) {
                        const arrayCoordinates = [];
                        // on met les coordonnées dans un tableau que l'on passera au composant Map
                        data.data.records.forEach(location => {
                            arrayCoordinates.push([location.geometry.coordinates, location.fields.inst_nom, location.fields.inst_adresse])
                        });
                        // on passe ce tableau à notre const useState
                        setMarkers(arrayCoordinates);
                        setCountResult(arrayCoordinates.length);
                    } else {
                        console.error(data.message);
                    }
                })
                .catch(err => console.error(err))
                .finally(endFetch);
        }
    }, [lat, long, perimeter]);


    // Récupérer les futures activités du user

    async function getUserFutureActivities() {
        try {
            const response = await fetch('/api/user/future-activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
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
        if (userId) {
            startFetch();
            getUserFutureActivities().then((data) => {
                if (data.success === true) {
                    setFutureActivities(data.futureActivities);
                }
            })
            .catch(err => console.error(err))
            .finally(endFetch);
        }
    }, [userId])

    return (
        <>
            {
                loadingCount > 0 ? <Loader /> :
                <section className="raw-limit-size center home-connected">
                    <section className="search-activities">
                        <div className="search-container">
                            <input type="search" name="search-bar" id="search-bar" placeholder="Rechercher une activité" />
                            <Search className="search-input" />
                        </div>
    
                        {lat !== null && long !== null ? (
                            <div>
                                <Map lat={lat} long={long} markers={markers} onMarkerClick={openModal} />
                                {
                                    countResult < 1 ? <p className='map-result'>Aucun résultat à proximité</p> :
                                    countResult == 1 ? <p className='map-result'>Afficher le résultat</p> :
                                    <p className='map-result'>Afficher les {countResult} résultats</p>
                                }
                            </div>
                        ) : (
                            <div className="loading-msg-container">
                                <p className="loading-message">Chargement de votre position...</p>
                            </div>
                        )}
    
                    </section>
                    <section className="home-activities">
                        <h2>Mes prochaines activités</h2>
                        <div className='future-activities-container'>
                            {
                                futureActivities.length > 0 ? (
    
                                    futureActivities.map((activity) => (
                                        <UserFutureActivities key={activity.id} onClick={() => goToActivity(activity.id)} creatorName={activity.user.first_name} creatorId={activity.user.id} activityDate={activity.activity_date.date} activityDescription={activity.description} currentPlayers={activity.current_players} maxPlayers={activity.max_players} location={activity.location_name} userId={userId} from={activity.hour_from.date} to={activity.hour_to.date} />
                                    ))
    
                                ) :
                                    <p className='no-activity-msg'>Aucune activité prévue prochainement</p>
                            }
                        </div>
                    </section>
                </section>
            }
            {/* MODAL */}
    
            {
                selectedMarker && (
                    <ActivityModal coordinates={selectedMarker.coords} name={selectedMarker.name} adress={selectedMarker.adress} onClose={closeModal} />
                )
            }

        </>
    )
}

export default HomeConnected;