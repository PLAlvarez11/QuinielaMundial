import { useState, useEffect } from 'react';
import {
  getLeagueInvitations,
  sendInvitation,
  cancelInvitation,
} from '../../api/leaguesApi';
import ConfirmModal from '../../components/ConfirmModal';
import Loader from '../../components/Loader';
import './InvitationManager.css';

export default function InvitationManager({ league }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '' });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [invitationToCancel, setInvitationToCancel] = useState(null);
  const [filters, setFilters] = useState({ status: 'all' });

  useEffect(() => {
    if (league) {
      fetchInvitations();
    }
  }, [league]);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLeagueInvitations(league.id);
      setInvitations(data);
    } catch (err) {
      setError('Error al cargar las invitaciones: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    try {
      setLoading(true);
      const invitationData = {
        league: league.id,
        email: formData.email.trim(),
      };

      const result = await sendInvitation(invitationData);
      setInvitations([...invitations, result]);
      setFormData({ email: '' });
      setShowForm(false);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Error al enviar la invitación: ' + err.message
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (invitation) => {
    setInvitationToCancel(invitation);
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    try {
      await cancelInvitation(invitationToCancel.id);
      setInvitations(
        invitations.filter(i => i.id !== invitationToCancel.id)
      );
      setShowCancelConfirm(false);
      setInvitationToCancel(null);
    } catch (err) {
      setError('Error al cancelar la invitación: ' + err.message);
      console.error(err);
    }
  };

  const filteredInvitations = invitations.filter(invitation => {
    if (filters.status !== 'all' && invitation.status !== filters.status) {
      return false;
    }
    return true;
  });

  if (loading && invitations.length === 0) return <Loader />;

  const expiresDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const expired = date < now;
    return {
      date: date.toLocaleDateString('es-ES'),
      expired,
    };
  };

  return (
    <div className="invitation-manager-container">
      <div className="invitations-header">
        <h3>Invitaciones ({filteredInvitations.length})</h3>
        {!showForm && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm(true)}
          >
            + Enviar Invitación
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form onSubmit={handleSendInvitation} className="invitation-form">
          <div className="form-group">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              placeholder="Correo electrónico del usuario"
              disabled={loading}
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setShowForm(false);
                setFormData({ email: '' });
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {invitations.length > 0 && (
        <div className="invitations-filters">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="accepted">Aceptadas</option>
            <option value="rejected">Rechazadas</option>
            <option value="expired">Expiradas</option>
          </select>
        </div>
      )}

      {filteredInvitations.length === 0 ? (
        <div className="empty-state">
          <p>
            {invitations.length === 0
              ? 'No hay invitaciones aún'
              : 'No hay invitaciones con ese estado'}
          </p>
        </div>
      ) : (
        <div className="invitations-table-wrapper">
          <table className="invitations-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Estado</th>
                <th>Invitado por</th>
                <th>Expira</th>
                <th>Enviada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvitations.map(invitation => {
                const expiration = expiresDate(invitation.expires_at);
                return (
                  <tr key={invitation.id}>
                    <td>{invitation.email}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          expiration.expired
                            ? 'expired'
                            : invitation.status
                        }`}
                      >
                        {expiration.expired
                          ? 'Expirada'
                          : invitation.status}
                      </span>
                    </td>
                    <td>
                      {invitation.invited_by?.username ||
                        invitation.invited_by}
                    </td>
                    <td>
                      <small
                        className={expiration.expired ? 'expired-text' : ''}
                      >
                        {expiration.date}
                      </small>
                    </td>
                    <td>
                      <small>
                        {new Date(invitation.created_at).toLocaleDateString(
                          'es-ES'
                        )}
                      </small>
                    </td>
                    <td className="actions-cell">
                      {invitation.status === 'pending' &&
                        !expiration.expired && (
                          <button
                            className="btn btn-xs btn-danger"
                            onClick={() => handleCancel(invitation)}
                          >
                            Cancelar
                          </button>
                        )}
                      {expiration.expired && (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showCancelConfirm && (
        <ConfirmModal
          title="Cancelar Invitación"
          message={`¿Estás seguro de que deseas cancelar la invitación a ${invitationToCancel?.email}?`}
          onConfirm={confirmCancel}
          onCancel={() => {
            setShowCancelConfirm(false);
            setInvitationToCancel(null);
          }}
        />
      )}
    </div>
  );
}
