import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';

/**
 * Hook para obtener y gestionar datos de la tabla de posiciones
 * @param {string|number} leagueId - ID de la liga
 * @returns {Object} - { standings, loading, error, reload }
 */
export function useStandings(leagueId) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStandings = async () => {
    if (!leagueId) {
      console.warn('useStandings: No leagueId provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching standings...');
      const response = await axiosInstance.get('/api/tabla-posiciones/standings/');
      
      console.log('Standings response:', response.data);
      const data = response.data?.standings || [];
      setStandings(data);
    } catch (err) {
      console.error('Error fetching standings:', err);
      const errorMsg = err?.response?.data?.detail || err?.message || 'Error al cargar la tabla de posiciones';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, [leagueId]);

  return {
    standings,
    loading,
    error,
    reload: fetchStandings,
  };
}
