import React from 'react';
import yazaki from '../images/yazaki.png';
import profilepic from '../images/profilePic.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';

const NavBar = () => {
    const [sendLogout] = useSendLogoutMutation();
    const navigate = useNavigate();

const handleLogout = async () => {
    await sendLogout(); // Perform logout
    localStorage.removeItem("authToken"); // Remove auth token (if using local storage)
    navigate('/login'); // Redirect to login page
};


    return (
        <aside className="w-1/6 bg-white shadow-lg flex flex-col m-4 font-playfair rounded-xl">
            {/* <div className="flex flex-col  items-center p-4">
                <img src={yazaki} alt="Yazaki Logo" className="w-xs mr-4 mb-4 pt-8" />
            </div> */}
            <div className="flex flex-row items-center p-8">
                <div>
                    <img src={profilepic} alt="Profile" className="w-16 h-16 rounded-full mb-4 border-[1px] border-black" />
                </div>
                <div className='pl-8'>
                    <h3 className="text-lg font-semibold">Sarra El Harti</h3>
                    <h5 className="text-sm text-gray-600">General HR</h5>
                </div>
            </div>
            <nav className="flex flex-col p-12 pl-8 space-y-8">
                <NavLink to="/dash/Dashboard-TOTAL" label="Dashboard Total" icon="fas fa-home" />
                <NavLink to="/dash/Dashboard-COMBU" label="Dashboard Combu" icon="fas fa-home" />
                <NavLink to="/dash/Dashboard-HUB" label="Dashboard Hub" icon="fas fa-home" />
                <NavLink to="/dash/Dashboard-P2" label="Dashboard P2" icon="fas fa-home" />
                <NavLink to="/dash/employees" label="Employees" icon="fas fa-users" />
                <NavLink to="/dash/pointage" label="Check-In/Out" icon="fas fa-clock" />
                <NavLink to="/dash/profile" label="Profile" icon="fas fa-user" />
            </nav>
            <LogoutButton handleLogout={handleLogout} />
        </aside>
    );
}

const NavLink = ({ to, label, icon }) => (
    <Link to={to} className="flex items-center text-lg text-black hover:text-hoverpurple transition-colors duration-200" style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)" }}>
        <i className={`${icon} mr-3`}></i>
        {label}
    </Link>
);

const LogoutButton = ({ handleLogout }) => (
    <button
        className="flex items-center text-black text-xl hover:text-red-500 transition-colors duration-200 mt-auto pt-12 pb-8 pl-12"
        style={{ textShadow: "0px 4px 4px rgba(0, 0, 0, 0.3)" }} title="Logout"
        onClick={handleLogout}
    >
        <FontAwesomeIcon icon={faRightFromBracket} className="mr-4" />
        Logout
    </button>
);

export default NavBar;
