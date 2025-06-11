<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import PermissionService from "../../../service/PermissionService";

const route = useRoute();
const permissionId = route.params.id ? Number(route.params.id) : undefined;
const permission = ref<{ method: string; nurl: string } | null>(null);

const fetchPermission = async () => {
  if (permissionId) {
    try {
      const response = await PermissionService.getPermission(permissionId);
      if (response.status === 200) {
        permission.value = {
          method: response.data.method ?? "",
          nurl: response.data.nurl ?? ""
        };
      }
    } catch (error) {
      console.error("Error al obtener el permiso:", error);
    }
  }
};

onMounted(fetchPermission);
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
    <div class="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 space-y-10">
      <h1 class="text-4xl font-extrabold text-gray-800 text-center border-b pb-6">
        Detalles del Permiso
      </h1>

      <div v-if="permission" class="space-y-10">
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Método</h2>
          <p class="text-gray-900 text-lg font-medium">{{ permission.method }}</p>
        </div>
        <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">URL</h2>
          <p class="text-gray-900 text-lg font-medium">{{ permission.nurl }}</p>
        </div>
      </div>

      <div v-else class="text-center">
        <p class="text-gray-600 text-lg">Cargando detalles del permiso...</p>
      </div>

      <div class="text-center">
        <router-link to="/permissions" class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold">
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