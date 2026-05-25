import { Outlet } from 'react-router-dom';
import './main.css';

export default function LeaguesLayout() {
  return (
    <div className="m2-league-management">
      <div className="m2-header">
        <h1>Gestión de Ligas</h1>
        <p className="m2-subtitle">
          Crea, administra y participa en ligas de predicciones
        </p>
      </div>

      <div className="m2-content">
        <Outlet />
      </div>
    </div>
  );
}
