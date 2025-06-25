import { useAuth } from "../context/AuthContext";
import HomeConnected from "./HomeConnected";
import HomeUnconnected from "./HomeUnconnected";

function Home () {

    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <HomeConnected /> : <HomeUnconnected />;

}

export default Home;