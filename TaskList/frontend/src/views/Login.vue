<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Login</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <input v-model="email" type="email" placeholder="Email" required />
        </div>
        <div class="form-group">
          <input v-model="password" type="password" placeholder="Password" required />
        </div>
        <button type="submit" class="btn">Login</button>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p class="register-link">
        Don't have an account yet? <router-link to="/register">Sing up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();

    async function login() {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email: email.value,
          password: password.value,
        });

        const token = response.data.access_token;
        localStorage.setItem('token', token);

        // Configura Axios para que incluya el token en todas las peticiones siguientes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        router.push('/dashboard');
      } catch (err) {
        error.value = 'Credenciales incorrectas';
        console.error(err);
      }
    }

    return { email, password, error, login };
  },
};
</script>

<style scoped>
/* Fondo degradado y centrado */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
}

/* Card de login */
.login-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Título */
.login-title {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: #333;
}

/* Grupos de formulario */
.form-group {
  margin-bottom: 1rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #2575fc;
}

/* Botón */
.btn {
  display: inline-block;
  background: #2575fc;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;
}

.btn:hover {
  background: #1a5ddb;
}

/* Mensaje de error */
.error-message {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}

/* Enlace de registro */
.register-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.register-link a {
  color: #2575fc;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>