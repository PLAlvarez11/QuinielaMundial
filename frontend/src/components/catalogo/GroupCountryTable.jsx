import { useState } from 'react';
import './GroupCountryTable.css';

export default function GroupCountryTable({
  groupCountries,
  loading,
  onEdit,
  onDelete,
  searchTerm,
}) {
  const [sortField, setSortField] = useState('group_name');
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredGC = groupCountries.filter((gc) =>
    (gc.group_name && gc.group_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (gc.country_name && gc.country_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedGC = [...filteredGC].sort((a, b) => {
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
    return <div className="loading">Cargando asignaciones...</div>;
  }

  if (sortedGC.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay asignaciones de países a grupos</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="group-country-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('group_name')}>
              Grupo {sortField === 'group_name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('country_name')}>
              País {sortField === 'country_name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedGC.map((gc) => (
            <tr key={gc.id}>
              <td>Grupo {gc.group_name}</td>
              <td>{gc.country_name}</td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(gc.id)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(gc.id)}
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
