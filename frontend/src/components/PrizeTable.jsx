import React from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import './PrizeTable.css';

/**
 * Componente PrizeTable - Tabla de premios
 */
const PrizeTable = ({ prizes, onEdit, onDelete, isLoading = false }) => {
  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Traducir posición
  const positionLabels = {
    first: 'Primer lugar',
    second: 'Segundo lugar',
    third: 'Tercer lugar',
    last: 'Último lugar',
    global_individual: 'Premio global individual',
    global_league: 'Premio global por liga',
  };

  // Traducir tipo
  const typeLabels = {
    league: 'Liga',
    global: 'Global',
    tie: 'Empate',
  };

  // Empty state
  if (!prizes || prizes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3>Sin premios</h3>
        <p>No hay premios registrados. Crea el primero haciendo clic en "Nuevo".</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Liga</th>
            <th>Miembro</th>
            <th>Posición</th>
            <th>Monto</th>
            <th>Tipo</th>
            <th>Fecha Creación</th>
            <th className="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prizes.map((prize) => (
            <tr key={prize.id} className="table-row">
              <td>
                <span className="badge-league">
                  {prize.league_name || prize.league}
                </span>
              </td>
              <td>
                <span className="member-name">
                  {prize.member_name || prize.member}
                </span>
              </td>
              <td>
                <span className="position-badge">
                  {positionLabels[prize.position] || prize.position}
                </span>
              </td>
              <td>
                <span className="amount-value">
                  {formatCurrency(prize.amount)}
                </span>
              </td>
              <td>
                <span className={`type-badge type-${prize.type}`}>
                  {typeLabels[prize.type] || prize.type}
                </span>
              </td>
              <td>
                <span className="date-value">
                  {new Date(prize.created_at).toLocaleDateString('es-ES')}
                </span>
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button
                    className="btn-action btn-edit"
                    onClick={() => onEdit(prize.id)}
                    title="Editar"
                    disabled={isLoading}
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => onDelete(prize.id)}
                    title="Eliminar"
                    disabled={isLoading}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrizeTable;
