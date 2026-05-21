import { useState } from 'react';
import './TournamentStageForm.css';

export default function TournamentStageForm({ onSubmit, loading, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      order: '',
    }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order' ? value : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.order) newErrors.order = 'El orden es requerido';
    else if (parseInt(formData.order) <= 0) newErrors.order = 'El orden debe ser mayor a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        order: parseInt(formData.order),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tournament-stage-form">
      <div className="form-group">
        <label htmlFor="name">Nombre de la Fase</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Fase de Grupos"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="order">Orden</label>
        <input
          type="number"
          id="order"
          name="order"
          value={formData.order}
          onChange={handleChange}
          placeholder="Ej: 1"
          className={`form-control ${errors.order ? 'is-invalid' : ''}`}
        />
        {errors.order && <span className="error-message">{errors.order}</span>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
