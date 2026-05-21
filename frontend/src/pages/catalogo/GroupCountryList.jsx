import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroupCountries, deleteGroupCountry } from '../../api/catalogoApi';
import GroupCountryTable from '../../components/catalogo/GroupCountryTable';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import './GroupCountryList.css';

export default function GroupCountryList() {
  const [groupCountries, setGroupCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroupCountries();
  }, []);

  const fetchGroupCountries = async () => {
    try {
      setLoading(true);
      const response = await getGroupCountries();
      setGroupCountries(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar las asignaciones',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/catalogo/group-countries/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteGroupCountry(deleteModal.id);
      setGroupCountries(groupCountries.filter((gc) => gc.id !== deleteModal.id));
      setToast({
        type: 'success',
        message: 'Asignación eliminada correctamente',
      });
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al eliminar la asignación',
      });
    }
  };

  return (
    <div className="group-country-list-container">
      <div className="page-header">
        <h1>Gestión de Países por Grupo</h1>
        <button
          className="btn-create"
          onClick={() => navigate('/catalogo/group-countries/create')}
        >
          + Nueva Asignación
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por grupo o país..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <GroupCountryTable
        groupCountries={groupCountries}
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
        title="Eliminar Asignación"
        message="¿Estás seguro de que deseas eliminar esta asignación?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
