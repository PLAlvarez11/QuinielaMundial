import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroupCountry } from '../../api/catalogoApi';
import GroupCountryForm from '../../components/catalogo/GroupCountryForm';
import Toast from '../../components/Toast';
import './GroupCountryCreate.css';

export default function GroupCountryCreate() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createGroupCountry(formData);
      setToast({
        type: 'success',
        message: 'Asignación creada correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/group-countries');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al crear la asignación',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-country-create-container">
      <div className="create-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/group-countries')}
        >
          ← Volver
        </button>
        <h1>Nueva Asignación de País a Grupo</h1>
      </div>

      <GroupCountryForm onSubmit={handleSubmit} loading={loading} />

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
