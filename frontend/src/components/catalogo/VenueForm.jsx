import { useState } from 'react';
import './VenueForm.css';

export default function VenueForm({ onSubmit, loading, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      city: '',
      country: '',
    }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!formData.country.trim()) newErrors.country = 'El país es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="venue-form">
      <div className="form-group">
        <label htmlFor="name">Nombre de la Sede</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Estadio Azteca"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="city">Ciudad</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Ej: México"
          className={`form-control ${errors.city ? 'is-invalid' : ''}`}
        />
        {errors.city && <span className="error-message">{errors.city}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="country">País</label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Ej: México"
          className={`form-control ${errors.country ? 'is-invalid' : ''}`}
        />
        {errors.country && <span className="error-message">{errors.country}</span>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
