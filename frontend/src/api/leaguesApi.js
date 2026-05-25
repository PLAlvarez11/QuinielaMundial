import axiosInstance from './axiosConfig';

/**
 * LEAGUES - Obtener lista de ligas
 */
export const getLeagues = async () => {
  try {
    const response = await axiosInstance.get('/leagues/leagues/');
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error) {
    console.error('Error fetching leagues:', error);
    throw error;
  }
};

/**
 * LEAGUES - Obtener detalle de una liga
 */
export const getLeagueDetail = async (leagueId) => {
  try {
    const response = await axiosInstance.get(`/leagues/leagues/${leagueId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching league ${leagueId}:`, error);
    throw error;
  }
};

/**
 * LEAGUES - Crear nueva liga
 */
export const createLeague = async (leagueData) => {
  try {
    const response = await axiosInstance.post('/leagues/leagues/', leagueData);
    return response.data;
  } catch (error) {
    console.error('Error creating league:', error);
    throw error;
  }
};

/**
 * LEAGUES - Actualizar liga
 */
export const updateLeague = async (leagueId, leagueData) => {
  try {
    const response = await axiosInstance.patch(`/leagues/leagues/${leagueId}/`, leagueData);
    return response.data;
  } catch (error) {
    console.error(`Error updating league ${leagueId}:`, error);
    throw error;
  }
};

/**
 * LEAGUES - Eliminar liga
 */
export const deleteLeague = async (leagueId) => {
  try {
    await axiosInstance.delete(`/leagues/leagues/${leagueId}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting league ${leagueId}:`, error);
    throw error;
  }
};

/**
 * LEAGUE MEMBERS - Obtener lista de miembros de ligas
 */
export const getLeagueMembers = async () => {
  try {
    const response = await axiosInstance.get('/leagues/members/');
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error) {
    console.error('Error fetching league members:', error);
    throw error;
  }
};

/**
 * LEAGUE MEMBERS - Obtener miembros de una liga específica
 */
export const getLeagueMembersByLeague = async (leagueId) => {
  try {
    const response = await axiosInstance.get('/leagues/members/', {
      params: { league: leagueId },
    });
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error) {
    console.error('Error fetching league members:', error);
    throw error;
  }
};

/**
 * LEAGUE MEMBERS - Obtener detalle de un miembro
 */
export const getLeagueMemberDetail = async (memberId) => {
  try {
    const response = await axiosInstance.get(`/leagues/members/${memberId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching league member ${memberId}:`, error);
    throw error;
  }
};

/**
 * LEAGUE MEMBERS - Agregar miembro a una liga
 */
export const addLeagueMember = async (memberData) => {
  try {
    const response = await axiosInstance.post('/leagues/members/', memberData);
    return response.data;
  } catch (error) {
    console.error('Error adding league member:', error);
    throw error;
  }
};

/**
 * LEAGUE MEMBERS - Actualizar miembro
 */
export const updateLeagueMember = async (memberId, memberData) => {
  try {
    const response = await axiosInstance.patch(`/leagues/members/${memberId}/`, memberData);
    return response.data;
  } catch (error) {
    console.error(`Error updating league member ${memberId}:`, error);
    throw error;
  }
};

/**
 * LEAGUE MEMBERS - Eliminar miembro de liga
 */
export const removeLeagueMember = async (memberId) => {
  try {
    await axiosInstance.delete(`/leagues/members/${memberId}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error removing league member ${memberId}:`, error);
    throw error;
  }
};

/**
 * INVITATIONS - Obtener invitaciones
 */
export const getInvitations = async () => {
  try {
    const response = await axiosInstance.get('/leagues/invitations/');
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error) {
    console.error('Error fetching invitations:', error);
    throw error;
  }
};

/**
 * INVITATIONS - Obtener invitaciones de una liga
 */
export const getLeagueInvitations = async (leagueId) => {
  try {
    const response = await axiosInstance.get('/leagues/invitations/', {
      params: { league: leagueId },
    });
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error) {
    console.error('Error fetching league invitations:', error);
    throw error;
  }
};

/**
 * INVITATIONS - Enviar invitación
 */
export const sendInvitation = async (invitationData) => {
  try {
    const response = await axiosInstance.post('/leagues/invitations/', invitationData);
    return response.data;
  } catch (error) {
    console.error('Error sending invitation:', error);
    throw error;
  }
};

/**
 * INVITATIONS - Aceptar invitación
 */
export const acceptInvitation = async (token, teamName = null) => {
  try {
    const payload = { token };
    if (teamName) payload.team_name = teamName;
    
    const response = await axiosInstance.post('/leagues/invitations/accept_invitation/', payload);
    return response.data;
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};

/**
 * INVITATIONS - Rechazar invitación
 */
export const rejectInvitation = async (token) => {
  try {
    const response = await axiosInstance.post('/leagues/invitations/reject_invitation/', { token });
    return response.data;
  } catch (error) {
    console.error('Error rejecting invitation:', error);
    throw error;
  }
};

/**
 * INVITATIONS - Cancelar invitación (por el que la envió)
 */
export const cancelInvitation = async (invitationId) => {
  try {
    await axiosInstance.delete(`/leagues/invitations/${invitationId}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error canceling invitation ${invitationId}:`, error);
    throw error;
  }
};

/**
 * LEAGUES - Abandonar una liga
 */
export const leaveLeague = async (leagueId) => {
  try {
    const response = await axiosInstance.post(`/leagues/leagues/${leagueId}/leave_league/`);
    return response.data;
  } catch (error) {
    console.error(`Error leaving league ${leagueId}:`, error);
    throw error;
  }
};
