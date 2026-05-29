import { useState, useEffect, useRef } from 'react';
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
  const POLL_MS = 5000; // intervalo de polling para actualizaciones en tiempo real
  const isFetchingRef = useRef(false);

  const fetchStandings = async () => {
    if (!leagueId) {
      console.warn('useStandings: No leagueId provided');
      return;
    }

    // Evitar solapamiento de peticiones
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching standings...');
      const response = await axiosInstance.get('/tabla-posiciones/standings/');
      
      console.log('Standings response:', response.data);
      const data = response.data?.standings || [];
      setStandings(data);
    } catch (err) {
      console.error('Error fetching standings:', err);
      const errorMsg = err?.response?.data?.detail || err?.message || 'Error al cargar la tabla de posiciones';
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
      console.warn('useStandings: No leagueId provided');
      return undefined;
    }

    // Polling seguro: esperar a que termine la petición antes de programar la siguiente
    const poll = async () => {
      if (cancelled) return;
      await fetchStandings();
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
    standings,
    loading,
    error,
    reload: fetchStandings,
  };
}
