import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { getPrizeById, updatePrize } from '../../api/prizesApi';
import PrizeForm from '../../components/PrizeForm';
import Toast from '../../components/Toast';
import Loader from '../../components/Loader';
import { useToast } from '../../hooks/useToast';
import './PrizeForm.css';

/**
 * Página PrizeEdit - Editar premio existente
 */
const PrizeEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [prizeData, setPrizeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del premio
  useEffect(() => {
    const loadPrize = async () => {
      try {
        setLoading(true);
        const data = await getPrizeById(id);
        setPrizeData(data);
      } catch (error) {
        console.error('Error loading prize:', error);
        showError('Error al cargar el premio');
        setTimeout(() => {
          navigate('.');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    loadPrize();
  }, [id, navigate, showError]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updatePrize(id, formData);
      showSuccess('Premio actualizado exitosamente');
      setTimeout(() => {
        navigate('.');
      }, 1500);
    } catch (error) {
      console.error('Error updating prize:', error);
      const errorMessage =
        error?.detail ||
        error?.message ||
        'Error al actualizar el premio';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Cargando premio..." />;
  }

  if (!prizeData) {
    return (
      <div className="error-container">
        <p>No se pudo cargar el premio</p>
      </div>
    );
  }

  return (
    <div className="prize-form-page">
      {/* Header */}
      <div className="form-header">
        <button
          className="btn-back"
          onClick={() => navigate('.')}
          title="Volver"
        >
          <FiArrowLeft size={20} />
          Volver
        </button>
        <div>
          <h1>Editar Premio</h1>
          <p className="header-subtitle">
            Actualiza la información del premio
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="form-container">
        <PrizeForm
          initialData={prizeData}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default PrizeEdit;
