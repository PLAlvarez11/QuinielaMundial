import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeagues, deleteLeague } from '../../api/leaguesApi';
import ConfirmModal from '../../components/ConfirmModal';
import Loader from '../../components/Loader';
import './LeagueList.css';

export default function LeagueList() {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leagueToDelete, setLeagueToDelete] = useState(null);
  const [filters, setFilters] = useState({ status: 'all' });

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLeagues();
      setLeagues(data);
    } catch (err) {
      setError('Error al cargar las ligas: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (league) => {
    setLeagueToDelete(league);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLeague(leagueToDelete.id);
      setLeagues(leagues.filter(l => l.id !== leagueToDelete.id));
      setShowDeleteConfirm(false);
      setLeagueToDelete(null);
    } catch (err) {
      setError('Error al eliminar la liga: ' + err.message);
      console.error(err);
    }
  };

  const filteredLeagues = leagues.filter(league => {
    if (filters.status !== 'all' && league.status !== filters.status) {
      return false;
    }
    return true;
  });

  if (loading) return <Loader />;

  return (
    <div className="league-list-container">
      <div className="league-list-header">
        <h2>Mis Ligas</h2>
        <button className="btn btn-primary" onClick={() => navigate('/m2-league/create')}>
          + Nueva Liga
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="league-filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="inactive">Inactivas</option>
          <option value="finished">Finalizadas</option>
        </select>
      </div>

      {filteredLeagues.length === 0 ? (
        <div className="empty-state">
          <p>No hay ligas para mostrar</p>
          <button className="btn btn-primary" onClick={() => navigate('/m2-league/create')}>
            Crear primera liga
          </button>
        </div>
      ) : (
        <div className="leagues-grid">
          {filteredLeagues.map(league => (
            <div key={league.id} className="league-card">
              <div className="league-card-header">
                <h3>{league.name}</h3>
                <span className={`badge badge-${league.status}`}>
                  {league.status}
                </span>
              </div>

              <div className="league-card-body">
                <p className="league-description">{league.description}</p>

                <div className="league-info">
                  <div className="info-item">
                    <span className="label">Tipo:</span>
                    <span className="value">{league.type}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Cuota de entrada:</span>
                    <span className="value">${league.entry_fee}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Miembros:</span>
                    <span className="value">
                      {league.members?.length || 0} / {league.max_members}
                    </span>
                  </div>
                </div>

                <div className="league-dates">
                  <small>Creada: {new Date(league.created_at).toLocaleDateString('es-ES')}</small>
                </div>
              </div>

              <div className="league-card-footer">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => navigate(`/m2-league/${league.id}`)}
                >
                  Ver Detalles
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(league)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Eliminar Liga"
          message={`¿Estás seguro de que deseas eliminar la liga "${leagueToDelete?.name}"?`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setLeagueToDelete(null);
          }}
        />
      )}
    </div>
  );
}
