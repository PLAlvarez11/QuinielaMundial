import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatches, deleteMatch } from '../../api/catalogoApi';
import MatchTable from '../../components/catalogo/MatchTable';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import './MatchList.css';

export default function MatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await getMatches();
      setMatches(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar los partidos',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/catalogo/matches/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMatch(deleteModal.id);
      setMatches(matches.filter((m) => m.id !== deleteModal.id));
      setToast({
        type: 'success',
        message: 'Partido eliminado correctamente',
      });
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al eliminar el partido',
      });
    }
  };

  return (
    <div className="match-list-container">
      <div className="page-header">
        <h1>Gestión de Partidos</h1>
        <button
          className="btn-create"
          onClick={() => navigate('/catalogo/matches/create')}
        >
          + Nuevo Partido
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por equipos o estadio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <MatchTable
        matches={matches}
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
        title="Eliminar Partido"
        message="¿Estás seguro de que deseas eliminar este partido?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
