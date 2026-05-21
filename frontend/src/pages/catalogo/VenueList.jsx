import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVenues, deleteVenue } from '../../api/catalogoApi';
import VenueTable from '../../components/catalogo/VenueTable';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import './VenueList.css';

export default function VenueList() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await getVenues();
      setVenues(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar las sedes',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/catalogo/venues/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteVenue(deleteModal.id);
      setVenues(venues.filter((v) => v.id !== deleteModal.id));
      setToast({
        type: 'success',
        message: 'Sede eliminada correctamente',
      });
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al eliminar la sede',
      });
    }
  };

  return (
    <div className="venue-list-container">
      <div className="page-header">
        <h1>Gestión de Sedes</h1>
        <button
          className="btn-create"
          onClick={() => navigate('/catalogo/venues/create')}
        >
          + Nueva Sede
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre, ciudad o país..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <VenueTable
        venues={venues}
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
        title="Eliminar Sede"
        message="¿Estás seguro de que deseas eliminar esta sede?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
