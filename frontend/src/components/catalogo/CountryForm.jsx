import { useState } from 'react';
import './CountryForm.css';

export default function CountryForm({ onSubmit, loading, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      code: '',
      flag_url: '',
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
    if (!formData.code.trim()) newErrors.code = 'El código es requerido';
    if (formData.code.trim().length > 5) newErrors.code = 'El código no puede exceder 5 caracteres';
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
    <form onSubmit={handleSubmit} className="country-form">
      <div className="form-group">
        <label htmlFor="name">Nombre del País</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Argentina"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="code">Código</label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Ej: AR"
          className={`form-control ${errors.code ? 'is-invalid' : ''}`}
          maxLength="5"
        />
        {errors.code && <span className="error-message">{errors.code}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="flag_url">URL de la Bandera (Opcional)</label>
        <input
          type="url"
          id="flag_url"
          name="flag_url"
          value={formData.flag_url}
          onChange={handleChange}
          placeholder="Ej: https://..."
          className={`form-control ${errors.flag_url ? 'is-invalid' : ''}`}
        />
        {errors.flag_url && <span className="error-message">{errors.flag_url}</span>}
        {formData.flag_url && (
          <div className="flag-preview">
            <img src={formData.flag_url} alt="flag preview" onError={(e) => e.target.style.display = 'none'} />
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
