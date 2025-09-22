import Loader from "../components/Loader";
import { useState } from "react";
import AdminMenu from "../components/AdminMenu";
import AdminContent from "../components/AdminContent";

function AdminDashboard() {

    const [loadingCount, setLoadingCount] = useState(0);
    const [linkId, setLinkId] = useState(0);

    function startFetch() {
        setLoadingCount(prev => prev + 1);
    }

    function endFetch() {
        setLoadingCount(prev => prev - 1);
    }

    function selectLink (e) {
        setLinkId(e.currentTarget.id);
    }

    return (
        <>
            {
                loadingCount > 0 ? <Loader /> :
                    <>
                        <div className="admin-dashboard">
                            <AdminMenu onSelect={selectLink}/>
                            <div className="admin-content">
                                <AdminContent id={linkId}/>
                            </div>
                        </div>

                    </>

            }
        </>
    )
}

export default AdminDashboard;