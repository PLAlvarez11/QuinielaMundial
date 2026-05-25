import { FiRefreshCw, FiCalendar, FiClock } from 'react-icons/fi';
import Loader from '../../components/Loader';
import './Matches.css';

/**
 * Matches — lista de partidos de un torneo
 * @param {string|number} leagueId - ID de la liga activa
 * @param {Array} matches - datos de partidos
 * @param {boolean} loading - si está cargando
 * @param {string} error - mensaje de error
 * @param {Function} reload - función para recargar
 */
const Matches = ({ leagueId, matches, loading, error, reload }) => {
  if (loading) {
    return <Loader message="Cargando partidos…" />;
  }

  if (error) {
    return (
      <div className="matches-error" role="alert">
        <p>{error}</p>
        <button className="btn-retry" onClick={reload} aria-label="Reintentar cargar partidos">
          <FiRefreshCw size={15} aria-hidden="true" />
          Reintentar
        </button>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="matches-empty">
        <FiCalendar size={40} aria-hidden="true" className="matches-empty__icon" />
        <p>No hay partidos disponibles</p>
      </div>
    );
  }

  // Agrupar por jornada
  const matchesByRound = matches.reduce((acc, match) => {
    const round = match.round_number || 1;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {});

  // Ordenar jornadas
  const roundKeys = Object.keys(matchesByRound).sort((a, b) => a - b);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getMatchStatus = (match) => {
    if (match.is_finished) return 'finished';
    const matchDate = new Date(match.match_date);
    const now = new Date();
    if (matchDate < now) return 'in_progress';
    return 'scheduled';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'finished':
        return <span className="match-status match-status--finished">Finalizado</span>;
      case 'in_progress':
        return <span className="match-status match-status--live">En vivo</span>;
      case 'scheduled':
        return <span className="match-status match-status--scheduled">Programado</span>;
      default:
        return null;
    }
  };

  return (
    <section className="matches" aria-label="Partidos">
      {/* ── Header ── */}
      <div className="matches__header">
        <h2 className="matches__title">
          <FiCalendar size={20} aria-hidden="true" />
          Calendario de Partidos
        </h2>
        <button
          className="btn-refresh"
          onClick={reload}
          aria-label="Actualizar partidos"
          title="Actualizar datos"
        >
          <FiRefreshCw size={15} aria-hidden="true" />
          Actualizar
        </button>
      </div>

      {/* ── Partidos agrupados por jornada ── */}
      <div className="matches__rounds">
        {roundKeys.map((roundKey) => (
          <div key={roundKey} className="round-section">
            <h3 className="round-title">Jornada {roundKey}</h3>
            <div className="matches-list">
              {matchesByRound[roundKey].map((match) => {
                const status = getMatchStatus(match);
                return (
                  <div key={match.id} className={`match-card match-card--${status}`}>
                    {/* ── Equipo local ── */}
                    <div className="match-team match-team--home">
                      <div className="team-name">{match.home_team}</div>
                      {match.is_finished && (
                        <div className="team-score">{match.home_score}</div>
                      )}
                    </div>

                    {/* ── Centro (información del partido) ── */}
                    <div className="match-center">
                      {match.is_finished ? (
                        <div className="match-result">
                          <span className="result-score">
                            {match.home_score} - {match.away_score}
                          </span>
                          {getStatusBadge(status)}
                        </div>
                      ) : (
                        <div className="match-meta">
                          <div className="match-date">
                            <FiCalendar size={13} aria-hidden="true" />
                            {formatDate(match.match_date)}
                          </div>
                          {getStatusBadge(status)}
                        </div>
                      )}
                    </div>

                    {/* ── Equipo visitante ── */}
                    <div className="match-team match-team--away">
                      {match.is_finished && (
                        <div className="team-score">{match.away_score}</div>
                      )}
                      <div className="team-name">{match.away_team}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Estadísticas ── */}
      <div className="matches__stats">
        <div className="stat-item">
          <span className="stat-label">Total de partidos:</span>
          <span className="stat-value">{matches.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Finalizados:</span>
          <span className="stat-value">
            {matches.filter(m => m.is_finished).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pendientes:</span>
          <span className="stat-value">
            {matches.filter(m => !m.is_finished).length}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Matches;
