import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';

/**
 * Hook para obtener y gestionar datos de partidos
 * @param {string|number} leagueId - ID de la liga
 * @returns {Object} - { matches, loading, error, reload }
 */
export function useMatches(leagueId) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    if (!leagueId) {
      console.warn('useMatches: No leagueId provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching matches...');
      const response = await axiosInstance.get('/api/tabla-posiciones/matches/');
      
      console.log('Matches response:', response.data);
      const data = response.data?.matches || [];
      // Ordenar por fecha de partido
      const sorted = data.sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
      setMatches(sorted);
    } catch (err) {
      console.error('Error fetching matches:', err);
      const errorMsg = err?.response?.data?.detail || err?.message || 'Error al cargar los partidos';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [leagueId]);

  return {
    matches,
    loading,
    error,
    reload: fetchMatches,
  };
}
