import userSingleton from './userSingleton';

const API_BASE_URL = 'http://localhost:8003/api';

export const validateLoginForm = (loginData) => {
  if (!loginData.email.trim()) {
    return { valid: false, error: 'El email es obligatorio' };
  }
  if (!loginData.password) {
    return { valid: false, error: 'La contraseña es obligatoria' };
  }
  return { valid: true, error: '' };
};

export const validateSignupForm = (signupData) => {
  if (!signupData.email.trim()) {
    return { valid: false, error: 'El email es obligatorio' };
  }
  if (!signupData.name.trim()) {
    return { valid: false, error: 'El nombre es obligatorio' };
  }
  if (!signupData.password) {
    return { valid: false, error: 'La contraseña es obligatoria' };
  }
  if (signupData.password.length < 6) {
    return { valid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }
  if (signupData.password !== signupData.confirmPassword) {
    return { valid: false, error: 'Las contraseñas no coinciden' };
  }
  return { valid: true, error: '' };
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.non_field_errors?.[0] ||
        data.password?.[0] ||
        data.email?.[0] ||
        'Error en el login';
      return { success: false, error: errorMessage };
    }

    // Guardar en el singleton
    userSingleton.setUser(data.user, data.token);

    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: 'Error de conexión: ' + err.message };
  }
};

export const registerUser = async (email, name, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        name,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.email?.[0] ||
        data.password?.[0] ||
        data.name?.[0] ||
        'Error en el registro';
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Error de conexión: ' + err.message };
  }
};

export const logoutUser = () => {
  userSingleton.clearUser();
};
