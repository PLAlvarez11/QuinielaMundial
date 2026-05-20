import React, { useEffect, useState } from 'react';
import { getLeagues, getLeagueMembersByLeague } from '../api/leaguesApi';
import Loader from './Loader';
import './PrizeForm.css';

/**
 * Componente PrizeForm - Formulario para crear/editar premios
 */
const PrizeForm = ({ initialData = null, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    league: '',
    member: '',
    position: '',
    amount: '',
    type: 'league',
  });

  const [leagues, setLeagues] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  // Opciones de posición y tipo
  const positionChoices = [
    { value: 'first', label: 'Primer lugar' },
    { value: 'second', label: 'Segundo lugar' },
    { value: 'third', label: 'Tercer lugar' },
    { value: 'last', label: 'Último lugar' },
    { value: 'global_individual', label: 'Premio global individual' },
    { value: 'global_league', label: 'Premio global por liga' },
  ];

  const typeChoices = [
    { value: 'league', label: 'Premio de liga' },
    { value: 'global', label: 'Premio global' },
    { value: 'tie', label: 'Premio por empate' },
  ];

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const leaguesData = await getLeagues();
        setLeagues(leaguesData);

        if (initialData) {
          setFormData({
            league: initialData.league,
            member: initialData.member,
            position: initialData.position,
            amount: initialData.amount,
            type: initialData.type,
          });

          // Cargar miembros de la liga seleccionada
          if (initialData.league) {
            const membersData = await getLeagueMembersByLeague(initialData.league);
            setMembers(membersData);
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, [initialData]);

  // Cargar miembros cuando cambia la liga
  const handleLeagueChange = async (e) => {
    const leagueId = e.target.value;
    setFormData({
      ...formData,
      league: leagueId,
      member: '', // Limpiar miembro seleccionado
    });

    if (leagueId) {
      try {
        const membersData = await getLeagueMembersByLeague(leagueId);
        setMembers(membersData);
      } catch (error) {
        console.error('Error loading members:', error);
        setMembers([]);
      }
    } else {
      setMembers([]);
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.league) {
      newErrors.league = 'La liga es requerida';
    }
    if (!formData.member) {
      newErrors.member = 'El miembro es requerido';
    }
    if (!formData.position) {
      newErrors.position = 'La posición es requerida';
    }
    if (!formData.amount) {
      newErrors.amount = 'El monto es requerido';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }
    if (!formData.type) {
      newErrors.type = 'El tipo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (loadingData) {
    return <Loader message="Cargando datos..." />;
  }

  return (
    <form className="prize-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* Liga */}
        <div className="form-group">
          <label htmlFor="league" className="form-label">
            Liga *
          </label>
          <select
            id="league"
            className={`form-control ${errors.league ? 'is-invalid' : ''}`}
            value={formData.league}
            onChange={handleLeagueChange}
            disabled={isLoading}
          >
            <option value="">Selecciona una liga</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name || league.title}
              </option>
            ))}
          </select>
          {errors.league && <span className="error-message">{errors.league}</span>}
        </div>

        {/* Miembro */}
        <div className="form-group">
          <label htmlFor="member" className="form-label">
            Miembro *
          </label>
          <select
            id="member"
            className={`form-control ${errors.member ? 'is-invalid' : ''}`}
            value={formData.member}
            onChange={(e) => setFormData({ ...formData, member: e.target.value })}
            disabled={isLoading || !formData.league}
          >
            <option value="">
              {formData.league ? 'Selecciona un miembro' : 'Primero selecciona una liga'}
            </option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.user?.username || member.user?.email || member.name}
              </option>
            ))}
          </select>
          {errors.member && <span className="error-message">{errors.member}</span>}
        </div>

        {/* Posición */}
        <div className="form-group">
          <label htmlFor="position" className="form-label">
            Posición *
          </label>
          <select
            id="position"
            className={`form-control ${errors.position ? 'is-invalid' : ''}`}
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            disabled={isLoading}
          >
            <option value="">Selecciona una posición</option>
            {positionChoices.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
          {errors.position && <span className="error-message">{errors.position}</span>}
        </div>

        {/* Monto */}
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Monto ($) *
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            disabled={isLoading}
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        {/* Tipo */}
        <div className="form-group">
          <label htmlFor="type" className="form-label">
            Tipo *
          </label>
          <select
            id="type"
            className={`form-control ${errors.type ? 'is-invalid' : ''}`}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            disabled={isLoading}
          >
            {typeChoices.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>
      </div>

      {/* Botón enviar */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default PrizeForm;
