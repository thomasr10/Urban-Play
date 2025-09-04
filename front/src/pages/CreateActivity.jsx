import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import { getUserInfos } from "../api/userInfo";
import MessageModal from "../components/MessageModal";
import Loader from "../components/Loader";
import { useAuth } from '../context/AuthContext';

function CreateActivity() {

    const location = useLocation();
    const { coords } = location.state;
    const { locationName } = location.state;
    const { adress } = location.state;

    const [modalVisibility, setModalVisibility] = useState(false);
    const [modalData, setModalData] = useState({});

    // FORM
    const [date, setDate] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [sportId, setSportId] = useState('');
    const [players, setPlayers] = useState('');
    const [activityName, setActivityName] = useState('');
    const [activityDescription, setActivityDescription] = useState('');

    // FORM - DATA DE LA BASE
    const [arraySport, setArraySport] = useState([]);

    // User Infos
    const [userId, setUserId] = useState('');
    const [userGender, setUserGender] = useState('');

    // Loader
    const [loadingCount, setLoadingCount] = useState(0);

    const { loggedFetch, isUser, isAuthenticated } = useAuth();

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }

    useEffect(() => {
        if (isAuthenticated && isUser) {
            startFetch();
            getUserInfos(loggedFetch).then((data) => {
                setUserId(data.id);
                setUserGender(data.gender)
            })
                .catch((err) => {
                    console.error(err);
                })
                .finally(endFetch);
        }
    }, []);

    async function getSports() {
        try {
            const data = await loggedFetch('/api/sport/get-sports', {
                method: 'GET',
            });

            if (!data) {
                throw new Error('Aucune donnée reçue');
            }

            return data;

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        startFetch();
        getSports().then((data) => {
            console.log(data);
            setArraySport(data.sportsArray);
        })
            .catch(err => console.error(err))
            .finally(endFetch);
    }, []);

    async function sendActivityData(e) {
        e.preventDefault();
        startFetch();
        try {
            const data = await loggedFetch('/api/activity/create', {
                method: 'POST',
                body: JSON.stringify({ locationName, coords, activityName, activityDescription, date, from, to, sportId, players, userId })
            });

            if (!data) {
                throw new Error('Aucune donnée reçue');
            }

            if (data.success === true) {
                setModalData({
                    title: 'Félicitations',
                    message: data.message,
                    btnMessage: 'Voir l\'activité',
                    to: `/activite/${data.id}`,
                    onClose: null
                });
                setModalVisibility(true);
            }

            if (data.success === false) {
                setModalData({
                    title: 'Dommage',
                    message: data.message,
                    btnMessage: 'Retour',
                    to: null,
                    onClose: () => setModalVisibility(false)
                });
                setModalVisibility(true);
            }

        } catch (err) {
            console.error(err);
        } finally {
            endFetch();
        }
    }


    return (
        <>
            {
                loadingCount > 0 ? <Loader /> :
                    <section className="raw-limit-size center">
                        <h1>Créer une activité</h1>
                        <form className="form" onSubmit={sendActivityData}>
                            <div className="flex-row">
                                <span>Lieu :</span>
                                <span>{locationName}</span>
                            </div>
                            <div>
                                <label htmlFor="activityName">Nom de l'activité</label>
                                <input type="text" name="activityName" id="activityName" required maxLength={120} value={activityName} onChange={e => setActivityName(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="date">Date de l'activité</label>
                                <input type="date" name="date" id="date" required value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                            <section className="input-container">
                                <div>
                                    <label htmlFor="from">De</label>
                                    <input type="time" name="from" id="from" required value={from} onChange={e => setFrom(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="to">À</label>
                                    <input type="time" name="to" id="to" required value={to} onChange={e => setTo(e.target.value)} />
                                </div>
                            </section>
                            <section className="input-container">
                                <div>
                                    <label htmlFor="type">Type d'activité</label>
                                    <select name="type" id="type" required value={sportId} onChange={e => setSportId(e.target.value)}>
                                        <option value="">Choisir un sport</option>
                                        {arraySport.map((sport) => (
                                            <option key={sport.id} value={sport.id}>{sport.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="num">Nombre de participants</label>
                                    <input type="number" name="num" id="num" min={1} max={15} required value={players} onChange={e => setPlayers(e.target.value)} />
                                </div>
                            </section>
                            <div>
                                <label htmlFor="description">Description</label>
                                <textarea name="description" id="description" required maxLength={500} value={activityDescription} onChange={e => setActivityDescription(e.target.value)}></textarea>
                            </div>
                            <div className="btn-container">
                                <Button type={"submit"}>Valider</Button>
                            </div>
                        </form>
                    </section>
            }
            {/* // Modal */}
            {
                modalVisibility && (
                    <MessageModal {...modalData} />
                )
            }
        </>
    )
}

export default CreateActivity;