import Loader from "../components/Loader";
import { useState } from "react";
import Logout from "../components/Logout";

function AdminDashboard() {

    // const [loadingCount, setLoadingCount] = useState(0);

    // function startFetch() {
    //     setLoadingCount(prev => prev + 1);
    // }

    // function endFetch() {
    //     setLoadingCount(prev => prev - 1);
    // }

    return (
        <>
        {/* {
            loadingCount > 0 ? <Loader /> :
            <h1>Dashboard</h1>
        }   */}
        <p>test</p>
        <Logout />
        </>
    )
}

export default AdminDashboard;