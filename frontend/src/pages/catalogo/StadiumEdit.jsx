import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStadiumById, updateStadium } from '../../api/catalogoApi';
import StadiumForm from '../../components/catalogo/StadiumForm';
import Toast from '../../components/Toast';
import './StadiumEdit.css';

export default function StadiumEdit() {
  const { id } = useParams();
  const [stadium, setStadium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStadium();
  }, [id]);

  const fetchStadium = async () => {
    try {
      setLoading(true);
      const response = await getStadiumById(id);
      setStadium(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar el estadio',
      });
      setTimeout(() => {
        navigate('/catalogo/stadiums');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateStadium(id, formData);
      setToast({
        type: 'success',
        message: 'Estadio actualizado correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/stadiums');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al actualizar el estadio',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  return (
    <div className="stadium-edit-container">
      <div className="edit-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/stadiums')}
        >
          ← Volver
        </button>
        <h1>Editar Estadio</h1>
      </div>

      {stadium && (
        <StadiumForm onSubmit={handleSubmit} loading={isSubmitting} initialData={stadium} />
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
