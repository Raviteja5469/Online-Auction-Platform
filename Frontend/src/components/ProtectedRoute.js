// ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to signin page but save the attempted URL
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
