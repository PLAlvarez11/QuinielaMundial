import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMatch } from '../../api/catalogoApi';
import MatchForm from '../../components/catalogo/MatchForm';
import Toast from '../../components/Toast';
import './MatchCreate.css';

export default function MatchCreate() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createMatch(formData);
      setToast({
        type: 'success',
        message: 'Partido creado correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/matches');
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Error al crear el partido';
      setToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="match-create-container">
      <div className="create-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/matches')}
        >
          ← Volver
        </button>
        <h1>Nuevo Partido</h1>
      </div>

      <MatchForm onSubmit={handleSubmit} loading={loading} />

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
