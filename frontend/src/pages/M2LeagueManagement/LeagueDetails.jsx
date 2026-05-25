import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeagueDetail, leaveLeague } from '../../api/leaguesApi';
import ConfirmModal from '../../components/ConfirmModal';
import LeagueMembersManager from './LeagueMembersManager';
import InvitationManager from './InvitationManager';
import Loader from '../../components/Loader';
import './LeagueDetails.css';

export default function LeagueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isLeavingLeague, setIsLeavingLeague] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('userId');
    setCurrentUser(user);
    fetchLeague();
  }, [id]);

  const fetchLeague = async () => {
    try {
      setLoading(true);
      const data = await getLeagueDetail(id);
      setLeague(data);
    } catch (err) {
      setError('Error al cargar la liga: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = currentUser && league && league.owner?.id == currentUser;
  const isMember = currentUser && league && league.members?.some(m => m.user?.id == currentUser || m.user == currentUser);

  const handleLeaveLeague = async () => {
    try {
      setIsLeavingLeague(true);
      setError(null);
      await leaveLeague(league.id);
      setSuccess('Has abandonado la liga exitosamente');
      setTimeout(() => {
        navigate('/m2-league/list');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al abandonar la liga: ' + err.message
      );
      console.error(err);
    } finally {
      setIsLeavingLeague(false);
      setShowLeaveConfirm(false);
    }
  };

  if (loading) return <Loader />;
  if (error && !league) return <div className="alert alert-error">{error}</div>;
  if (!league) return <div className="alert alert-error">Liga no encontrada</div>;

  return (
    <div className="league-details-container">
      <div className="league-details-header">
        <button className="btn-back" onClick={() => navigate('/m2-league/list')}>
          ← Volver
        </button>
        <h2>{league.name}</h2>
        <div className="header-actions">
          {isOwner && (
            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/m2-league/${id}/edit`)}>
              ✎ Editar
            </button>
          )}
          {!isOwner && isMember && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setShowLeaveConfirm(true)}
              disabled={isLeavingLeague}
            >
              {isLeavingLeague ? 'Abandonando...' : '✕ Abandonar Liga'}
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="league-overview-card">
        <div className="overview-section">
          <h3>Información de la Liga</h3>
          <div className="info-grid">
            <div className="info-block">
              <span className="info-label">Descripción</span>
              <p className="info-value">
                {league.description || 'Sin descripción'}
              </p>
            </div>

            <div className="info-grid-2col">
              <div className="info-block">
                <span className="info-label">Tipo</span>
                <p className="info-value">{league.type}</p>
              </div>

              <div className="info-block">
                <span className="info-label">Estado</span>
                <p className="info-value">
                  <span className={`badge badge-${league.status}`}>
                    {league.status}
                  </span>
                </p>
              </div>

              <div className="info-block">
                <span className="info-label">Cuota de Entrada</span>
                <p className="info-value">${league.entry_fee}</p>
              </div>

              <div className="info-block">
                <span className="info-label">Miembros</span>
                <p className="info-value">
                  {league.members?.length || 0} / {league.max_members}
                </p>
              </div>

              <div className="info-block">
                <span className="info-label">Creada</span>
                <p className="info-value">
                  {new Date(league.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>

              <div className="info-block">
                <span className="info-label">Propietario</span>
                <p className="info-value">
                  {league.owner?.username || league.owner}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Descripción General
          </button>
          <button
            className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Miembros
          </button>
          <button
            className={`tab-button ${activeTab === 'invitations' ? 'active' : ''}`}
            onClick={() => setActiveTab('invitations')}
          >
            Invitaciones
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <div className="overview-stats">
                <div className="stat-card">
                  <div className="stat-number">
                    {league.members?.length || 0}
                  </div>
                  <div className="stat-label">Miembros Activos</div>
                </div>

                <div className="stat-card">
                  <div className="stat-number">
                    {league.max_members}
                  </div>
                  <div className="stat-label">Capacidad Total</div>
                </div>

                <div className="stat-card">
                  <div className="stat-number">
                    {league.max_members - (league.members?.length || 0)}
                  </div>
                  <div className="stat-label">Lugares Disponibles</div>
                </div>

                <div className="stat-card">
                  <div className="stat-number">
                    ${league.entry_fee * (league.members?.length || 0)}
                  </div>
                  <div className="stat-label">Monto Total Acumulado</div>
                </div>
              </div>

              <div className="league-info-detailed">
                <h4>Detalles Adicionales</h4>
                <ul>
                  <li>
                    <strong>ID de Liga:</strong> {league.id}
                  </li>
                  <li>
                    <strong>Tipo:</strong> {league.type}
                  </li>
                  <li>
                    <strong>Cuota por Miembro:</strong> ${league.entry_fee}
                  </li>
                  <li>
                    <strong>Última Actualización:</strong>{' '}
                    {new Date(league.updated_at).toLocaleDateString('es-ES')}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="tab-pane">
              <LeagueMembersManager league={league} />
            </div>
          )}

          {activeTab === 'invitations' && (
            <div className="tab-pane">
              <InvitationManager league={league} />
            </div>
          )}
        </div>
      </div>

      {showLeaveConfirm && (
        <ConfirmModal
          title="Abandonar Liga"
          message={`¿Estás seguro de que deseas abandonar "${league.name}"? No podrás revertir esta acción.`}
          onConfirm={handleLeaveLeague}
          onCancel={() => setShowLeaveConfirm(false)}
          confirmText="Abandonar"
          isDangerous={true}
        />
      )}
    </div>
  );
}
