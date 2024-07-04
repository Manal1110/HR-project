import React from 'react';
import { Link } from 'react-router-dom';
import yazaki from '../images/yazaki.png'; 

const Public = () => {
  return (
    <div className="container">
      <img src={yazaki} alt="Yazaki Logo" className="center-image" />
      <h1>Welcome to Yazaki HR</h1>
      <p>Your gateway to a wonderful experience.</p>
      <Link to="/login">Login</Link>
    </div>
  );
}

export default Public;
