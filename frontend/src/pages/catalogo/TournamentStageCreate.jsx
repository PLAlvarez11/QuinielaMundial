import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTournamentStage } from '../../api/catalogoApi';
import TournamentStageForm from '../../components/catalogo/TournamentStageForm';
import Toast from '../../components/Toast';
import './TournamentStageCreate.css';

export default function TournamentStageCreate() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createTournamentStage(formData);
      setToast({
        type: 'success',
        message: 'Fase creada correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/tournament-stages');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al crear la fase',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tournament-stage-create-container">
      <div className="create-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/tournament-stages')}
        >
          ← Volver
        </button>
        <h1>Nueva Fase</h1>
      </div>

      <TournamentStageForm onSubmit={handleSubmit} loading={loading} />

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
