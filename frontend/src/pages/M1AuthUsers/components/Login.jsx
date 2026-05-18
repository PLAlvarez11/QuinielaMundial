import { useState } from 'react';
import { styles } from './styles';
import { validateLoginForm, loginUser } from '../utils';
import './styles.css';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validation = validateLoginForm(loginData);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setLoading(true);

    const result = await loginUser(loginData.email, loginData.password);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess('¡Login exitoso!');
    setLoginData({ email: '', password: '' });

    // Notificar al componente padre
    setTimeout(() => {
      onLoginSuccess(result.user);
    }, 1000);

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.formTitle}>Iniciar Sesión</h2>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
          style={styles.input}
          disabled={loading}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Contraseña</label>
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          placeholder="Ingresa tu contraseña"
          style={styles.input}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        style={{
          ...styles.submitButton,
          ...(loading && styles.submitButtonDisabled),
        }}
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>

      <p style={styles.switchText}>
        ¿No tienes cuenta?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          style={styles.switchLink}
        >
          Regístrate aquí
        </button>
      </p>
    </form>
  );
}
