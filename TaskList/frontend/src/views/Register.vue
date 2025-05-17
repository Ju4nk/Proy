<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Sign up</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" class="btn">sign up</button>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
      <p class="login-link">
        Do you already have an account?
        <router-link to="/">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Register",
  data() {
    return {
      username: '',
      email: '',
      password: '',
      message: ''
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:3000/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        this.message = `${response.data.username} sign up successfully!`;
      } catch (err) {
        console.error("Error:", err);
        this.message = 'Error';
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
}

.register-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.register-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
}

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

.message {
  margin-top: 1rem;
  font-weight: bold;
  color: green;
}

.login-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.login-link a {
  color: #2575fc;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>