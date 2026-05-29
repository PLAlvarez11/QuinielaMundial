import { useState, useEffect, useRef } from 'react';
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
  const POLL_MS = 5000; // intervalo de polling para actualizaciones en tiempo real
  const isFetchingRef = useRef(false);

  const fetchMatches = async () => {
    if (!leagueId) {
      console.warn('useMatches: No leagueId provided');
      return;
    }

    // Evitar solapamiento de peticiones
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching matches...');
      const response = await axiosInstance.get('/tabla-posiciones/matches/');
      
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
      isFetchingRef.current = false;
    }
  };
  useEffect(() => {
    let timeoutId = null;
    let cancelled = false;

    if (!leagueId) {
      console.warn('useMatches: No leagueId provided');
      return undefined;
    }

    const poll = async () => {
      if (cancelled) return;
      await fetchMatches();
      if (cancelled) return;
      timeoutId = setTimeout(poll, POLL_MS);
    };

    poll();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [leagueId]);

  return {
    matches,
    loading,
    error,
    reload: fetchMatches,
  };
}
