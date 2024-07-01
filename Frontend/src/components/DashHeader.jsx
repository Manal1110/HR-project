import React, { useEffect } from 'react';
import yazaki from '../images/yazaki.png'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';

const DashHeader = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation();

    const DASH_REGEX = /^\/dash(\/)?$/;
    const USERS_REGEX = /^\/dash\/users(\/)?$/;

    useEffect(() => {
        if (isSuccess) navigate('/');
    }, [isSuccess, navigate]);

    if (isLoading) return <p>Logging Out...</p>;
    if (isError) return <p>Error: {error.data?.message}</p>;

    const dashClass = !DASH_REGEX.test(pathname) && !USERS_REGEX.test(pathname) ? "max-w-3xl mx-auto" : '';

    const NavLink = ({ to, label }) => (
        <Link to={to} className="text-white no-underline hover:underline">{label}</Link>
    );

    const LogoutButton = ({ sendLogout }) => (
        <Link to="/">
            <button
                className="bg-transparent border-none cursor-pointer text-white text-2xl"
                title="Logout"
                onClick={sendLogout}
            >
                <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
        </Link>
    );

    return (
        <>
            <header className={`w-full bg-blue-500 text-white p-4 flex justify-between items-center shadow-lg ${dashClass}`}>
                <div className="flex items-center">
                    <img src={yazaki} alt="Yazaki Logo" className="max-w-xs mr-4" />
                    <h2>Dashboard 123</h2>
                </div>
                <nav className="flex space-x-4">
                    <NavLink to="/" label="Home" />
                    <NavLink to="/profile" label="Profile" />
                    <NavLink to="/settings" label="Settings" />
                    <LogoutButton sendLogout={sendLogout} />
                </nav>
            </header>
            <div className="flex flex-col items-center justify-center p-8">
                <main className="p-8 bg-white w-full max-w-5xl shadow-lg rounded-lg mt-8">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default DashHeader;
