import { useState } from 'react';
import { styles } from './styles';
import { validateSignupForm, registerUser } from '../utils';
import './styles.css';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [signupData, setSignupData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validation = validateSignupForm(signupData);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setLoading(true);

    const result = await registerUser(signupData.email, signupData.name, signupData.password);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
    setSignupData({ email: '', name: '', password: '', confirmPassword: '' });

    // Cambiar a login automáticamente después de 2 segundos
    setTimeout(() => {
      onRegisterSuccess();
    }, 2000);

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.formTitle}>Crear Cuenta</h2>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={signupData.email}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
          style={styles.input}
          disabled={loading}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Nombre Completo</label>
        <input
          type="text"
          name="name"
          value={signupData.name}
          onChange={handleChange}
          placeholder="Tu nombre completo"
          style={styles.input}
          disabled={loading}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Contraseña</label>
        <input
          type="password"
          name="password"
          value={signupData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          style={styles.input}
          disabled={loading}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Confirmar Contraseña</label>
        <input
          type="password"
          name="confirmPassword"
          value={signupData.confirmPassword}
          onChange={handleChange}
          placeholder="Repite tu contraseña"
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
        {loading ? 'Cargando...' : 'Registrarse'}
      </button>

      <p style={styles.switchText}>
        ¿Ya tienes cuenta?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={styles.switchLink}
        >
          Inicia sesión aquí
        </button>
      </p>
    </form>
  );
}
