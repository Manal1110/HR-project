import React from 'react';
import yazakiLogo from '../images/yazaki.png'; // Ensure the path to the logo is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    return (
        <header className="bg-white p-4 ">
            <div className='flex justify-between'>
                <div className="flex items-center">
                    <img src={yazakiLogo} alt="Yazaki Logo" className="h-10 mr-4" />
                </div>
                <div className="relative flex items-center w-full max-w-lg">
                    <FontAwesomeIcon icon={faSearch} className=" left-3 text-gray-500" />
                    <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-10 pr-4 py-2 border-none rounded-full focus:outline-none focus:ring-0"
                    style={{ boxShadow: '0 0 0 0', border: 'none' }}
                />
                </div>
                <div className='w-1/4'></div>
            </div>
            
        </header>
    );
};

export default Header;
