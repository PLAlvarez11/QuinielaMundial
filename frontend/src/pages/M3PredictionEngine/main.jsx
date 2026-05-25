import React, { useState, useEffect } from 'react';
import { FiTarget, FiAward, FiRefreshCw, FiFilter } from 'react-icons/fi';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { getLeagues } from '../../api/leaguesApi';
import { usePredictions } from './hooks/usePredictions';
import MatchCard from './MatchCard';
import Scoreboard from './Scoreboard';
import './PredictionEngine.css';

// ── Filter options ────────────────────────────────────────────────────────────

const STATUS_FILTERS = [
  { value: 'all',         label: 'Todos' },
  { value: 'scheduled',  label: 'Programados' },
  { value: 'in_progress',label: 'En curso' },
  { value: 'finished',   label: 'Finalizados' },
];

const TABS = [
  { id: 'predictions', label: 'Mis Vaticinios', icon: <FiTarget size={16} aria-hidden="true" /> },
  { id: 'scoreboard',  label: 'Tabla de Posiciones', icon: <FiAward  size={16} aria-hidden="true" /> },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function M3PredictionEngineMain() {
  const { toast, showSuccess, showError, hideToast } = useToast();

  // ── League state ─────────────────────────────────────────────────────────────
  const [leagues, setLeagues] = useState([]);
  const [leaguesLoading, setLeaguesLoading] = useState(true);
  const [selectedLeagueId, setSelectedLeagueId] = useState('');

  // ── UI state ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('predictions');
  const [statusFilter, setStatusFilter] = useState('all');

  // ── Load leagues ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchLeagues() {
      try {
        const data = await getLeagues();
        const list = Array.isArray(data) ? data : (data?.results ?? []);
        setLeagues(list);
        if (list.length > 0) {
          setSelectedLeagueId(String(list[0].id));
        }
      } catch {
        showError('Error al cargar las ligas disponibles.');
      } finally {
        setLeaguesLoading(false);
      }
    }
    fetchLeagues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Predictions hook ──────────────────────────────────────────────────────────
  const {
    matches,
    predictionByMatch,
    loading: predictionsLoading,
    error: predictionsError,
    reload,
    savePrediction,
    removePrediction,
  } = usePredictions(selectedLeagueId || null);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleSave = async (matchId, scores, existingId) => {
    await savePrediction(matchId, scores, existingId);
    // Per-card success is shown inside MatchCard; no global toast needed.
  };

  const handleDelete = async (matchId, predictionId) => {
    try {
      await removePrediction(matchId, predictionId);
      showSuccess('Vaticinio eliminado.');
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Error al eliminar el vaticinio.';
      showError(msg);
      throw err; // re-throw so MatchCard can stop its spinner
    }
  };

  // ── Filtered + sorted matches ─────────────────────────────────────────────────
  const filteredMatches = matches.filter((m) =>
    statusFilter === 'all' ? true : m.status === statusFilter
  );

  // ── Derived stats ─────────────────────────────────────────────────────────────
  const totalPredictions = Object.keys(predictionByMatch).length;
  const pendingMatches = matches.filter(
    (m) => m.status === 'scheduled' && !predictionByMatch[m.id]
  ).length;

  // ── Render ────────────────────────────────────────────────────────────────────

  if (leaguesLoading) {
    return <Loader message="Cargando ligas…" />;
  }

  return (
    <div className="pe-page">
      {/* ── Page header ── */}
      <header className="pe-page__header">
        <div className="pe-page__title-row">
          <h1 className="pe-page__title">
            <FiTarget size={24} aria-hidden="true" />
            Motor de Vaticinios
          </h1>

          {/* League selector */}
          {leagues.length > 0 && (
            <div className="pe-league-selector">
              <label htmlFor="league-select" className="pe-league-selector__label">
                Liga
              </label>
              <select
                id="league-select"
                value={selectedLeagueId}
                onChange={(e) => setSelectedLeagueId(e.target.value)}
                className="pe-league-selector__select"
                aria-label="Seleccionar liga"
              >
                {leagues.map((lg) => (
                  <option key={lg.id} value={lg.id}>
                    {lg.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {leagues.length === 0 && (
            <p className="pe-no-leagues" role="status">
              No hay ligas disponibles. Uníte a una liga para empezar.
            </p>
          )}
        </div>

        {/* Summary stats */}
        {selectedLeagueId && (
          <div className="pe-stats" aria-label="Resumen">
            <div className="pe-stat">
              <span className="pe-stat__value">{matches.length}</span>
              <span className="pe-stat__label">Partidos</span>
            </div>
            <div className="pe-stat">
              <span className="pe-stat__value">{totalPredictions}</span>
              <span className="pe-stat__label">Vaticinios</span>
            </div>
            <div className="pe-stat pe-stat--alert" aria-label={`${pendingMatches} partidos sin vaticinio`}>
              <span className="pe-stat__value">{pendingMatches}</span>
              <span className="pe-stat__label">Pendientes</span>
            </div>
          </div>
        )}
      </header>

      {/* ── Tab navigation ── */}
      <nav className="pe-tabs" aria-label="Navegación del módulo">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`pe-tab ${activeTab === tab.id ? 'pe-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Tab panels ── */}
      <main className="pe-content">

        {/* ── Predictions tab ── */}
        <div
          id="tabpanel-predictions"
          role="tabpanel"
          aria-labelledby="tab-predictions"
          hidden={activeTab !== 'predictions'}
        >
          {activeTab === 'predictions' && selectedLeagueId && (
            <>
              {/* Filter bar */}
              <div className="pe-filter-bar" aria-label="Filtros de partidos">
                <FiFilter size={14} aria-hidden="true" className="pe-filter-bar__icon" />
                <div className="pe-filter-chips" role="group" aria-label="Filtrar por estado">
                  {STATUS_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      className={`filter-chip ${statusFilter === f.value ? 'filter-chip--active' : ''}`}
                      onClick={() => setStatusFilter(f.value)}
                      aria-pressed={statusFilter === f.value}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <button
                  className="btn-reload"
                  onClick={reload}
                  aria-label="Recargar partidos"
                  title="Recargar"
                >
                  <FiRefreshCw size={15} aria-hidden="true" />
                </button>
              </div>

              {/* Content */}
              {predictionsLoading && <Loader message="Cargando partidos…" />}

              {predictionsError && !predictionsLoading && (
                <div className="pe-error" role="alert">
                  <p>{predictionsError}</p>
                  <button className="btn-retry-main" onClick={reload}>
                    <FiRefreshCw size={14} aria-hidden="true" />
                    Reintentar
                  </button>
                </div>
              )}

              {!predictionsLoading && !predictionsError && filteredMatches.length === 0 && (
                <div className="pe-empty" role="status">
                  <p>No hay partidos con el filtro seleccionado.</p>
                </div>
              )}

              {!predictionsLoading && !predictionsError && filteredMatches.length > 0 && (
                <div
                  className="pe-match-grid"
                  aria-label="Lista de partidos"
                  aria-live="polite"
                >
                  {filteredMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      prediction={predictionByMatch[match.id] ?? null}
                      onSave={handleSave}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {!selectedLeagueId && !leaguesLoading && (
            <div className="pe-empty" role="status">
              <p>Seleccioná una liga para ver los partidos.</p>
            </div>
          )}
        </div>

        {/* ── Scoreboard tab ── */}
        <div
          id="tabpanel-scoreboard"
          role="tabpanel"
          aria-labelledby="tab-scoreboard"
          hidden={activeTab !== 'scoreboard'}
        >
          {activeTab === 'scoreboard' && selectedLeagueId && (
            <Scoreboard leagueId={selectedLeagueId} />
          )}

          {activeTab === 'scoreboard' && !selectedLeagueId && (
            <div className="pe-empty" role="status">
              <p>Seleccioná una liga para ver la tabla de posiciones.</p>
            </div>
          )}
        </div>

      </main>

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
