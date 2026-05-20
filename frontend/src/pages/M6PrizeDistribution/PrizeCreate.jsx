import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { createPrize } from '../../api/prizesApi';
import PrizeForm from '../../components/PrizeForm';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import './PrizeForm.css';

/**
 * Página PrizeCreate - Crear nuevo premio
 */
const PrizeCreate = () => {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      await createPrize(formData);
      showSuccess('Premio creado exitosamente');
      setTimeout(() => {
        navigate('/prizes');
      }, 1500);
    } catch (error) {
      console.error('Error creating prize:', error);
      const errorMessage =
        error?.detail ||
        error?.message ||
        'Error al crear el premio';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prize-form-page">
      {/* Header */}
      <div className="form-header">
        <button
          className="btn-back"
          onClick={() => navigate('/prizes')}
          title="Volver"
        >
          <FiArrowLeft size={20} />
          Volver
        </button>
        <div>
          <h1>Crear Nuevo Premio</h1>
          <p className="header-subtitle">
            Completa el formulario para agregar un nuevo premio
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="form-container">
        <PrizeForm onSubmit={handleSubmit} isLoading={isLoading} />
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

export default PrizeCreate;
