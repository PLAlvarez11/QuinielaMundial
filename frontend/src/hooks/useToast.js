import { useState } from 'react';

/**
 * Hook para manejar toasts (notificaciones)
 */
export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info', duration = 3000) => {
    setToast({ message, type, duration });
  };

  const hideToast = () => {
    setToast(null);
  };

  const showSuccess = (message) => {
    showToast(message, 'success', 3000);
  };

  const showError = (message) => {
    showToast(message, 'error', 4000);
  };

  const showInfo = (message) => {
    showToast(message, 'info', 3000);
  };

  const showWarning = (message) => {
    showToast(message, 'warning', 3000);
  };

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
