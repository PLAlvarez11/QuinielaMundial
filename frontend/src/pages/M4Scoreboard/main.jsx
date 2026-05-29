import { useState, useEffect } from 'react';
import { FiAward, FiCalendar } from 'react-icons/fi';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { getLeagues } from '../../api/leaguesApi';
import { useStandings, useMatches } from './hooks';
import Standings from './Standings';
import Matches from './Matches';
import './main.css';

// ── Tabs configuration ──────────────────────────────────────────────────────
const TABS = [
  { id: 'standings', label: 'Tabla de Posiciones', icon: <FiAward size={16} aria-hidden="true" /> },
  { id: 'matches', label: 'Partidos', icon: <FiCalendar size={16} aria-hidden="true" /> },
];

export default function M4ScoreboardMain() {
  console.log('🔵 M4Scoreboard - Rendering...');

  // ── Toast hook (with fallback) ────────────────────────────────────────────
  let toastHook = null;
  try {
    toastHook = useToast();
  } catch (err) {
    console.warn('⚠️ useToast failed:', err);
  }

  const toast = toastHook || { visible: false, message: '', type: 'info' };
  const showSuccess = toastHook?.showSuccess || (() => console.log('ℹ️ Success (no toast)'));
  const showError = toastHook?.showError || ((msg) => console.error('❌ Error:', msg));
  const hideToast = toastHook?.hideToast || (() => {});

  // ── League state ──────────────────────────────────────────────────────────
  const [leagues, setLeagues] = useState([]);
  const [leaguesLoading, setLeaguesLoading] = useState(true);
  const [selectedLeagueId, setSelectedLeagueId] = useState('');

  // ── UI state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('standings');

  // ── Data hooks ───────────────────────────────────────────────────────────
  const { standings, loading: standingsLoading, error: standingsError, reload: reloadStandings } = 
    useStandings(selectedLeagueId || null);
  
  const { matches, loading: matchesLoading, error: matchesError, reload: reloadMatches } = 
    useMatches(selectedLeagueId || null);

  // ── Log de debugging ──────────────────────────────────────────────────────
  useEffect(() => {
    console.log('🟢 M4Scoreboard - Component Mounted');
    return () => console.log('🔴 M4Scoreboard - Component Unmounted');
  }, []);

  useEffect(() => {
    console.log('📊 Leagues state updated:', { leagues, selectedLeagueId });
  }, [leagues, selectedLeagueId]);

  // ── Load leagues ──────────────────────────────────────────────────────────
  useEffect(() => {
    console.log('📡 Fetching leagues...');
    async function fetchLeagues() {
      try {
        const data = await getLeagues();
        console.log('✅ Leagues fetched:', data);
        const list = Array.isArray(data) ? data : (data?.results ?? []);
        setLeagues(list);
        if (list.length > 0) {
          setSelectedLeagueId(String(list[0].id));
          console.log('✅ Selected first league:', list[0].id);
        } else {
          console.warn('⚠️ No leagues available');
          showError('No hay ligas disponibles. Por favor, crea una liga primero.');
        }
      } catch (err) {
        console.error('❌ Error fetching leagues:', err);
        showError('Error al cargar las ligas disponibles.');
      } finally {
        setLeaguesLoading(false);
      }
    }
    fetchLeagues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-reload standings and matches when league changes ─────────────────
  // Nota: los hooks `useStandings` y `useMatches` manejan su propio polling
  // y realizan la carga inicial cuando `selectedLeagueId` cambia, por lo
  // tanto evitamos llamadas duplicadas desde aquí.

  console.log('🟡 Current render state:', { leaguesLoading, leagues: leagues.length, selectedLeagueId });

  if (leaguesLoading) {
    console.log('⏳ Still loading leagues...');
    return <Loader message="Cargando datos…" />;
  }

  // Si no hay ligas, mostrar un mensaje
  if (leagues.length === 0) {
    console.log('📭 No leagues available');
    return (
      <div className="m4-scoreboard">
        <div className="m4-header">
          <h1>Marcador y Clasificación</h1>
          <p className="m4-subtitle">Sigue los partidos y la tabla de posiciones de tu liga</p>
        </div>
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: '#111827',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <p style={{ margin: '0 0 8px 0', color: '#9CA3AF' }}>
            No hay ligas disponibles
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
            Por favor, crea una liga primero desde el módulo de Gestión de Ligas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="m4-scoreboard">
      {/* ── Toast notifications (if available) ── */}
      {toastHook && toast?.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      {/* ── Header ── */}
      <div className="m4-header">
        <h1>Marcador y Clasificación</h1>
        <p className="m4-subtitle">
          Sigue los partidos y la tabla de posiciones de tu liga
        </p>
      </div>

      {/* ── League selector ── */}
      <div className="m4-controls">
        <div className="league-selector">
          <label htmlFor="league-select" className="selector-label">Selecciona una liga:</label>
          <select
            id="league-select"
            className="selector-input"
            value={selectedLeagueId}
            onChange={(e) => setSelectedLeagueId(e.target.value)}
            aria-label="Seleccionar liga"
          >
            <option value="">-- Selecciona una liga --</option>
            {leagues.map((league) => (
              <option key={league.id} value={String(league.id)}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Tabs navigation ── */}
      <div className="m4-tabs">
        <div className="tabs-nav" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tab-panel-${tab.id}`}
              className={`tab-button ${activeTab === tab.id ? 'tab-button--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="m4-content">
        {activeTab === 'standings' && (
          <div id="tab-panel-standings" role="tabpanel">
            <Standings
              leagueId={selectedLeagueId}
              standings={standings}
              loading={standingsLoading}
              error={standingsError}
              reload={reloadStandings}
            />
          </div>
        )}

        {activeTab === 'matches' && (
          <div id="tab-panel-matches" role="tabpanel">
            <Matches
              leagueId={selectedLeagueId}
              matches={matches}
              loading={matchesLoading}
              error={matchesError}
              reload={reloadMatches}
            />
          </div>
        )}
      </div>
    </div>
  );
}
