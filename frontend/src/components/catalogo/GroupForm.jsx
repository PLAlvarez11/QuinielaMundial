import { useState, useEffect } from 'react';
import { getTournamentStages } from '../../api/catalogoApi';
import './GroupForm.css';

export default function GroupForm({ onSubmit, loading, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      stage: '',
    }
  );
  const [stages, setStages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      const response = await getTournamentStages();
      setStages(response.data);
    } catch (error) {
      console.error('Error loading stages:', error);
    }
  };

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
    if (!formData.stage) newErrors.stage = 'La fase es requerida';
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
    <form onSubmit={handleSubmit} className="group-form">
      <div className="form-group">
        <label htmlFor="name">Nombre del Grupo</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: A"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="stage">Fase</label>
        <select
          id="stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          className={`form-control ${errors.stage ? 'is-invalid' : ''}`}
        >
          <option value="">Selecciona una fase</option>
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.name}
            </option>
          ))}
        </select>
        {errors.stage && <span className="error-message">{errors.stage}</span>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
