import { useState } from 'react';
import CatalogoRoutes from '../../routes/CatalogoRoutes';
import './Catalogo.css';

export default function M5WorldCupAdminMain() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: 'Sedes', path: '/catalogo/venues', icon: '🏛️' },
    { label: 'Estadios', path: '/catalogo/stadiums', icon: '🏟️' },
    { label: 'Países', path: '/catalogo/countries', icon: '🌎' },
    { label: 'Fases', path: '/catalogo/tournament-stages', icon: '📅' },
    { label: 'Grupos', path: '/catalogo/groups', icon: '👥' },
    { label: 'Países por Grupo', path: '/catalogo/group-countries', icon: '🎯' },
    { label: 'Partidos', path: '/catalogo/matches', icon: '⚽' },
  ];

  const handleMenuItemClick = (path) => {
    window.location.hash = `#${path}`;
  };

  return (
    <div className="catalogo-container">
      <div className={`catalogo-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Catálogo</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={`#${item.path}`}
              className="menu-item"
              title={item.label}
            >
              <span className="menu-icon">{item.icon}</span>
              {sidebarOpen && <span className="menu-label">{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>

      <div className="catalogo-content">
        <CatalogoRoutes />
      </div>
    </div>
  );
}
