<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Sesiones Activas</h1>

      <!-- Filtros -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700">Buscar por Token:</label>
          <input
            v-model="searchToken"
            type="text"
            class="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese token..."
          />
        </div>
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700">Filtrar por Estado:</label>
          <select
            v-model="searchState"
            class="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-2 border">Token</th>
              <th class="px-4 py-2 border">Fecha de Expiración</th>
              <th class="px-4 py-2 border">Código FA</th>
              <th class="px-4 py-2 border">Estado</th>
              <th class="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading" class="hover:bg-gray-100">
              <td colspan="5" class="px-4 py-2 border text-center">
                Cargando sesiones...
              </td>
            </tr>
            <tr v-else-if="paginatedSessions.length === 0" class="hover:bg-gray-100">
              <td colspan="5" class="px-4 py-2 border text-center">
                No se encontraron sesiones
              </td>
            </tr>
            <tr v-for="session in paginatedSessions" :key="session.id" class="hover:bg-gray-100 transition">
              <td class="px-4 py-2 border">{{ session.token }}</td>
              <td class="px-4 py-2 border">{{ formatDate(session.expiration) }}</td>
              <td class="px-4 py-2 border">{{ session.FACode }}</td>
              <td class="px-4 py-2 border">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800': session.state === 'active',
                    'bg-red-100 text-red-800': session.state === 'inactive'
                  }"
                >
                  {{ session.state }}
                </span>
              </td>
              <td class="px-4 py-2 border flex space-x-4">
                <router-link :to="`/session/view/${session.id}`"
                  class="text-green-600 hover:text-green-800 flex items-center">
                  <EyeIcon class="w-5 h-5 mr-1" />
                  Ver
                </router-link>
                <button @click="deleteSession(session.id)"
                  class="text-red-600 hover:text-red-800 flex items-center">
                  <TrashIcon class="w-5 h-5 mr-1" />
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="mt-4 flex justify-between items-center" v-if="totalPages > 1">
        <div class="flex space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Anterior
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Siguiente
          </button>
        </div>
        <div class="text-sm text-gray-600">
          Página {{ currentPage }} de {{ totalPages }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useSessionStore } from '@/store/SessionStore';
import type { Session } from '@/models/Session';
import { EyeIcon, TrashIcon } from 'lucide-vue-next';
import Swal from 'sweetalert2';

const sessionStore = useSessionStore();
const sessions = ref<Session[]>([]);
const searchToken = ref('');
const searchState = ref('');
const isLoading = ref(true);

const currentPage = ref(1);
const itemsPerPage = ref(10);

const loadSessions = async () => {
  try {
    isLoading.value = true;
    await sessionStore.fetchSessions();
    sessions.value = sessionStore.sessions;
  } catch (error) {
    console.error('Error al cargar las sesiones:', error);
    Swal.fire({
      title: 'Error',
      text: 'Error al cargar las sesiones ❌',
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 3000
    });
  } finally {
    isLoading.value = false;
  }
};

const deleteSession = async (id: string) => {
  try {
    await sessionStore.removeSession(id);
    sessions.value = sessions.value.filter((session) => session.id !== id);
    Swal.fire({
      title: 'Éxito',
      text: 'Sesión eliminada con éxito ✅',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 3000
    });
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: '❌ Error al eliminar la sesión.',
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 3000
    });
  }
};

const filteredSessions = computed(() => {
  return sessions.value.filter(session => {
    const matchToken = session.token?.toLowerCase().includes(searchToken.value.toLowerCase()) ?? false;
    const matchState = !searchState.value || session.state === searchState.value;
    return matchToken && matchState;
  });
});

const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredSessions.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredSessions.value.length / itemsPerPage.value);
});

const formatDate = (date: Date | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
};

onMounted(loadSessions);
</script>
