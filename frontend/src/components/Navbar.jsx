import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          QuinielaMundial
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Inicio
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/m1-auth" className="navbar-link">
              M1 - Autenticación
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/m2-league" className="navbar-link">
              M2 - Ligas
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/m3-prediction" className="navbar-link">
              M3 - Vaticinios
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/m4-scoreboard" className="navbar-link">
              M4 - Marcador
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/m5-worldcup" className="navbar-link">
              M5 - Mundial
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/m6-prize" className="navbar-link">
              M6 - Premios
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/m7-admin" className="navbar-link">
              M7 - Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
