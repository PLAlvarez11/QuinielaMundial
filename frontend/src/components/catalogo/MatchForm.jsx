import { useState, useEffect } from 'react';
import { getCountries, getStadiums, getTournamentStages, getGroups } from '../../api/catalogoApi';
import './MatchForm.css';

const STATUS_CHOICES = [
  { value: 'scheduled', label: 'Programado' },
  { value: 'in_progress', label: 'En curso' },
  { value: 'finished', label: 'Finalizado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export default function MatchForm({ onSubmit, loading, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      home_team: '',
      away_team: '',
      stadium: '',
      stage: '',
      group: '',
      match_date: '',
      home_score: '',
      away_score: '',
      status: 'scheduled',
    }
  );
  const [countries, setCountries] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [stages, setStages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [countriesRes, stadiumsRes, stagesRes, groupsRes] = await Promise.all([
        getCountries(),
        getStadiums(),
        getTournamentStages(),
        getGroups(),
      ]);
      setCountries(countriesRes.data);
      setStadiums(stadiumsRes.data);
      setStages(stagesRes.data);
      setGroups(groupsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'group' || name === 'home_score' || name === 'away_score' ? value : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.home_team) newErrors.home_team = 'El equipo local es requerido';
    if (!formData.away_team) newErrors.away_team = 'El equipo visitante es requerido';
    if (formData.home_team && formData.away_team && formData.home_team === formData.away_team) {
      newErrors.away_team = 'Los equipos no pueden ser iguales';
    }
    if (!formData.stadium) newErrors.stadium = 'El estadio es requerido';
    if (!formData.stage) newErrors.stage = 'La fase es requerida';
    if (!formData.match_date) newErrors.match_date = 'La fecha del partido es requerida';
    if (formData.home_score !== '' && (parseInt(formData.home_score) < 0)) {
      newErrors.home_score = 'El gol local no puede ser negativo';
    }
    if (formData.away_score !== '' && (parseInt(formData.away_score) < 0)) {
      newErrors.away_score = 'El gol visitante no puede ser negativo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        home_score: formData.home_score ? parseInt(formData.home_score) : null,
        away_score: formData.away_score ? parseInt(formData.away_score) : null,
        group: formData.group ? parseInt(formData.group) : null,
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="match-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="home_team">Equipo Local</label>
          <select
            id="home_team"
            name="home_team"
            value={formData.home_team}
            onChange={handleChange}
            className={`form-control ${errors.home_team ? 'is-invalid' : ''}`}
          >
            <option value="">Selecciona un país</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.home_team && <span className="error-message">{errors.home_team}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="away_team">Equipo Visitante</label>
          <select
            id="away_team"
            name="away_team"
            value={formData.away_team}
            onChange={handleChange}
            className={`form-control ${errors.away_team ? 'is-invalid' : ''}`}
          >
            <option value="">Selecciona un país</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.away_team && <span className="error-message">{errors.away_team}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="stadium">Estadio</label>
          <select
            id="stadium"
            name="stadium"
            value={formData.stadium}
            onChange={handleChange}
            className={`form-control ${errors.stadium ? 'is-invalid' : ''}`}
          >
            <option value="">Selecciona un estadio</option>
            {stadiums.map((stadium) => (
              <option key={stadium.id} value={stadium.id}>
                {stadium.name}
              </option>
            ))}
          </select>
          {errors.stadium && <span className="error-message">{errors.stadium}</span>}
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
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="group">Grupo (Opcional)</label>
          <select
            id="group"
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Sin grupo</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                Grupo {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="match_date">Fecha del Partido</label>
          <input
            type="datetime-local"
            id="match_date"
            name="match_date"
            value={formData.match_date}
            onChange={handleChange}
            className={`form-control ${errors.match_date ? 'is-invalid' : ''}`}
          />
          {errors.match_date && <span className="error-message">{errors.match_date}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="home_score">Goles Local</label>
          <input
            type="number"
            id="home_score"
            name="home_score"
            value={formData.home_score}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className={`form-control ${errors.home_score ? 'is-invalid' : ''}`}
          />
          {errors.home_score && <span className="error-message">{errors.home_score}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="away_score">Goles Visitante</label>
          <input
            type="number"
            id="away_score"
            name="away_score"
            value={formData.away_score}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className={`form-control ${errors.away_score ? 'is-invalid' : ''}`}
          />
          {errors.away_score && <span className="error-message">{errors.away_score}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-control"
          >
            {STATUS_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
