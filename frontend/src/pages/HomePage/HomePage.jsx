import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import './HomePage.css';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🌍</span>
            <span className="badge-text">Qatar 2026</span>
          </div>
          <h1 className="hero-title">
            QuinielaMundial
            <span className="highlight">2026</span>
          </h1>
          <p className="hero-subtitle">
            Participa en la emoción del Mundial. Haz tus predicciones, compite con amigos y gana premios increíbles.
          </p>
          <div className="hero-cta">
            {isAuthenticated ? (
              <Link to="/m3-prediction" className="cta-btn primary">
                Comienza a Predecir
                <span className="btn-icon">⚽</span>
              </Link>
            ) : (
              <>
                <Link to="/m1-auth" className="cta-btn primary">
                  Únete Ahora
                  <span className="btn-icon">🚀</span>
                </Link>
                <p className="cta-subtitle">Regístrate gratis y comienza a jugar</p>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-globe">
            <span className="globe-text">⚽</span>
          </div>
          <div className="hero-decoration"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">¿Cómo Funciona?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Haz Predicciones</h3>
            <p>Predice los resultados de todos los partidos del Mundial 2026. Mide tu precisión contra otros jugadores.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Compite</h3>
            <p>Sube en la tabla de posiciones. Compite contra amigos, ligas y la comunidad global de quinieleros.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎁</div>
            <h3>Gana Premios</h3>
            <p>Acumula puntos y gana premios exclusivos. Desde trofeos digitales hasta recompensas reales.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Estadísticas</h3>
            <p>Analiza estadísticas detalladas. Mejora tu estrategia con datos históricos y tendencias en vivo.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Ligas Privadas</h3>
            <p>Crea ligas con tus amigos. Rivaliza en grupos personalizados y comparte la pasión por el fútbol.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>En Vivo</h3>
            <p>Actualización en tiempo real. Sigue los marcadores y cambios de posiciones mientras juegan los partidos.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">64</div>
            <div className="stat-label">Partidos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">32</div>
            <div className="stat-label">Equipos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">8</div>
            <div className="stat-label">Grupos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">12</div>
            <div className="stat-label">Ciudades</div>
          </div>
        </div>
      </section>

      {/* Trending Leagues */}
      <section className="trending">
        <h2 className="section-title">Ligas en Tendencia</h2>
        <div className="leagues-grid">
          <div className="league-card">
            <div className="league-badge">
              <span className="league-icon">🔥</span>
            </div>
            <h3>Global Championship</h3>
            <p className="league-players">
              <span className="player-count">2,543</span> jugadores
            </p>
            <p className="league-desc">La liga más grande de QuinielaMundial. Compite con jugadores de todo el mundo.</p>
            <button className="league-btn">Unirse</button>
          </div>
          <div className="league-card featured">
            <div className="league-badge">
              <span className="league-icon">👑</span>
            </div>
            <h3>Elite Predictions</h3>
            <p className="league-players">
              <span className="player-count">847</span> jugadores
            </p>
            <p className="league-desc">Para los expertos. Solo los mejores predictores compiten aquí.</p>
            <button className="league-btn">Unirse</button>
          </div>
          <div className="league-card">
            <div className="league-badge">
              <span className="league-icon">🌟</span>
            </div>
            <h3>Rising Stars</h3>
            <p className="league-players">
              <span className="player-count">1,203</span> jugadores
            </p>
            <p className="league-desc">Nuevos talentos. Perfecta para jugadores principiantes que quieren aprender.</p>
            <button className="league-btn">Unirse</button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>¿Listo para Demostrar tu Conocimiento?</h2>
          <p>No esperes más. El Mundial 2026 está aquí y es tu momento de brillar.</p>
          {!isAuthenticated && (
            <Link to="/m1-auth" className="cta-btn large">
              Crear Cuenta Gratis
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>QuinielaMundial 2026</h4>
            <p>La plataforma oficial de predicciones para el Mundial 2026.</p>
          </div>
          <div className="footer-section">
            <h4>Rápidos Links</h4>
            <ul>
              <li><a href="#features">Características</a></li>
              <li><a href="#leagues">Ligas</a></li>
              <li><a href="#rules">Reglas</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Conecta</h4>
            <ul>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#instagram">Instagram</a></li>
              <li><a href="#discord">Discord</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 QuinielaMundial. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
