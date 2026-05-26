import axios from 'axios';

const API_BASE_URL = `${window.location.origin}/api/catalogo`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar token de autenticación si existe
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== VENUES ====================
export const getVenues = () => axiosInstance.get('/venues/');
export const getVenueById = (id) => axiosInstance.get(`/venues/${id}/`);
export const createVenue = (data) => axiosInstance.post('/venues/', data);
export const updateVenue = (id, data) => axiosInstance.put(`/venues/${id}/`, data);
export const deleteVenue = (id) => axiosInstance.delete(`/venues/${id}/`);

// ==================== STADIUMS ====================
export const getStadiums = () => axiosInstance.get('/stadiums/');
export const getStadiumById = (id) => axiosInstance.get(`/stadiums/${id}/`);
export const createStadium = (data) => axiosInstance.post('/stadiums/', data);
export const updateStadium = (id, data) => axiosInstance.put(`/stadiums/${id}/`, data);
export const deleteStadium = (id) => axiosInstance.delete(`/stadiums/${id}/`);

// ==================== COUNTRIES ====================
export const getCountries = () => axiosInstance.get('/countries/');
export const getCountryById = (id) => axiosInstance.get(`/countries/${id}/`);
export const createCountry = (data) => axiosInstance.post('/countries/', data);
export const updateCountry = (id, data) => axiosInstance.put(`/countries/${id}/`, data);
export const deleteCountry = (id) => axiosInstance.delete(`/countries/${id}/`);

// ==================== TOURNAMENT STAGES ====================
export const getTournamentStages = () => axiosInstance.get('/tournament-stages/');
export const getTournamentStageById = (id) => axiosInstance.get(`/tournament-stages/${id}/`);
export const createTournamentStage = (data) => axiosInstance.post('/tournament-stages/', data);
export const updateTournamentStage = (id, data) => axiosInstance.put(`/tournament-stages/${id}/`, data);
export const deleteTournamentStage = (id) => axiosInstance.delete(`/tournament-stages/${id}/`);

// ==================== GROUPS ====================
export const getGroups = () => axiosInstance.get('/groups/');
export const getGroupById = (id) => axiosInstance.get(`/groups/${id}/`);
export const createGroup = (data) => axiosInstance.post('/groups/', data);
export const updateGroup = (id, data) => axiosInstance.put(`/groups/${id}/`, data);
export const deleteGroup = (id) => axiosInstance.delete(`/groups/${id}/`);

// ==================== GROUP COUNTRIES ====================
export const getGroupCountries = () => axiosInstance.get('/group-countries/');
export const getGroupCountryById = (id) => axiosInstance.get(`/group-countries/${id}/`);
export const createGroupCountry = (data) => axiosInstance.post('/group-countries/', data);
export const updateGroupCountry = (id, data) => axiosInstance.put(`/group-countries/${id}/`, data);
export const deleteGroupCountry = (id) => axiosInstance.delete(`/group-countries/${id}/`);

// ==================== MATCHES ====================
export const getMatches = () => axiosInstance.get('/matches/');
export const getMatchById = (id) => axiosInstance.get(`/matches/${id}/`);
export const createMatch = (data) => axiosInstance.post('/matches/', data);
export const updateMatch = (id, data) => axiosInstance.put(`/matches/${id}/`, data);
export const deleteMatch = (id) => axiosInstance.delete(`/matches/${id}/`);

export default axiosInstance;
