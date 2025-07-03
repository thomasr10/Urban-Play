import { useLocation } from "react-router-dom";

function CreateActivity () {

    const location = useLocation();
    const { coords } = location.state;
    const { locationName } = location.state;
    console.log(coords, locationName)


    return (
        <section className="raw-limit-size center">
            <h1>Créer une activité</h1>
            <form>
                <div>
                    <label>Lieu</label>
                    <p>{ locationName }</p>
                </div>
                <div>
                    <label htmlFor="date">Date de l'activité</label>
                    <input type="date" name="date" id="date" />
                </div>
                <div>
                    <div>
                        <label htmlFor="from">De</label>
                        <input type="time" name="from" id="from" />
                    </div>
                    <div>
                        <label htmlFor="to">A</label>
                        <input type="time" name="to" id="to" />
                    </div>
                    <div>
                        <div>
                            <label htmlFor="type">Type d'activité</label>
                            <input type="text" name="type" id="type" />
                        </div>
                        <div>
                            <label htmlFor="number">Nombre de participants</label>
                            <input type="num" required/>
                        </div>
                    </div>
                </div>
                <input type="hidden" name="lat" value={coords[1]} />
                <input type="hidden" name="long" value={coords[0]} />
            </form>
        </section>
    )
}

export default CreateActivity;