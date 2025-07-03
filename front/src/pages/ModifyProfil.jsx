import Button from "../components/Button";
import { getUserInfos } from "../api/userInfo";
import { useEffect, useState } from "react";

function ModifyProfil() {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [isPublic, setIsPublic] = useState('');
    const [isActivityNotification, setIsActivityNotification] = useState('');
    const [perimter, setPerimeter] = useState('');

    useEffect(() => {
        getUserInfos().then((data) => {
            console.log(data)
            setName(data.firstName + ' ' + data.lastName);
            setBio(data.description);
            setEmail(data.email);
            setIsPublic(data.is_public);
            setIsActivityNotification(data.activityNotif);
            setPerimeter(data.perimeter);
            
        }).catch((err) => console.error(err));
    }, []);

    async function validateUserData() {
        
        try {

        } catch (err) {
            
        }
    }

    return (
        <section className="profil raw-limit-size center">
            <section className="profil-top">
                <h1>Modifier mon profil</h1>
                <figure>
                    <img src="./gpasd'img" alt="Image de profil" />
                </figure>
            </section>
            <section className="profil-content">
                <h2>Mon profil</h2>
                <section>
                    <div className="flex-col">
                        <span className="title">Ma biographie</span>
                        <textarea name="description">{bio}</textarea>
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
                        <span className="title">Notification lorsqu'une activité est créée près de moi</span>
                        <input type="checkbox" name="notification" checked={isActivityNotification} onChange={() => setIsActivityNotification(!isActivityNotification)}/>
                    </div>
                    <div className="flex-col">
                        <span className="title">Périmètre de recherche</span>
                        <div className="btn-container">
                            <span className="km">1 km</span>
                            <input type="range" name="perimter" min="1" value={perimter} onChange={(e) => setPerimeter(e.target.value)} max="25" step="1"/>
                            <span className="km">25 km</span>
                        </div>          
                    </div>
                </section>
            </section>
            <div className="btn-container">
                <Button type="button" onClick={validateUserData}>Valider</Button>
            </div>
        </section>
    )
}

export default ModifyProfil;