import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import {
  getPrizes,
  deletePrize,
} from '../../api/prizesApi';
import PrizeTable from '../../components/PrizeTable';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import Loader from '../../components/Loader';
import { useToast } from '../../hooks/useToast';
import './PrizeList.css';

/**
 * Página PrizeList - Listado de premios
 */
const PrizeList = () => {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    prizeId: null,
  });

  // Cargar premios
  const loadPrizes = async () => {
    try {
      setLoading(true);
      const data = await getPrizes();
      setPrizes(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error loading prizes:', error);
      showError('Error al cargar los premios');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadPrizes();
  }, []);

  // Filtrar premios
  const filteredPrizes = prizes.filter((prize) => {
    const matchSearch =
      !searchTerm ||
      (prize.league_name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (prize.member_name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchType = !filterType || prize.type === filterType;
    const matchPosition =
      !filterPosition || prize.position === filterPosition;

    return matchSearch && matchType && matchPosition;
  });

  // Manejar edición
  const handleEdit = (prizeId) => {
    navigate(`edit/${prizeId}`);
  };

  // Manejar eliminación
  const handleDeleteClick = (prizeId) => {
    setConfirmDelete({ isOpen: true, prizeId });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.prizeId) return;

    try {
      setDeleting(true);
      await deletePrize(confirmDelete.prizeId);
      showSuccess('Premio eliminado exitosamente');
      setConfirmDelete({ isOpen: false, prizeId: null });
      loadPrizes();
    } catch (error) {
      console.error('Error deleting prize:', error);
      showError(
        error?.detail ||
        'Error al eliminar el premio'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ isOpen: false, prizeId: null });
  };

  if (loading) {
    return <Loader message="Cargando premios..." />;
  }

  return (
    <div className="prize-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Premios</h1>
          <p className="header-subtitle">
            Administra los premios y distribuciones por liga
          </p>
        </div>
        <button
          className="btn btn-new"
          onClick={() => navigate('create')}
        >
          <FiPlus size={18} />
          Nuevo Premio
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <div className="search-box">
            <FiSearch size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por liga o miembro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los tipos</option>
            <option value="league">Liga</option>
            <option value="global">Global</option>
            <option value="tie">Empate</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las posiciones</option>
            <option value="first">Primer lugar</option>
            <option value="second">Segundo lugar</option>
            <option value="third">Tercer lugar</option>
            <option value="last">Último lugar</option>
            <option value="global_individual">Global Individual</option>
            <option value="global_league">Global por Liga</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-section">
        <PrizeTable
          prizes={filteredPrizes}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          isLoading={deleting}
        />
      </div>

      {/* Stats */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-value">{prizes.length}</div>
          <div className="stat-label">Total de Premios</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{filteredPrizes.length}</div>
          <div className="stat-label">Mostrando</div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Eliminar Premio"
        message="¿Estás seguro que deseas eliminar este premio? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default PrizeList;
