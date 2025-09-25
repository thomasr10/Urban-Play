import { act, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { formatDate, formatTime } from '../assets/js/formatDate';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
function AdminActivity() {

    const [loadingCount, setLoadingCount] = useState(0);
    const { loggedFetch } = useAuth();
    const [pageNum, setPageNum] = useState(1);
    const [arrayActivities, setArrayActivities] = useState([]);
    const [totalResult, setTotalResult] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [arrayPagination, setArrayPagination] = useState([]);

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setTimeout(() => {
            setLoadingCount(prev => prev - 1);
        }, 600);
    }

    const getLatestTenActivities = async () => {
        
        try {
            
            const data = await loggedFetch('/admin/api/activity/latest', {
                method: 'POST',
                body: JSON.stringify({numPage: pageNum})
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

        getLatestTenActivities()
        .then((data) => {
            setArrayActivities(data.latestActivities);
            console.log(data);
            setTotalResult(data.totalActivities);
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(endFetch);

    }, [pageNum]);

    function goToPrevResults () {
        (pageNum === 1) ? setPageNum(1) : setPageNum(prev => prev - 1);
        setCurrentPage(prev => prev - 1);
    }
    function goToNextResults () {
        (pageNum === arrayPagination.length) ? setPageNum(arrayPagination.length) : setPageNum(prev => prev + 1);
        setCurrentPage(prev => prev + 1);
    }

    function goToPage(numPage) {
        setPageNum(numPage);
        setCurrentPage(numPage);
    }

    function countPages(numResult) {
        const result = numResult / 10;
        const array = [];

        for(let i = 0; i < result; i++) {
            array.push(i + 1);
        }

        return array;
    }

    
    useEffect(() => {
        setArrayPagination(countPages(totalResult));
        console.log(arrayPagination)
    }, [totalResult])

    return (
        <div className="admin-section">
            <h1>Dashboard Activité</h1>

            <div className="admin-table-container">
                <div className="arrows-container">
                    <ArrowBigLeft className='arrow' onClick={goToPrevResults}/>
                    <div className='pagination-container'>
                        { (arrayPagination.length > 1) && (
                            arrayPagination.map((num) => (
                                <span onClick={() => goToPage(num)} className={(num === currentPage) ? 'bold' : ''}>{ num }</span>
                            ))
                        ) }
                    </div>
                    <ArrowBigRight className='arrow'onClick={goToNextResults}/>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="thead">ID</th>
                            <th className="thead">Sport</th>
                            <th className="thead">ID user</th>
                            <th className="thead">Nom</th>
                            <th className="thead">Lieu</th>
                            <th className="thead">Date de l'activité</th>
                            <th className="thead">De</th>
                            <th className="thead">À</th>
                            <th className="thead">Nb j. max</th>
                            <th className="thead">Nb j. actuel</th>
                            <th className="thead">Latitude</th>
                            <th className="thead">Longitude</th>
                            <th className="thead">Date de création</th>
                            <th className="thead">Description</th>
                            <th className="thead">Passée</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loadingCount > 0 ? <Loader/> :
                            
                            arrayActivities.length > 0 && (
                                arrayActivities.map((activity) => (
                                    <tr>
                                        <th>{ activity.id }</th>
                                        <th></th>
                                        <th></th>
                                        <th>{ activity.name }</th>
                                        <th>{ activity.location_name }</th>
                                        <th>{ formatDate(activity.activity_date.date) }</th>
                                        <th>{ formatTime(activity.hour_from.date) }</th>
                                        <th>{ formatTime(activity.hour_to.date) }</th>
                                        <th>{ activity.max_players }</th>
                                        <th>{ activity.current_players }</th>
                                        <th>{ activity.location_latitude }</th>
                                        <th>{ activity.location_longitude }</th>
                                        <th>{ formatDate(activity.created_at.date) }</th>
                                        <th>{ activity.description }</th>
                                        <th>{ activity.is_done }</th>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminActivity;