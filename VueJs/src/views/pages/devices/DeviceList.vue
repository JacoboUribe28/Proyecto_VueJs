<script setup lang="ts">
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import DeviceService from "../../../service/DeviceService";
import UserService from "../../../service/UserService";

const devices = ref<{ id: number; name: string; operating_system: string; userId: number }[]>([]);
const users = ref<{ id: number; name: string }[]>([]);

const fetchUsersAndDevices = async () => {
  try {
    const userResponse = await UserService.getUsers();
    if (userResponse.status === 200) {
      users.value = userResponse.data.map((user: any) => ({ id: user.id, name: user.name }));
    }

    const response = await DeviceService.getDevices();
    if (response.status === 200) {
      devices.value = response.data.map((device: any) => ({
        id: device.id,
        name: device.name,
        operating_system: device.operating_system,
        userId: device.user_id, // Incluir el userId
      }));
    }
  } catch (error) {
    console.error("Error al obtener usuarios o dispositivos:", error);
  }
};

const deleteDevice = async (id: number) => {
  try {
    await DeviceService.deleteDevice(id);
    devices.value = devices.value.filter((device) => device.id !== id);
    Swal.fire({
      title: "Éxito",
      text: "Dispositivo eliminado con éxito ✅",
      icon: "success",
      confirmButtonText: "OK",
      timer: 3000,
    });
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: "❌ Error al eliminar el dispositivo.",
      icon: "error",
      confirmButtonText: "OK",
      timer: 3000,
    });
  }
};

const getUserName = (userId: number) => {
  const user = users.value.find((user) => user.id === userId);
  return user ? user.name : "Desconocido";
};

onMounted(fetchUsersAndDevices);
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Dispositivos</h1>

      <router-link
        to="/device/create"
        class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
      >
        <PlusCircleIcon class="w-5 h-5 mr-2" />
        Crear Dispositivo
      </router-link>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-2 border">Nombre</th>
              <th class="px-4 py-2 border">Sistema Operativo</th>
              <th class="px-4 py-2 border">Usuario</th>
              <th class="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="device in devices"
              :key="device.id"
              class="hover:bg-gray-100 transition"
            >
              <td class="px-4 py-2 border">{{ device.name }}</td>
              <td class="px-4 py-2 border">{{ device.operating_system }}</td>
              <td class="px-4 py-2 border">{{ getUserName(device.userId) }}</td>
              <td class="px-4 py-2 border flex space-x-4">
                <router-link
                  :to="`/device/view/${device.id}`"
                  class="text-blue-600 hover:underline mr-2"
                >
                  <EyeIcon class="w-5 h-5 inline" />
                </router-link>
                <router-link
                  :to="`/device/edit/${device.id}`"
                  class="text-green-600 hover:underline mr-2"
                >
                  <PencilIcon class="w-5 h-5 inline" />
                </router-link>
                <button
                  @click="deleteDevice(device.id)"
                  class="text-red-600 hover:underline"
                >
                  <TrashIcon class="w-5 h-5 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo similar al de SecurityQuestionView para mantener consistencia */
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

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-y-10 > * + * {
  margin-top: 2.5rem;
}
</style>