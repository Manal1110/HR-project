import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Assuming you have an AuthContext

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth(); // This should be a boolean indicating if the user is logged in

  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected content
  return <Outlet />;
};

export default PrivateRoute;
