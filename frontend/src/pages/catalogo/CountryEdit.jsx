import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCountryById, updateCountry } from '../../api/catalogoApi';
import CountryForm from '../../components/catalogo/CountryForm';
import Toast from '../../components/Toast';
import './CountryEdit.css';

export default function CountryEdit() {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountry();
  }, [id]);

  const fetchCountry = async () => {
    try {
      setLoading(true);
      const response = await getCountryById(id);
      setCountry(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar el país',
      });
      setTimeout(() => {
        navigate('/catalogo/countries');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateCountry(id, formData);
      setToast({
        type: 'success',
        message: 'País actualizado correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/countries');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al actualizar el país',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  return (
    <div className="country-edit-container">
      <div className="edit-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/countries')}
        >
          ← Volver
        </button>
        <h1>Editar País</h1>
      </div>

      {country && (
        <CountryForm onSubmit={handleSubmit} loading={isSubmitting} initialData={country} />
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
