class UserSingleton {
  constructor() {
    if (UserSingleton.instance) {
      return UserSingleton.instance;
    }

    this.user = null;
    this.token = null;
    this.loadFromLocalStorage();

    UserSingleton.instance = this;
  }

  static getInstance() {
    if (!UserSingleton.instance) {
      UserSingleton.instance = new UserSingleton();
    }
    return UserSingleton.instance;
  }

  loadFromLocalStorage() {
    try {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');

      if (token) this.token = token;
      if (user) this.user = JSON.parse(user);
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }

  setUser(userData, token) {
    this.user = userData;
    this.token = token;

    // Guardar en localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!(this.user && this.token);
  }

  clearUser() {
    this.user = null;
    this.token = null;

    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  updateUser(userData) {
    this.user = { ...this.user, ...userData };
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  getEmail() {
    return this.user?.email || null;
  }

  getName() {
    return this.user?.name || null;
  }

  getId() {
    return this.user?.id || null;
  }
}

// Exportar instancia única
export default UserSingleton.getInstance();
