import { useState, useEffect } from 'react';
import { getGroups, getCountries } from '../../api/catalogoApi';
import './GroupCountryForm.css';

export default function GroupCountryForm({ onSubmit, loading, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      group: '',
      country: '',
    }
  );
  const [groups, setGroups] = useState([]);
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [groupsRes, countriesRes] = await Promise.all([
        getGroups(),
        getCountries(),
      ]);
      setGroups(groupsRes.data);
      setCountries(countriesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
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
    if (!formData.group) newErrors.group = 'El grupo es requerido';
    if (!formData.country) newErrors.country = 'El país es requerido';
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
    <form onSubmit={handleSubmit} className="group-country-form">
      <div className="form-group">
        <label htmlFor="group">Grupo</label>
        <select
          id="group"
          name="group"
          value={formData.group}
          onChange={handleChange}
          className={`form-control ${errors.group ? 'is-invalid' : ''}`}
        >
          <option value="">Selecciona un grupo</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              Grupo {group.name}
            </option>
          ))}
        </select>
        {errors.group && <span className="error-message">{errors.group}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="country">País</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className={`form-control ${errors.country ? 'is-invalid' : ''}`}
        >
          <option value="">Selecciona un país</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name} ({country.code})
            </option>
          ))}
        </select>
        {errors.country && <span className="error-message">{errors.country}</span>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
