import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isAuthenticated = false; // TODO: Conectar con estado de autenticación real

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const menuItems = [
    { path: '/', label: 'Inicio' },
    { path: '/m2-league', label: 'Ligas' },
    { path: '/m3-prediction', label: 'Vaticinios' },
    { path: '/m4-scoreboard', label: 'Marcador' },
    { path: '/m5-worldcup', label: 'Mundial' },
    { path: '/prizes', label: 'Premios' },
    { path: '/m7-admin', label: 'Admin' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-wrapper">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">QuinielaMundial</span>
        </Link>

        {/* Hamburger Menu */}
        <button
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Main Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="menu-container">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="navbar-link"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth Section */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button
                className="user-avatar"
                onClick={toggleUserMenu}
                aria-label="User menu"
              >
                <span className="avatar-icon">👤</span>
              </button>
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    Mi Perfil
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    Configuración
                  </Link>
                  <button className="dropdown-item logout">
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/m1-auth" className="auth-btn signin">
                Iniciar Sesión
              </Link>
              <Link to="/m1-auth" className="auth-btn signup">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
