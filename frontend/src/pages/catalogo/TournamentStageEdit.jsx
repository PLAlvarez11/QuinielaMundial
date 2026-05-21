import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTournamentStageById, updateTournamentStage } from '../../api/catalogoApi';
import TournamentStageForm from '../../components/catalogo/TournamentStageForm';
import Toast from '../../components/Toast';
import './TournamentStageEdit.css';

export default function TournamentStageEdit() {
  const { id } = useParams();
  const [stage, setStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStage();
  }, [id]);

  const fetchStage = async () => {
    try {
      setLoading(true);
      const response = await getTournamentStageById(id);
      setStage(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar la fase',
      });
      setTimeout(() => {
        navigate('/catalogo/tournament-stages');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateTournamentStage(id, formData);
      setToast({
        type: 'success',
        message: 'Fase actualizada correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/tournament-stages');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al actualizar la fase',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  return (
    <div className="tournament-stage-edit-container">
      <div className="edit-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/tournament-stages')}
        >
          ← Volver
        </button>
        <h1>Editar Fase</h1>
      </div>

      {stage && (
        <TournamentStageForm onSubmit={handleSubmit} loading={isSubmitting} initialData={stage} />
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
