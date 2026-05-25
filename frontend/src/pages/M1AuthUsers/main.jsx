import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import { styles } from './components/styles';
import { useAuth } from '../../context/useAuth';
import './components/styles.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isHoveringLogout, setIsHoveringLogout] = useState(false);

  // Redirigir a inicio si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      // Mostrar la pantalla de bienvenida por un momento antes de redirigir
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    // El contexto ya está actualizado, no hacer nada aquí
    // La redirección ocurre automáticamente por useEffect
  };

  const handleRegisterSuccess = () => {
    setIsLogin(true);
  };

  const handleSwitchToLogin = (e) => {
    e?.preventDefault?.();
    setIsLogin(true);
  };

  const handleSwitchToRegister = (e) => {
    e?.preventDefault?.();
    setIsLogin(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Si el usuario está logueado, mostrar pantalla de bienvenida
  if (isAuthenticated && user) {
    return (
      <div style={styles.container}>
        <div style={styles.card} className="auth-card">
          <h1 style={styles.title}>Bienvenido 👋</h1>
          <div style={styles.userInfo}>
            <p style={styles.infoText}>
              <strong>Email:</strong> {user.email}
            </p>
            <p style={styles.infoText}>
              <strong>Nombre:</strong> {user.name}
            </p>
            <p style={styles.infoText}>
              <strong>ID:</strong> {user.id}
            </p>
          </div>
          <p style={{ ...styles.infoText, fontSize: '14px', color: '#9CA3AF', marginTop: '20px' }}>
            Serás redirigido al inicio en breve...
          </p>
          <button
            onClick={handleLogout}
            style={{
              ...styles.logoutButton,
              ...(isHoveringLogout && styles.logoutButtonHover),
            }}
            className="logout-button"
            onMouseEnter={() => setIsHoveringLogout(true)}
            onMouseLeave={() => setIsHoveringLogout(false)}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card} className="auth-card">
        <div style={styles.toggleButtons}>
          <button
            onClick={handleSwitchToLogin}
            style={{
              ...styles.toggleButton,
              ...(isLogin ? styles.toggleButtonActive : styles.toggleButtonInactive),
            }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={handleSwitchToRegister}
            style={{
              ...styles.toggleButton,
              ...(!isLogin ? styles.toggleButtonActive : styles.toggleButtonInactive),
            }}
          >
            Registrarse
          </button>
        </div>

        {isLogin ? (
          <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />
        ) : (
          <Register onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={handleSwitchToLogin} />
        )}
      </div>
    </div>
  );
}
