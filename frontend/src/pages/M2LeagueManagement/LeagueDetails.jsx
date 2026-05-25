import { useState } from 'react';
import LeagueMembersManager from './LeagueMembersManager';
import InvitationManager from './InvitationManager';
import './LeagueDetails.css';

export default function LeagueDetails({ league, onEdit, onBack }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'members', 'invitations'

  return (
    <div className="league-details-container">
      <div className="league-details-header">
        <button className="btn-back" onClick={onBack}>
          ← Volver
        </button>
        <h2>{league.name}</h2>
        <button className="btn btn-primary btn-sm" onClick={onEdit}>
          ✎ Editar
        </button>
      </div>

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
    </div>
  );
}
