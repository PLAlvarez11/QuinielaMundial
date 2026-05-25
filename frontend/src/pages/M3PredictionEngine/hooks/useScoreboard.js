import { useState, useEffect, useCallback } from 'react';
import { getScoreboard } from '../../../api/predictionsApi';

/**
 * Fetches and manages the scoreboard for a given league.
 *
 * @param {number|string|null} leagueId
 */
export const useScoreboard = (leagueId) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadScoreboard = useCallback(async () => {
    if (!leagueId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getScoreboard(leagueId);
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data?.results ?? []);
      setRows(data);
    } catch {
      setError('Error al cargar la tabla de posiciones.');
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    loadScoreboard();
  }, [loadScoreboard]);

  return { rows, loading, error, reload: loadScoreboard };
};
