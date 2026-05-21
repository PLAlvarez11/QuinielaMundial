import { useState } from 'react';
import './GroupTable.css';

export default function GroupTable({
  groups,
  loading,
  onEdit,
  onDelete,
  searchTerm,
}) {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.stage_name && group.stage_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedGroups = [...filteredGroups].sort((a, b) => {
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
    return <div className="loading">Cargando grupos...</div>;
  }

  if (sortedGroups.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay grupos registrados</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="group-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Nombre {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('stage_name')}>
              Fase {sortField === 'stage_name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedGroups.map((group) => (
            <tr key={group.id}>
              <td>{group.name}</td>
              <td>{group.stage_name}</td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(group.id)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(group.id)}
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
