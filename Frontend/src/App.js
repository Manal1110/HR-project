import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import EmployeeList from './features/employee/EmployeeList';
import UsersL from './features/users/users'; // Adjusted import path
import Profile from './components/Profile';
import Pointage from './components/Pointage';
import EmployeeManagement from './components/EmployeeManagement'; // Import EmployeeManagement component
import GenderStatistics from './components/GenderStatistics'; // Import GenderStatistics component
import ImportEmployeeshub from './components/ImportEmployeeshub';
import ImportEmployeescombu from './components/ImportEmployeescombu';
import ImportEmployeeshc from './components/ImportEmployeeshc';
import ImportEmployeesp2 from './components/ImportEmployeesp2';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="employee" element={<EmployeeList />} /> {/* Existing EmployeeList route */}
          <Route path="employees" element={<EmployeeManagement />} /> {/* New route for EmployeeManagement */}
          <Route path="users" element={<UsersL />} />
          <Route path="profile" element={<Profile />} />
          <Route path="pointage" element={<Pointage />}/>
          <Route path="Dashboard-HUB" element={<ImportEmployeeshub />} /> 
          <Route path="Dashboard-COMBU" element={<ImportEmployeescombu />} /> 
          <Route path="Dashboard-TOTAL" element={<ImportEmployeeshc />} /> 
          <Route path="Dashboard-P2" element={<ImportEmployeesp2 />} /> 




        </Route>
      </Route>
    </Routes>
  );
}

export default App;
