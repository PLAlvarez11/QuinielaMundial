import { useState, useEffect } from 'react';
import { createLeague, updateLeague } from '../../api/leaguesApi';
import Loader from '../../components/Loader';
import './LeagueForm.css';

export default function LeagueForm({ league = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'public',
    entry_fee: '0.00',
    max_members: '10',
    status: 'active',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (league) {
      setFormData({
        name: league.name,
        description: league.description || '',
        type: league.type,
        entry_fee: league.entry_fee.toString(),
        max_members: league.max_members.toString(),
        status: league.status,
      });
    }
  }, [league]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación básica
    if (!formData.name.trim()) {
      setError('El nombre de la liga es requerido');
      return;
    }

    if (parseInt(formData.max_members) < 2) {
      setError('La liga debe tener al menos 2 miembros');
      return;
    }

    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        entry_fee: parseFloat(formData.entry_fee),
        max_members: parseInt(formData.max_members),
      };

      let result;
      if (league) {
        result = await updateLeague(league.id, dataToSubmit);
      } else {
        result = await createLeague(dataToSubmit);
      }

      onSuccess(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar la liga: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="league-form-container">
      <h2>{league ? 'Editar Liga' : 'Crear Nueva Liga'}</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="league-form">
        <div className="form-group">
          <label htmlFor="name">Nombre de la Liga *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Liga de Amigos"
            maxLength="255"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe tu liga..."
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Tipo de Liga *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="public">Pública</option>
              <option value="private">Privada</option>
              <option value="invited">Solo por Invitación</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
              <option value="finished">Finalizada</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="entry_fee">Cuota de Entrada ($)</label>
            <input
              type="number"
              id="entry_fee"
              name="entry_fee"
              value={formData.entry_fee}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="max_members">Máximo de Miembros *</label>
            <input
              type="number"
              id="max_members"
              name="max_members"
              value={formData.max_members}
              onChange={handleChange}
              min="2"
              max="500"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {league ? 'Actualizar Liga' : 'Crear Liga'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
