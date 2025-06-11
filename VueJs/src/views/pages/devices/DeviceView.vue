<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import DeviceService from "../../../service/DeviceService";
import UserService from "../../../service/UserService";

const route = useRoute();
const deviceId = route.params.id ? Number(route.params.id) : undefined;
const device = ref<{ name: string; ip: string; operating_system: string; user_id?: number } | null>(null);
const userName = ref<string>("Desconocido");

const fetchDevice = async () => {
  if (deviceId) {
    try {
      const response = await DeviceService.getDevice(deviceId);
      if (response.status === 200) {
        device.value = {
          name: response.data.name ?? "",
          ip: response.data.ip ?? "",
          operating_system: response.data.operating_system ?? "",
          user_id: response.data.user_id
        };
        if (device.value.user_id) {
          await fetchUserName(device.value.user_id);
        }
      }
    } catch (error) {
      console.error("Error al obtener el dispositivo:", error);
    }
  }
};

const fetchUserName = async (userId: number) => {
  try {
    const response = await UserService.getUser(userId);
    if (response.status === 200) {
      userName.value = response.data.name ?? "Desconocido";
    }
  } catch (error) {
    console.error("Error al obtener el nombre del usuario:", error);
  }
};

onMounted(fetchDevice);
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
    <div class="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 space-y-10">
      <h1 class="text-4xl font-extrabold text-gray-800 text-center border-b pb-6">
        Detalles del Dispositivo
      </h1>

      <div v-if="device" class="space-y-10">
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Nombre</h2>
          <p class="text-gray-900 text-lg font-medium">{{ device.name }}</p>
        </div>
        <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">IP</h2>
          <p class="text-gray-900 text-lg font-medium">{{ device.ip }}</p>
        </div>
        <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Sistema Operativo</h2>
          <p class="text-gray-900 text-lg font-medium">{{ device.operating_system }}</p>
        </div>
        <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Usuario</h2>
          <p class="text-gray-900 text-lg font-medium">{{ userName }}</p>
        </div>
      </div>

      <div v-else class="text-center">
        <p class="text-gray-600 text-lg">Cargando detalles del dispositivo...</p>
      </div>

      <div class="text-center">
        <router-link to="/devices" class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold">
          Volver a la lista
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo mejorado para una apariencia más profesional */
.bg-gradient-to-r {
  background: linear-gradient(to right, #ebf8ff, #d1fae5);
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.text-gray-900 {
  color: #1a202c;
}

.text-gray-800 {
  color: #2d3748;
}

.text-gray-700 {
  color: #4a5568;
}

.text-gray-600 {
  color: #718096;
}

.text-lg {
  font-size: 1.125rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.font-extrabold {
  font-weight: 800;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.p-6 {
  padding: 1.5rem;
}

.p-8 {
  padding: 2rem;
}

.pb-6 {
  padding-bottom: 1.5rem;
}

.space-y-10 > * + * {
  margin-top: 2.5rem;
}

.hover\:bg-blue-700:hover {
  background-color: #2b6cb0;
}

.transition {
  transition: all 0.2s ease-in-out;
}
</style>

