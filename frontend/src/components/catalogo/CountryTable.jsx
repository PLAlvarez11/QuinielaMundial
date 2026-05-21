import { useState } from 'react';
import './CountryTable.css';

export default function CountryTable({
  countries,
  loading,
  onEdit,
  onDelete,
  searchTerm,
}) {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCountries = [...filteredCountries].sort((a, b) => {
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
    return <div className="loading">Cargando países...</div>;
  }

  if (sortedCountries.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay países registrados</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="country-table">
        <thead>
          <tr>
            <th>Bandera</th>
            <th onClick={() => handleSort('name')}>
              Nombre {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('code')}>
              Código {sortField === 'code' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedCountries.map((country) => (
            <tr key={country.id}>
              <td className="flag-cell">
                {country.flag_url ? (
                  <img src={country.flag_url} alt={country.name} className="flag-img" />
                ) : (
                  <span className="no-flag">-</span>
                )}
              </td>
              <td>{country.name}</td>
              <td>{country.code}</td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(country.id)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(country.id)}
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
