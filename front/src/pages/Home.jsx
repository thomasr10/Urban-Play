import { useAuth } from "../context/AuthContext";
import HomeConnected from "./HomeConnected";
import HomeUnconnected from "./HomeUnconnected";

function Home () {

    const { isAuthenticated, isUser } = useAuth();
    return (isAuthenticated && isUser) ? <HomeConnected /> : <HomeUnconnected />;

}

export default Home;