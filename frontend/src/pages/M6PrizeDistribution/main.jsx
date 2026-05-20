import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrizeList from './PrizeList';
import PrizeCreate from './PrizeCreate';
import PrizeEdit from './PrizeEdit';

/**
 * M6PrizeDistributionMain - Componente principal del módulo
 * Maneja todas las rutas del módulo de distribución de premios
 */
export default function M6PrizeDistributionMain() {
  return (
    <Routes>
      <Route path="/" element={<PrizeList />} />
      <Route path="/create" element={<PrizeCreate />} />
      <Route path="/edit/:id" element={<PrizeEdit />} />
    </Routes>
  );
}
