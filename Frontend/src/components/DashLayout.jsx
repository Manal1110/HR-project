import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Header from './Header';
import DashFooter from './DashFooter';
import EmployeeManagement from './EmployeeManagement';

const DashLayout = () => {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col shadow-lg">
                <Header />
                <div className="flex-1 flex">
                    <NavBar />
                    <div className="flex-1 overflow-hidden">
                        <Outlet />
                    </div>
                </div>
                {/* <DashFooter /> */}
            </div>
        );
    }

export default DashLayout;
