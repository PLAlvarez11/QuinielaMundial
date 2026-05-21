import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMatchById, updateMatch } from '../../api/catalogoApi';
import MatchForm from '../../components/catalogo/MatchForm';
import Toast from '../../components/Toast';
import './MatchEdit.css';

export default function MatchEdit() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const response = await getMatchById(id);
      setMatch(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar el partido',
      });
      setTimeout(() => {
        navigate('/catalogo/matches');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateMatch(id, formData);
      setToast({
        type: 'success',
        message: 'Partido actualizado correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/matches');
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Error al actualizar el partido';
      setToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  return (
    <div className="match-edit-container">
      <div className="edit-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/matches')}
        >
          ← Volver
        </button>
        <h1>Editar Partido</h1>
      </div>

      {match && (
        <MatchForm onSubmit={handleSubmit} loading={isSubmitting} initialData={match} />
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
