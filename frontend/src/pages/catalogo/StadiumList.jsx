import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStadiums, deleteStadium } from '../../api/catalogoApi';
import StadiumTable from '../../components/catalogo/StadiumTable';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import './StadiumList.css';

export default function StadiumList() {
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStadiums();
  }, []);

  const fetchStadiums = async () => {
    try {
      setLoading(true);
      const response = await getStadiums();
      setStadiums(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar los estadios',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/catalogo/stadiums/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteStadium(deleteModal.id);
      setStadiums(stadiums.filter((s) => s.id !== deleteModal.id));
      setToast({
        type: 'success',
        message: 'Estadio eliminado correctamente',
      });
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al eliminar el estadio',
      });
    }
  };

  return (
    <div className="stadium-list-container">
      <div className="page-header">
        <h1>Gestión de Estadios</h1>
        <button
          className="btn-create"
          onClick={() => navigate('/catalogo/stadiums/create')}
        >
          + Nuevo Estadio
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre o sede..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <StadiumTable
        stadiums={stadiums}
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
        title="Eliminar Estadio"
        message="¿Estás seguro de que deseas eliminar este estadio?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
