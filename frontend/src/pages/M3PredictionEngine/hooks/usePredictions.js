import { useState, useEffect, useCallback } from 'react';
import { getMatches } from '../../../api/catalogoApi';
import {
  getPredictions,
  createPrediction,
  updatePrediction,
  deletePrediction,
} from '../../../api/predictionsApi';

/**
 * Manages the full lifecycle of predictions for a given league:
 * loading matches + existing predictions, creating, updating, and deleting.
 *
 * @param {number|string|null} leagueId
 */
export const usePredictions = (leagueId) => {
  const [matches, setMatches] = useState([]);
  const [predictionByMatch, setPredictionByMatch] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!leagueId) return;
    setLoading(true);
    setError(null);
    try {
      const [matchesRes, predsRes] = await Promise.all([
        getMatches(),
        getPredictions({ league: leagueId }),
      ]);

      const matchList = Array.isArray(matchesRes.data)
        ? matchesRes.data
        : (matchesRes.data?.results ?? []);

      const predList = Array.isArray(predsRes.data)
        ? predsRes.data
        : (predsRes.data?.results ?? []);

      setMatches(matchList);
      setPredictionByMatch(
        predList.reduce((acc, p) => {
          acc[p.match] = p;
          return acc;
        }, {})
      );
    } catch {
      setError('Error al cargar los datos. Por favor, recargá la página.');
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Create or update a prediction for a match.
   * Throws on error so the caller can handle per-card feedback.
   */
  const savePrediction = async (matchId, scores, existingId) => {
    if (existingId) {
      const res = await updatePrediction(existingId, scores);
      setPredictionByMatch((prev) => ({ ...prev, [matchId]: res.data }));
      return res.data;
    } else {
      const res = await createPrediction({ match: matchId, league: leagueId, ...scores });
      setPredictionByMatch((prev) => ({ ...prev, [matchId]: res.data }));
      return res.data;
    }
  };

  /**
   * Delete a prediction.
   * Throws on error so the caller can handle per-card feedback.
   */
  const removePrediction = async (matchId, predictionId) => {
    await deletePrediction(predictionId);
    setPredictionByMatch((prev) => {
      const next = { ...prev };
      delete next[matchId];
      return next;
    });
  };

  return {
    matches,
    predictionByMatch,
    loading,
    error,
    reload: loadData,
    savePrediction,
    removePrediction,
  };
};
