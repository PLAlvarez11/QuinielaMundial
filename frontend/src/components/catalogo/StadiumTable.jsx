import { useState } from 'react';
import './StadiumTable.css';

export default function StadiumTable({
  stadiums,
  loading,
  onEdit,
  onDelete,
  searchTerm,
}) {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredStadiums = stadiums.filter((stadium) =>
    stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (stadium.venue_name && stadium.venue_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedStadiums = [...filteredStadiums].sort((a, b) => {
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
    return <div className="loading">Cargando estadios...</div>;
  }

  if (sortedStadiums.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay estadios registrados</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="stadium-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Nombre {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('venue_name')}>
              Sede {sortField === 'venue_name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('capacity')}>
              Capacidad {sortField === 'capacity' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedStadiums.map((stadium) => (
            <tr key={stadium.id}>
              <td>{stadium.name}</td>
              <td>{stadium.venue_name}</td>
              <td>{stadium.capacity.toLocaleString('es-AR')}</td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(stadium.id)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(stadium.id)}
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
