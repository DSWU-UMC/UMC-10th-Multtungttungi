import { Outlet } from "react-router-dom";
import { Navbar } from "../components/NavBar";

const HomePage = () : Element => {
    return (
        <>
    <Navbar />
    <Outlet />
    </>
    );
};

export default HomePage;