import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../App.css'; 
import yazaki from './yazaki.png'; 
const DashHeader = () => {
  return (
    <>
      <header className="dash-header">
        <div className="dash-title">
          <img src={yazaki} alt="Yazaki Logo" className="dash-logo" />
          <h2>Dashboard</h2>
        </div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
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
