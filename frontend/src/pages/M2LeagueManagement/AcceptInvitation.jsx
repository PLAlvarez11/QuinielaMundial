import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { acceptInvitation } from '../../api/leaguesApi';
import { useAuth } from '../../context/useAuth';
import './AcceptInvitation.css';

export default function AcceptInvitation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Pre-llenar con un nombre de equipo sugerido
    if (user?.name) {
      setTeamName(`${user.name}'s Team`);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!teamName.trim()) {
      setError('El nombre del equipo es obligatorio');
      setLoading(false);
      return;
    }

    try {
      const result = await acceptInvitation(token, teamName);
      setSuccess(true);
      
      // Redirigir a la liga después de 2 segundos
      setTimeout(() => {
        navigate(`/m2-league/${result.league.id}`);
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 
                      err.response?.data?.message ||
                      'Error al aceptar la invitación';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="accept-invitation-container">
        <div className="accept-invitation-card">
          <h2>Se requiere autenticación</h2>
          <p>Debes iniciar sesión para aceptar una invitación.</p>
          <button 
            onClick={() => navigate('/m1-auth/login')}
            className="btn btn-primary"
          >
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="accept-invitation-container">
        <div className="accept-invitation-card success">
          <h2>✓ Invitación Aceptada</h2>
          <p>¡Bienvenido a la liga! Redirigiendo...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="accept-invitation-container">
      <div className="accept-invitation-card">
        <h2>Aceptar Invitación de Liga</h2>
        <p className="subtitle">Ingresa el nombre de tu equipo para unirte a la liga</p>

        {error && (
          <div className="alert alert-error">
            <span>✗</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="accept-invitation-form">
          <div className="form-group">
            <label htmlFor="user-email">Usuario (Email)</label>
            <input
              type="email"
              id="user-email"
              value={user?.email || ''}
              disabled
              className="form-control disabled"
            />
            <small>Este debe coincidir con el email de la invitación</small>
          </div>

          <div className="form-group">
            <label htmlFor="team-name">Nombre del Equipo *</label>
            <input
              type="text"
              id="team-name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Ej: Los Campeones"
              maxLength="255"
              required
              disabled={loading}
              className="form-control"
            />
            <small>Este será tu nombre en la liga</small>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? 'Aceptando...' : 'Aceptar Invitación'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/m2-league/list')}
            className="btn btn-secondary btn-block"
            disabled={loading}
          >
            Cancelar
          </button>
        </form>

        <div className="info-box">
          <h4>¿Qué sucede después?</h4>
          <ul>
            <li>Serás agregado a la liga con el nombre de equipo especificado</li>
            <li>Podrás ver el marcador y participar en la competencia</li>
            <li>Tus predicciones se registrarán automáticamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
