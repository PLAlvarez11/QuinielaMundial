import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CatalogoRoutes from '../../routes/CatalogoRoutes';
import './Catalogo.css';

export default function M5WorldCupAdminMain() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Sedes', path: 'venues', icon: '🏛️' },
    { label: 'Estadios', path: 'stadiums', icon: '🏟️' },
    { label: 'Países', path: 'countries', icon: '🌎' },
    { label: 'Fases', path: 'tournament-stages', icon: '📅' },
    { label: 'Grupos', path: 'groups', icon: '👥' },
    { label: 'Países por Grupo', path: 'group-countries', icon: '🎯' },
    { label: 'Partidos', path: 'matches', icon: '⚽' },
  ];

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="catalogo-container">
      <div className={`catalogo-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Catálogo</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Contraer menú' : 'Expandir menú'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleMenuItemClick(item.path)}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              title={item.label}
            >
              <span className="menu-icon">{item.icon}</span>
              {sidebarOpen && <span className="menu-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="catalogo-content">
        <CatalogoRoutes />
      </div>
    </div>
  );
}
