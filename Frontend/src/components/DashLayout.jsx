import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Header from './Header';
import DashFooter from './DashFooter';

const DashLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <div className="flex flex-1">
                <NavBar />
                <div className="flex flex-col flex-1 p-4">
                    <Outlet />
                </div>
            </div>
            {/* <DashFooter /> */}
        </div>
    );
}

export default DashLayout;
