import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Loader } from '../components';

export function ProtectedRoute({ element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0B1220',
      }}>
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/m1-auth" replace />;
  }

  return element;
}
