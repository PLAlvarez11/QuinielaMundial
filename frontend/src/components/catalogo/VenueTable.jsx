import { useState } from 'react';
import './VenueTable.css';

export default function VenueTable({
  venues,
  loading,
  onEdit,
  onDelete,
  searchTerm,
}) {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedVenues = [...filteredVenues].sort((a, b) => {
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
    return <div className="loading">Cargando sedes...</div>;
  }

  if (sortedVenues.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay sedes registradas</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="venue-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Nombre {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('city')}>
              Ciudad {sortField === 'city' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('country')}>
              País {sortField === 'country' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedVenues.map((venue) => (
            <tr key={venue.id}>
              <td>{venue.name}</td>
              <td>{venue.city}</td>
              <td>{venue.country}</td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(venue.id)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(venue.id)}
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
