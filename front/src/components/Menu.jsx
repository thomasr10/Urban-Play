import MenuDesktop from "../components/MenuDesktop";
import MenuMobile from "../components/MenuMobile";

function Menu () {
    return (
        <>
            <div className="mobile">
                <MenuMobile />
            </div>
            <div className="desktop">
                <MenuDesktop />
            </div>
        </>
    )
}

export default Menu;