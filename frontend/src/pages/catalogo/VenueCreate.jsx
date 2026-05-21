import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVenue } from '../../api/catalogoApi';
import VenueForm from '../../components/catalogo/VenueForm';
import Toast from '../../components/Toast';
import './VenueCreate.css';

export default function VenueCreate() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createVenue(formData);
      setToast({
        type: 'success',
        message: 'Sede creada correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/venues');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al crear la sede',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="venue-create-container">
      <div className="create-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/venues')}
        >
          ← Volver
        </button>
        <h1>Nueva Sede</h1>
      </div>

      <VenueForm onSubmit={handleSubmit} loading={loading} />

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
