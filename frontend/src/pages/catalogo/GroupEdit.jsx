import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGroupById, updateGroup } from '../../api/catalogoApi';
import GroupForm from '../../components/catalogo/GroupForm';
import Toast from '../../components/Toast';
import './GroupEdit.css';

export default function GroupEdit() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const response = await getGroupById(id);
      setGroup(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar el grupo',
      });
      setTimeout(() => {
        navigate('/catalogo/groups');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateGroup(id, formData);
      setToast({
        type: 'success',
        message: 'Grupo actualizado correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/groups');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al actualizar el grupo',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  return (
    <div className="group-edit-container">
      <div className="edit-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/groups')}
        >
          ← Volver
        </button>
        <h1>Editar Grupo</h1>
      </div>

      {group && (
        <GroupForm onSubmit={handleSubmit} loading={isSubmitting} initialData={group} />
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
