import axiosInstance from './axiosConfig';

// ==================== PREDICTIONS ====================

/**
 * List predictions. Optional query params: match, league
 */
export const getPredictions = (params = {}) =>
  axiosInstance.get('/predictions/', { params });

/**
 * Create a new prediction.
 * Body: { match, league, predicted_home_score, predicted_away_score }
 */
export const createPrediction = (data) =>
  axiosInstance.post('/predictions/', data);

/**
 * Partially update a prediction (PATCH).
 * Body: { predicted_home_score, predicted_away_score }
 */
export const updatePrediction = (id, data) =>
  axiosInstance.patch(`/predictions/${id}/`, data);

/**
 * Delete a prediction by ID.
 */
export const deletePrediction = (id) =>
  axiosInstance.delete(`/predictions/${id}/`);

/**
 * Get the scoreboard for a league.
 * GET /api/predictions/scoreboard/?league=<id>
 */
export const getScoreboard = (leagueId) =>
  axiosInstance.get('/predictions/scoreboard/', { params: { league: leagueId } });
