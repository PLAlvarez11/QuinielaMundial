import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import { styles } from './components/styles';
import { logoutUser } from './utils';
import userSingleton from './userSingleton';
import './components/styles.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  // Cargar usuario del singleton al montar
  useEffect(() => {
    if (userSingleton.isAuthenticated()) {
      setUser(userSingleton.getUser());
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
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
    logoutUser();
    setUser(null);
  };

  // Si el usuario está logueado, mostrar pantalla de bienvenida
  if (user || userSingleton.isAuthenticated()) {
    const currentUser = user || userSingleton.getUser() || {};
    return (
      <div style={styles.container}>
        <div style={styles.card} className="auth-card">
          <h1 style={styles.title}>Bienvenido 👋</h1>
          <div style={styles.userInfo}>
            <p style={styles.infoText}>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p style={styles.infoText}>
              <strong>Nombre:</strong> {currentUser.name}
            </p>
            <p style={styles.infoText}>
              <strong>ID:</strong> {currentUser.id}
            </p>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton} className="logout-button">
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
