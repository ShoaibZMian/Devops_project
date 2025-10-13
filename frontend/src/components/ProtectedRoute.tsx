import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth';
import { toast } from 'react-toastify';

interface ProtectedRouteProps {
    children: React.ReactElement;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const authenticated = isAuthenticated();
    const admin = isAdmin();

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
