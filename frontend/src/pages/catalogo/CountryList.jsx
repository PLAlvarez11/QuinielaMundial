import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCountries, deleteCountry } from '../../api/catalogoApi';
import CountryTable from '../../components/catalogo/CountryTable';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';
import './CountryList.css';

export default function CountryList() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await getCountries();
      setCountries(response.data);
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al cargar los países',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/catalogo/countries/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCountry(deleteModal.id);
      setCountries(countries.filter((c) => c.id !== deleteModal.id));
      setToast({
        type: 'success',
        message: 'País eliminado correctamente',
      });
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Error al eliminar el país',
      });
    }
  };

  return (
    <div className="country-list-container">
      <div className="page-header">
        <h1>Gestión de Países</h1>
        <button
          className="btn-create"
          onClick={() => navigate('/catalogo/countries/create')}
        >
          + Nuevo País
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <CountryTable
        countries={countries}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        searchTerm={searchTerm}
      />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar País"
        message="¿Estás seguro de que deseas eliminar este país?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
