import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getVenueById, updateVenue } from '../../api/catalogoApi';
import VenueForm from '../../components/catalogo/VenueForm';
import Toast from '../../components/Toast';
import './VenueEdit.css';

export default function VenueEdit() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenue();
  }, [id]);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      const response = await getVenueById(id);
      setVenue(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar la sede',
      });
      setTimeout(() => {
        navigate('/catalogo/venues');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateVenue(id, formData);
      setToast({
        type: 'success',
        message: 'Sede actualizada correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/venues');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al actualizar la sede',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  return (
    <div className="venue-edit-container">
      <div className="edit-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/venues')}
        >
          ← Volver
        </button>
        <h1>Editar Sede</h1>
      </div>

      {venue && (
        <VenueForm onSubmit={handleSubmit} loading={isSubmitting} initialData={venue} />
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
