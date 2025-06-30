import Button from "../components/Button";
import Logout from "../components/Logout";
import { getUserInfos } from "../api/userInfo";
import { useEffect, useState } from "react";

function Profil() {
    const [activities, setActivities] = useState('');

    useEffect(() => {
        getUserInfos().then((data) => {
            console.log(data)
            setActivities(data.activities);
        }).catch((err) => console.error(err));        
    }, [])

    return (
        <section className="profil raw-limit-size center">
            <section className="profil-top">
                <h1>Mon profil</h1>
                <figure>
                    <img src="./gpasd'img" alt="Image de profil" />
                </figure>
            </section>
            <section className="profil-content">
                <div className="flex-col">
                    <span className="title">Ma biographie</span>
                    <p></p>
                </div>
                <div className="flex-between">
                    <span className="title">Mes intérêts</span>
                    <span className="value"></span>
                </div>
                <div className="flex-between">
                    <span className="title">Activités participées</span>
                    <span className="value"></span>
                </div>
                <div className="flex-between">
                    <span className="title">Activités créées</span>
                    <span className="value">{activities}</span>
                </div>
                <div className="flex-between">
                    <span className="title">Recommadations</span>
                    <span className="value"></span>
                </div>
            </section>
            <div className="btn-container">
                <Button type="button" to='/modifier-profil'>Modifier</Button>
            </div>
            <div className="btn-container logout-container">
                <Logout/>
            </div>
            
        </section>
    )
}

export default Profil;