<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../../store/Auth';
import type { User } from '../../../models/User';
import { jwtDecode } from 'jwt-decode';


const authStore = useAuthStore();
const user = ref<User>({ email: '', password: '' });
const userProfile = ref<{ name: string; email: string; imageUrl: string } | null>(null);

const handleLogin = async () => {
    try {
        const response = await authStore.login(user.value);
        if (response && response.token) {
            // Guardar información del usuario y token en localStorage
            localStorage.setItem('user', JSON.stringify({
                email: user.value.email,
                token: response.token
            }));
        } else {
            console.error('No se recibió un token en la respuesta.');
        }
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        } else {
            alert('Ocurrió un error desconocido');
        }
    }
};

const callback = (response: { credential?: string }) => {
  console.log("Handle the response", response);

  // Check if we received a credential (JWT)
  if (response?.credential) {
    try {
      // Decode the JWT to extract profile info
      const decoded = jwtDecode<{ name: string; family_name: string; email: string; picture: string }>(response.credential);
      console.log('Decoded JWT:', decoded);

      // Extract user profile information from decoded JWT
      userProfile.value = {
        name: decoded.name,
        email: decoded.email,
        imageUrl: decoded.picture,  // Profile picture URL
      };

      // Assign user details and token to localStorage
      localStorage.setItem('user', JSON.stringify({
        name: decoded.name,
        surname: decoded.family_name,
        email: decoded.email,
        token: response.credential
      }));
    } catch (error) {
      console.error('Failed to decode JWT:', error);
    }
  }
};
</script>

<template>
  <div class="login-container">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-700">Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <input
        v-model="user.email"
        type="email"
        placeholder="Correo electrónico"
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        v-model="user.password"
        type="password"
        placeholder="Contraseña"
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Ingresar
      </button>
      <p class="text-center text-gray-500">
        ¿No tienes una cuenta? <a href="/register" class="text-blue-500 hover:underline">Regístrate</a>
      </p>
    </form>
    <div class="mt-4 flex justify-center">
      <GoogleLogin :callback="callback" />
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
