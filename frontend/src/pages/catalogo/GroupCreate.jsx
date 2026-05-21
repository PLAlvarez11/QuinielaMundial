import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../api/catalogoApi';
import GroupForm from '../../components/catalogo/GroupForm';
import Toast from '../../components/Toast';
import './GroupCreate.css';

export default function GroupCreate() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createGroup(formData);
      setToast({
        type: 'success',
        message: 'Grupo creado correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/groups');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al crear el grupo',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-create-container">
      <div className="create-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/groups')}
        >
          ← Volver
        </button>
        <h1>Nuevo Grupo</h1>
      </div>

      <GroupForm onSubmit={handleSubmit} loading={loading} />

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
