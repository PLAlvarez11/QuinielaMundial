import { useState } from 'react';
import './MatchTable.css';

const STATUS_LABELS = {
  scheduled: 'Programado',
  in_progress: 'En curso',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
};

export default function MatchTable({
  matches,
  loading,
  onEdit,
  onDelete,
  searchTerm,
}) {
  const [sortField, setSortField] = useState('match_date');
  const [sortDirection, setSortDirection] = useState('desc');

  const filteredMatches = matches.filter((match) =>
    (match.home_team_name && match.home_team_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (match.away_team_name && match.away_team_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (match.stadium_name && match.stadium_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR') + ' ' + date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="loading">Cargando partidos...</div>;
  }

  if (sortedMatches.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay partidos registrados</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="match-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('home_team_name')}>
              Local {sortField === 'home_team_name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('away_team_name')}>
              Visitante {sortField === 'away_team_name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Resultado</th>
            <th onClick={() => handleSort('stadium_name')}>
              Estadio {sortField === 'stadium_name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('match_date')}>
              Fecha {sortField === 'match_date' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedMatches.map((match) => (
            <tr key={match.id}>
              <td>{match.home_team_name}</td>
              <td>{match.away_team_name}</td>
              <td className="score">
                {match.home_score !== null && match.away_score !== null
                  ? `${match.home_score} - ${match.away_score}`
                  : '-'}
              </td>
              <td>{match.stadium_name}</td>
              <td>{formatDate(match.match_date)}</td>
              <td>
                <span className={`status-badge status-${match.status}`}>
                  {STATUS_LABELS[match.status]}
                </span>
              </td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(match.id)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(match.id)}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
