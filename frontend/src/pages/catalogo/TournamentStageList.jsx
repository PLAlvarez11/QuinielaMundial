import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTournamentStages, deleteTournamentStage } from '../../api/catalogoApi';
import TournamentStageTable from '../../components/catalogo/TournamentStageTable';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import './TournamentStageList.css';

export default function TournamentStageList() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      setLoading(true);
      const response = await getTournamentStages();
      setStages(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar las fases',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/catalogo/tournament-stages/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTournamentStage(deleteModal.id);
      setStages(stages.filter((s) => s.id !== deleteModal.id));
      setToast({
        type: 'success',
        message: 'Fase eliminada correctamente',
      });
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al eliminar la fase',
      });
    }
  };

  return (
    <div className="tournament-stage-list-container">
      <div className="page-header">
        <h1>Gestión de Fases del Torneo</h1>
        <button
          className="btn-create"
          onClick={() => navigate('/catalogo/tournament-stages/create')}
        >
          + Nueva Fase
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <TournamentStageTable
        stages={stages}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        searchTerm={searchTerm}
      />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar Fase"
        message="¿Estás seguro de que deseas eliminar esta fase?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
