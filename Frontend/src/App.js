import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import EmployeeList from './features/employee/EmployeeList';
import UsersL from './features/users/users'; // Adjusted import path

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route path="dash" element={<DashLayout />}>
          {/* Render Welcome component only once */}
          <Route index element={<Welcome />} />
          {/* Other routes */}
          <Route path="employee" element={<EmployeeList />} />
          <Route path="users" element={<UsersL />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
