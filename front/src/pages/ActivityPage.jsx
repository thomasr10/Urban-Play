import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ActivityPage () {

    const { id } = useParams();

    async function getActivityInfos() {
        try {
            const response = await fetch(`/api/activity/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = response.json();

            if (!response.ok) {
                throw new Error(`Erreur Http : ${response.status}, ${data.message}`);
            }

            return data;

        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (id) {
            getActivityInfos(id)
        }
    }, [id]);

    return (
        <section className='raw-limit-size center'>
            <h1>Activité de</h1>
        </section>    
    )
}

export default ActivityPage;