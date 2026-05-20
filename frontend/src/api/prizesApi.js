import axiosInstance from './axiosConfig';

const API_ENDPOINT = '/prizes/prize-distributions';

/**
 * Obtener lista de premios con filtros opcionales
 */
export const getPrizes = async (filters = {}) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Obtener un premio específico por ID
 */
export const getPrizeById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINT}/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Crear un nuevo premio
 */
export const createPrize = async (prizeData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT, prizeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Actualizar un premio existente
 */
export const updatePrize = async (id, prizeData) => {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINT}/${id}/`, prizeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Eliminar un premio
 */
export const deletePrize = async (id) => {
  try {
    await axiosInstance.delete(`${API_ENDPOINT}/${id}/`);
    return true;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
