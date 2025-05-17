// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import router from './router';

axios.defaults.baseURL = 'http://localhost:3000'; // Configura la URL base para axios

const app = createApp(App); // Crea una sola instancia de la app
app.use(router); // Integra el router a la aplicación
app.config.globalProperties.$axios = axios; // Asigna axios a las propiedades globales
app.mount('#app'); // Monta la app en el contenedor con id "app"