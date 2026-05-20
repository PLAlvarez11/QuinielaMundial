import axiosInstance from './axiosConfig';

/**
 * Obtener lista de ligas
 */
export const getLeagues = async () => {
  try {
    const response = await axiosInstance.get('/leagues/');
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error) {
    console.error('Error fetching leagues:', error);
    return [];
  }
};

/**
 * Obtener lista de miembros de ligas
 */
export const getLeagueMembers = async () => {
  try {
    const response = await axiosInstance.get('/league-members/');
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error) {
    console.error('Error fetching league members:', error);
    return [];
  }
};

/**
 * Obtener miembros de una liga específica
 */
export const getLeagueMembersByLeague = async (leagueId) => {
  try {
    const response = await axiosInstance.get('/league-members/', {
      params: { league: leagueId },
    });
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error) {
    console.error('Error fetching league members:', error);
    return [];
  }
};
