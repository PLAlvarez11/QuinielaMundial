import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGroupCountryById, updateGroupCountry } from '../../api/catalogoApi';
import GroupCountryForm from '../../components/catalogo/GroupCountryForm';
import Toast from '../../components/Toast';
import './GroupCountryEdit.css';

export default function GroupCountryEdit() {
  const { id } = useParams();
  const [groupCountry, setGroupCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroupCountry();
  }, [id]);

  const fetchGroupCountry = async () => {
    try {
      setLoading(true);
      const response = await getGroupCountryById(id);
      setGroupCountry(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar la asignación',
      });
      setTimeout(() => {
        navigate('/catalogo/group-countries');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateGroupCountry(id, formData);
      setToast({
        type: 'success',
        message: 'Asignación actualizada correctamente',
      });
      setTimeout(() => {
        navigate('/catalogo/group-countries');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.detail || 'Error al actualizar la asignación',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  return (
    <div className="group-country-edit-container">
      <div className="edit-header">
        <button
          className="btn-back"
          onClick={() => navigate('/catalogo/group-countries')}
        >
          ← Volver
        </button>
        <h1>Editar Asignación</h1>
      </div>

      {groupCountry && (
        <GroupCountryForm onSubmit={handleSubmit} loading={isSubmitting} initialData={groupCountry} />
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
