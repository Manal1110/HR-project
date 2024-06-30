import React, { useEffect } from 'react';
import '../App.css'; 
import yazaki from './yazaki.png'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';

const DASH_REGEX = /^\/dash(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) navigate('/');
    }, [isSuccess, navigate]);

    if (isLoading) return <p>Logging Out...</p>;
    if (isError) return <p>Error: {error.data?.message}</p>;

    let dashClass = null;
    if (!DASH_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small";
    }

    const logoutButton = (
        <Link to="/">
            <button
                className="icon-button"
                title="Logout"
                onClick={sendLogout}
            >
                <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
        </Link>
    );

    return (
        <>
            <header className={`dash-header ${dashClass}`}>
                <div className="dash-title">
                    <img src={yazaki} alt="Yazaki Logo" className="dash-logo" />
                    <h2>Dashboard</h2>
                </div>
                <nav className="dash-header__nav">
                    <Link to="/">Home</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/settings">Settings</Link>
                    {logoutButton}
                </nav>
            </header>
            <div className="dash-container">
                <main className="dash-main">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default DashHeader;
