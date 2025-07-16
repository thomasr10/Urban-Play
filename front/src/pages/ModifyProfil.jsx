import Button from "../components/Button";
import { getUserInfos } from "../api/userInfo";
import { useEffect, useRef, useState } from "react";
import Loader from '../components/Loader';
import { useNavigate } from "react-router-dom";

function ModifyProfil() {
    // User
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [isPublic, setIsPublic] = useState('');
    const [isActivityNotification, setIsActivityNotification] = useState('');
    const [perimeter, setPerimeter] = useState('');
    const [userId, setUserId] = useState(null);

    // Perimeter
    const [showOutput, setShowOutput] = useState(false);
    const rangeRef = useRef(null);

    const navigate = useNavigate();

    // Loader
    const [loadingCount, setLoadingCount] = useState(0);

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }

    useEffect(() => {
        startFetch();
        getUserInfos().then((data) => {
            console.log(data)
            setName(data.firstName + ' ' + data.lastName);
            setBio(data.description);
            setEmail(data.email);
            setIsPublic(data.is_public);
            setIsActivityNotification(data.activityNotif);
            setPerimeter(data.perimeter);
            setUserId(data.id);

        }).catch((err) => console.error(err))
            .finally(endFetch);
    }, []);

    async function validateUserData(e) {
        e.preventDefault();
        startFetch();
        try {
            const response = await fetch('/api/user/modify', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bio, isPublic, isActivityNotification, perimeter, userId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Erreur Http : ${response.status}, ${data.message}`);
            }

            return data;

        } catch (err) {
            console.error(err);

        } finally {
            endFetch();
            navigate('/profil')
        }
    }


    function checkMouseDown() {
        setShowOutput(true);
        window.addEventListener('pointerup', () => {
            setTimeout(() => {
                checkMouseUp();
            }, 500)
        } );
        
    }

    function checkMouseUp() {
        setShowOutput(false);
        window.removeEventListener('pointerup', checkMouseUp);
    }

    function checkChange(e) {
        setPerimeter(e.target.value);

        const range = rangeRef.current;
        const percent = (e.target.value - range.min) / (range.max - range.min);
        const rangeWidth = range.offsetWidth;
        const offset = 16;

        const pos = percent * (rangeWidth - offset);
        updateOutputPos(pos);
    }

    function updateOutputPos(value) {
        const root = document.documentElement;
        root.style.setProperty('--output-position', `${value}px`);
    }

    useEffect(() => {
        checkChange;
    }, [])

    return (
        <>
            {
                loadingCount > 0 ? <Loader /> :
                    <section className="profil raw-limit-size center">
                        <section className="profil-top">
                            <h1>Modifier mon profil</h1>
                        </section>
                        <section className="profil-content">
                            <h2>Mon profil</h2>
                            <section>
                                <div className="flex-col">
                                    <span className="title">Ma biographie</span>
                                    <textarea name="description" onChange={e => setBio(e.target.value)} defaultValue={bio}></textarea>
                                </div>
                                <div className="flex-between">
                                    <span className="title">Adresse mail</span>
                                    <span className="value">{email}</span>
                                </div>
                                <div className="flex-between">
                                    <span className="title">Mot de passe</span>
                                    <span className="value">............</span>
                                </div>
                            </section>
                            <section>
                                <h2>Mes préférences</h2>
                                <div className="flex-between">
                                    <span className="title">Profil public</span>
                                    <input type="checkbox" name="public-profil" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
                                </div>
                                <div className="flex-between">
                                    <span className="title">Notifications d'activités</span>
                                    <input type="checkbox" name="notification" checked={isActivityNotification} onChange={() => setIsActivityNotification(!isActivityNotification)} />
                                </div>
                                <div className="flex-col">
                                    <span className="title">Périmètre de recherche</span>
                                    <div className="perimeter-container">
                                        <span className="km">1 km</span>
                                        <div className="range-container">
                                            <input type="range" name="perimeter" min="1" value={perimeter} onChange={checkChange} max="25" step="1" onPointerDown={checkMouseDown} ref={rangeRef}/>
                                            {
                                                showOutput && (
                                                    <output>{perimeter}</output>
                                                )
                                            }
                                            
                                        </div>
                                        <span className="km">25 km</span>
                                    </div>
                                </div>
                            </section>
                        </section>
                        <div className="btn-container">
                            <Button type="button" onClick={validateUserData}>Valider</Button>
                        </div>
                    </section>
            }
        </>
    )
}

export default ModifyProfil;