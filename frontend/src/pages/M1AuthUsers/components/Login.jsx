import { useState } from 'react';
import { styles } from './styles';
import { validateLoginForm, loginUser } from '../utils';
import { useAuth } from '../../../context/useAuth';
import './styles.css';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
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

    // Guardar en el contexto global
    login(result.user, result.token);

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

      {error && <div style={styles.errorMessage} className="error-message">{error}</div>}
      {success && <div style={styles.successMessage} className="success-message">{success}</div>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          onFocus={() => handleFocus('email')}
          onBlur={handleBlur}
          placeholder="correo@ejemplo.com"
          style={{
            ...styles.input,
            ...(focusedField === 'email' && styles.inputFocus),
          }}
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
          onFocus={() => handleFocus('password')}
          onBlur={handleBlur}
          placeholder="Ingresa tu contraseña"
          style={{
            ...styles.input,
            ...(focusedField === 'password' && styles.inputFocus),
          }}
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
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor;
            e.target.style.transform = styles.submitButtonHover.transform;
            e.target.style.boxShadow = styles.submitButtonHover.boxShadow;
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = styles.submitButton.backgroundColor;
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = styles.submitButton.boxShadow;
          }
        }}
      >
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>

      <p style={styles.switchText}>
        ¿No tienes cuenta?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          style={styles.switchLink}
          onMouseEnter={(e) => {
            e.target.style.color = styles.switchLinkHover.color;
            e.target.style.textDecoration = styles.switchLinkHover.textDecoration;
          }}
          onMouseLeave={(e) => {
            e.target.style.color = styles.switchLink.color;
            e.target.style.textDecoration = 'none';
          }}
        >
          Regístrate aquí
        </button>
      </p>
    </form>
  );
}
