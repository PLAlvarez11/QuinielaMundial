import { useState } from 'react';
import './TournamentStageTable.css';

export default function TournamentStageTable({
  stages,
  loading,
  onEdit,
  onDelete,
  searchTerm,
}) {
  const [sortField, setSortField] = useState('order');
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredStages = stages.filter((stage) =>
    stage.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStages = [...filteredStages].sort((a, b) => {
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

  if (loading) {
    return <div className="loading">Cargando fases...</div>;
  }

  if (sortedStages.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay fases registradas</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="tournament-stage-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('order')}>
              Orden {sortField === 'order' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('name')}>
              Nombre {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedStages.map((stage) => (
            <tr key={stage.id}>
              <td>{stage.order}</td>
              <td>{stage.name}</td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(stage.id)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(stage.id)}
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
