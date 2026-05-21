import { useState, useEffect } from 'react';
import { getVenues } from '../../api/catalogoApi';
import './StadiumForm.css';

export default function StadiumForm({ onSubmit, loading, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      venue: '',
      capacity: '',
    }
  );
  const [venues, setVenues] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await getVenues();
      setVenues(response.data);
    } catch (error) {
      console.error('Error loading venues:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? value : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.venue) newErrors.venue = 'La sede es requerida';
    if (!formData.capacity) newErrors.capacity = 'La capacidad es requerida';
    else if (parseInt(formData.capacity) <= 0) newErrors.capacity = 'La capacidad debe ser mayor a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        capacity: parseInt(formData.capacity),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stadium-form">
      <div className="form-group">
        <label htmlFor="name">Nombre del Estadio</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Maracaná"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="venue">Sede</label>
        <select
          id="venue"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          className={`form-control ${errors.venue ? 'is-invalid' : ''}`}
        >
          <option value="">Selecciona una sede</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name} ({venue.city})
            </option>
          ))}
        </select>
        {errors.venue && <span className="error-message">{errors.venue}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="capacity">Capacidad</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Ej: 70000"
          className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
        />
        {errors.capacity && <span className="error-message">{errors.capacity}</span>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
