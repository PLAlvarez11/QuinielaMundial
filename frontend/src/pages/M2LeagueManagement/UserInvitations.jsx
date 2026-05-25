import { useState, useEffect } from 'react';
import { getInvitations, acceptInvitation, rejectInvitation } from '../../api/leaguesApi';
import ConfirmModal from '../../components/ConfirmModal';
import Loader from '../../components/Loader';
import './UserInvitations.css';

export default function UserInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showTeamNameForm, setShowTeamNameForm] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchUserInvitations();
  }, []);

  const fetchUserInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInvitations();
      
      // Filtrar solo las invitaciones pendientes del usuario actual
      const userEmail = localStorage.getItem('userEmail'); // Asumiendo que guardas el email en localStorage
      const pendingInvitations = data.filter(inv => 
        inv.status === 'pending' && 
        new Date(inv.expires_at) > new Date()
      );
      
      setInvitations(pendingInvitations);
    } catch (err) {
      setError('Error al cargar tus invitaciones: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptClick = (invitation) => {
    setSelectedInvitation(invitation);
    const userName = localStorage.getItem('userName') || 'Mi';
    setTeamName(`${userName} Equipo`);
    setShowTeamNameForm(true);
  };

  const handleSubmitTeamName = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setError('El nombre del equipo es requerido');
      return;
    }

    setConfirmAction({
      type: 'accept',
      invitation: selectedInvitation,
      teamName: teamName.trim(),
    });
    setShowConfirm(true);
  };

  const handleRejectClick = (invitation) => {
    setConfirmAction({
      type: 'reject',
      invitation: invitation,
    });
    setShowConfirm(true);
  };

  const confirmAction_confirmed = async () => {
    if (!confirmAction) return;

    try {
      setProcessingId(confirmAction.invitation.id);
      setError(null);

      if (confirmAction.type === 'accept') {
        await acceptInvitation(
          confirmAction.invitation.token,
          confirmAction.teamName
        );
        setSuccess(`¡Te has unido a "${confirmAction.invitation.league.name}" exitosamente!`);
      } else if (confirmAction.type === 'reject') {
        await rejectInvitation(confirmAction.invitation.token);
        setSuccess(`Invitación de "${confirmAction.invitation.league.name}" rechazada`);
      }

      // Remover la invitación de la lista
      setInvitations(
        invitations.filter(inv => inv.id !== confirmAction.invitation.id)
      );
      setShowConfirm(false);
      setConfirmAction(null);
      setShowTeamNameForm(false);
      setSelectedInvitation(null);
      setTeamName('');

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al procesar la invitación: ' + err.message
      );
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const getConfirmMessage = () => {
    if (confirmAction?.type === 'accept') {
      return `¿Deseas unirte a "${confirmAction.invitation.league.name}" con el nombre de equipo "${confirmAction.teamName}"?`;
    } else {
      return `¿Deseas rechazar la invitación de "${confirmAction?.invitation.league.name}"?`;
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="user-invitations-container">
      <div className="user-invitations-header">
        <h2>Mis Invitaciones</h2>
        <p className="subtitle">Acepta o rechaza invitaciones a ligas</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {invitations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📨</div>
          <h3>No tienes invitaciones pendientes</h3>
          <p>Cuando alguien te invite a una liga, aparecerá aquí</p>
        </div>
      ) : (
        <div className="invitations-list">
          {invitations.map(invitation => (
            <div key={invitation.id} className="invitation-card">
              <div className="invitation-card-header">
                <div>
                  <h3 className="league-name">{invitation.league.name}</h3>
                  <p className="invited-by">
                    Invitado por <strong>{invitation.invited_by.username}</strong>
                  </p>
                </div>
                <span className="badge badge-pending">Pendiente</span>
              </div>

              <div className="invitation-card-body">
                <div className="league-info-row">
                  <span className="label">Tipo:</span>
                  <span className="value">{invitation.league.type}</span>
                </div>
                {invitation.league.description && (
                  <div className="league-info-row">
                    <span className="label">Descripción:</span>
                    <span className="value">{invitation.league.description}</span>
                  </div>
                )}
                <div className="league-info-row">
                  <span className="label">Cuota de entrada:</span>
                  <span className="value">${invitation.league.entry_fee}</span>
                </div>
                <div className="league-info-row">
                  <span className="label">Miembros:</span>
                  <span className="value">
                    {invitation.league.members?.length || 0} / {invitation.league.max_members}
                  </span>
                </div>
                <div className="league-info-row">
                  <span className="label">Expira:</span>
                  <span className="value">
                    {new Date(invitation.expires_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>

              <div className="invitation-card-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleAcceptClick(invitation)}
                  disabled={processingId === invitation.id}
                >
                  ✓ Aceptar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleRejectClick(invitation)}
                  disabled={processingId === invitation.id}
                >
                  ✕ Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showTeamNameForm && selectedInvitation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Cuál será el nombre de tu equipo?</h3>
            <form onSubmit={handleSubmitTeamName}>
              <div className="form-group">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Nombre de tu equipo"
                  maxLength="255"
                  autoFocus
                />
                <small>Puedes cambiar esto después</small>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowTeamNameForm(false);
                    setSelectedInvitation(null);
                    setTeamName('');
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirm && confirmAction && (
        <ConfirmModal
          title={confirmAction.type === 'accept' ? 'Aceptar Invitación' : 'Rechazar Invitación'}
          message={getConfirmMessage()}
          onConfirm={confirmAction_confirmed}
          onCancel={() => {
            setShowConfirm(false);
            setConfirmAction(null);
          }}
          confirmText={confirmAction.type === 'accept' ? 'Aceptar' : 'Rechazar'}
          isDangerous={confirmAction.type === 'reject'}
        />
      )}
    </div>
  );
}
