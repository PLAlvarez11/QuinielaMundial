import React from 'react';
import './Loader.css';

/**
 * Componente Loader - Muestra un spinner de carga
 */
const Loader = ({ message = 'Cargando...' }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loader;
