import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const { isAuthenticated: authenticated, isAdmin: admin } = useAuth();

    if (!authenticated) {
        toast.error('Please login to access this page');
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !admin) {
        toast.error('Access denied. Admin privileges required.');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
