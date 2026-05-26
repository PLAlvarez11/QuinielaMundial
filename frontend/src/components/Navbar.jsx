import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/m1-auth');
  };

  const menuItems = [
    { path: '/', label: 'Inicio' },
    ...(isAuthenticated ? [
      { path: '/m2-league', label: 'Ligas' },
      { path: '/m3-prediction', label: 'Vaticinios' },
      { path: '/m4-scoreboard', label: 'Marcador' },
      { path: '/m5-worldcup', label: 'Mundial' },
      { path: '/prizes', label: 'Premios' },
    ] : []),
    ...(user?.is_admin ? [
      { path: '/m7-admin', label: 'Admin', inNewTab: true },
    ] : [])
  ];

  console.log('Navbar - Rendered', { isAuthenticated, user, menuItems });
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
                target={item.inNewTab ? '_blank' : '_self'}
                rel={item.inNewTab ? 'noopener noreferrer' : undefined}
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
                title={user?.email}
              >
                <span className="avatar-icon">👤</span>
              </button>
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-user-info">
                    <p className="user-email">{user?.email}</p>
                    <p className="user-name">{user?.name}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
