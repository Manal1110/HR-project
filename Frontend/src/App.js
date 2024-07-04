import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import EmployeeList from './features/employee/EmployeeList';
import UsersL from './features/users/users'; // Adjusted import path
import Profile from './components/Profile';
import EmployeeManagement from './components/EmployeeManagement'; // Import EmployeeManagement component

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
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
