import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCountry } from '../../api/catalogoApi';
import CountryForm from '../../components/catalogo/CountryForm';
import Toast from '../../components/Toast';
import './CountryCreate.css';

export default function CountryCreate() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createCountry(formData);
      setToast({
        type: 'success',
        message: 'País creado correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/countries');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al crear el país',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="country-create-container">
      <div className="create-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/countries')}
        >
          ← Volver
        </button>
        <h1>Nuevo País</h1>
      </div>

      <CountryForm onSubmit={handleSubmit} loading={loading} />

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
