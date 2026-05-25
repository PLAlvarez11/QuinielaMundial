import { FiRefreshCw, FiAward, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import Loader from '../../components/Loader';
import './Standings.css';

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * Standings — tabla de posiciones para una liga
 * @param {string|number} leagueId - ID de la liga activa
 * @param {Array} standings - datos de posiciones
 * @param {boolean} loading - si está cargando
 * @param {string} error - mensaje de error
 * @param {Function} reload - función para recargar
 */
const Standings = ({ leagueId, standings, loading, error, reload }) => {
  if (loading) {
    return <Loader message="Cargando tabla de posiciones…" />;
  }

  if (error) {
    return (
      <div className="standings-error" role="alert">
        <p>{error}</p>
        <button className="btn-retry" onClick={reload} aria-label="Reintentar cargar tabla">
          <FiRefreshCw size={15} aria-hidden="true" />
          Reintentar
        </button>
      </div>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="standings-empty">
        <FiAward size={40} aria-hidden="true" className="standings-empty__icon" />
        <p>No hay datos de posiciones disponibles</p>
        <p className="standings-empty__hint">Los datos se actualizarán cuando haya resultados disponibles</p>
      </div>
    );
  }

  // Extraer top 3 para podio
  const topThree = standings.slice(0, 3);
  const restStandings = standings.slice(3);

  return (
    <section className="standings" aria-label="Tabla de posiciones">
      {/* ── Header ── */}
      <div className="standings__header">
        <h2 className="standings__title">
          <FiAward size={20} aria-hidden="true" />
          Tabla de Posiciones
        </h2>
        <button
          className="btn-refresh"
          onClick={reload}
          aria-label="Actualizar tabla"
          title="Actualizar datos"
        >
          <FiRefreshCw size={15} aria-hidden="true" />
          Actualizar
        </button>
      </div>

      {/* ── Podio (Top 3) ── */}
      {topThree.length > 0 && (
        <div className="standings__podium">
          {topThree.map((standing, idx) => (
            <div key={standing.user_id || idx} className={`podium-card podium-card--${idx + 1}`}>
              <div className="podium-medal">{MEDALS[idx]}</div>
              <div className="podium-name">{standing.user}</div>
              <div className="podium-pts">
                {standing.total_points}
                <small>pts</small>
              </div>
              {standing.position_variation && (
                <div className="podium-variation">{standing.position_variation}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Tabla completa ── */}
      <div className="standings__table-wrapper">
        <table className="standings-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Jugador</th>
              <th>Puntos</th>
              <th>Cambio</th>
              <th>Variación</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, idx) => (
              <tr key={standing.user_id || idx} className={`standings-row ${idx < 3 ? 'standings-row--top' : ''}`}>
                <td className="cell-rank">
                  <span className="rank-badge">
                    {idx + 1}
                    {idx < 3 && <span className="rank-medal">{MEDALS[idx]}</span>}
                  </span>
                </td>
                <td className="cell-user">{standing.user}</td>
                <td className="cell-points">
                  <strong>{standing.total_points}</strong>
                </td>
                <td className="cell-change">
                  {standing.position_variation && standing.position_variation !== '=' ? (
                    standing.position_variation.includes('↑') ? (
                      <span className="change-up">
                        <FiTrendingUp size={14} aria-hidden="true" />
                        {standing.position_variation}
                      </span>
                    ) : (
                      <span className="change-down">
                        <FiTrendingDown size={14} aria-hidden="true" />
                        {standing.position_variation}
                      </span>
                    )
                  ) : (
                    <span className="change-neutral">—</span>
                  )}
                </td>
                <td className="cell-previous">
                  {standing.previous_position && standing.previous_position !== standing.position
                    ? `de #${standing.previous_position}`
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Información adicional ── */}
      <div className="standings__info">
        <div className="info-item">
          <span className="info-label">Total participantes:</span>
          <span className="info-value">{standings.length}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Puntos del líder:</span>
          <span className="info-value">{standings[0]?.total_points || 0}</span>
        </div>
      </div>
    </section>
  );
};

export default Standings;
