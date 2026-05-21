import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroups, deleteGroup } from '../../api/catalogoApi';
import GroupTable from '../../components/catalogo/GroupTable';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import './GroupList.css';

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await getGroups();
      setGroups(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar los grupos',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/catalogo/groups/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteGroup(deleteModal.id);
      setGroups(groups.filter((g) => g.id !== deleteModal.id));
      setToast({
        type: 'success',
        message: 'Grupo eliminado correctamente',
      });
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al eliminar el grupo',
      });
    }
  };

  return (
    <div className="group-list-container">
      <div className="page-header">
        <h1>Gestión de Grupos</h1>
        <button
          className="btn-create"
          onClick={() => navigate('/catalogo/groups/create')}
        >
          + Nuevo Grupo
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre o fase..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <GroupTable
        groups={groups}
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
        title="Eliminar Grupo"
        message="¿Estás seguro de que deseas eliminar este grupo?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
