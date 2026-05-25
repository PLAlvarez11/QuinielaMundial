import { FiRefreshCw, FiAward } from 'react-icons/fi';
import Loader from '../../components/Loader';
import { useScoreboard } from './hooks/useScoreboard';
import './Scoreboard.css';

const MEDALS = ['🥇', '🥈', '🥉'];

/**
 * Scoreboard — ranked leaderboard for a league.
 *
 * Props:
 *   leagueId — ID of the active league
 */
const Scoreboard = ({ leagueId }) => {
  const { rows, loading, error, reload } = useScoreboard(leagueId);

  if (loading) {
    return <Loader message="Cargando tabla de posiciones…" />;
  }

  if (error) {
    return (
      <div className="scoreboard-error" role="alert">
        <p>{error}</p>
        <button className="btn-retry" onClick={reload} aria-label="Reintentar cargar tabla de posiciones">
          <FiRefreshCw size={15} aria-hidden="true" />
          Reintentar
        </button>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="scoreboard-empty">
        <FiAward size={40} aria-hidden="true" className="scoreboard-empty__icon" />
        <p>Aún no hay posiciones registradas para esta liga.</p>
        <p className="scoreboard-empty__hint">Los puntos se asignan cuando un partido finaliza.</p>
      </div>
    );
  }

  return (
    <section className="scoreboard" aria-label="Tabla de posiciones">
      <div className="scoreboard__header">
        <h2 className="scoreboard__title">
          <FiAward size={20} aria-hidden="true" />
          Tabla de Posiciones
        </h2>
        <button
          className="btn-refresh"
          onClick={reload}
          aria-label="Actualizar tabla de posiciones"
        >
          <FiRefreshCw size={15} aria-hidden="true" />
          Actualizar
        </button>
      </div>

      {/* ── Summary cards for top 3 ── */}
      <div className="scoreboard__podium" aria-label="Podio">
        {rows.slice(0, 3).map((row, idx) => (
          <div
            key={row.user_id}
            className={`podium-card podium-card--${idx + 1}`}
            aria-label={`Posición ${idx + 1}: ${row.user_name}, ${row.total_points} puntos`}
          >
            <span className="podium-medal" aria-hidden="true">{MEDALS[idx]}</span>
            <span className="podium-name">{row.user_name}</span>
            <span className="podium-pts" aria-label={`${row.total_points} puntos`}>
              {row.total_points} <small>pts</small>
            </span>
          </div>
        ))}
      </div>

      {/* ── Full table ── */}
      <div className="scoreboard__table-wrapper" role="region" aria-label="Tabla completa">
        <table className="scoreboard-table" aria-label="Posiciones de la liga">
          <thead>
            <tr>
              <th scope="col" abbr="Posición">#</th>
              <th scope="col">Participante</th>
              <th scope="col" abbr="Puntos totales">Pts</th>
              <th scope="col" abbr="Vaticinios exactos">Exactos</th>
              <th scope="col" abbr="Vaticinios jugados">Jugados</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.user_id}
                className={idx < 3 ? 'row--top' : ''}
                aria-label={`Posición ${idx + 1}, ${row.user_name}`}
              >
                <td className="cell-rank" aria-label={`Posición ${idx + 1}`}>
                  {idx < 3 ? (
                    <span aria-hidden="true">{MEDALS[idx]}</span>
                  ) : (
                    idx + 1
                  )}
                </td>
                <td className="cell-name">{row.user_name}</td>
                <td className="cell-pts">
                  <strong>{row.total_points}</strong>
                </td>
                <td className="cell-exact">{row.exact_score_count}</td>
                <td className="cell-played">{row.prediction_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Scoring legend ── */}
      <footer className="scoreboard__legend" aria-label="Leyenda de puntuación">
        <p>
          <span className="legend-pill legend-pill--3">3 pts</span> Marcador exacto
          &nbsp;·&nbsp;
          <span className="legend-pill legend-pill--1">1 pt</span> Resultado correcto
        </p>
      </footer>
    </section>
  );
};

export default Scoreboard;
