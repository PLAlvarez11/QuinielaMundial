import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStadium } from '../../api/catalogoApi';
import StadiumForm from '../../components/catalogo/StadiumForm';
import Toast from '../../components/Toast';
import './StadiumCreate.css';

export default function StadiumCreate() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createStadium(formData);
      setToast({
        type: 'success',
        message: 'Estadio creado correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/stadiums');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al crear el estadio',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stadium-create-container">
      <div className="create-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/stadiums')}
        >
          ← Volver
        </button>
        <h1>Nuevo Estadio</h1>
      </div>

      <StadiumForm onSubmit={handleSubmit} loading={loading} />

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
