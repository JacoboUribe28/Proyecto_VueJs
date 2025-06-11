<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import DigitalSignatureService from "../../../service/DigitalSignatureService";
import UserService from "../../../service/UserService";

const route = useRoute();
const signatureId = route.params.id ? Number(route.params.id) : undefined;
const signature = ref<{ photo: string; user_name: string; user_email: string } | null>(null);

const fetchSignature = async () => {
  if (signatureId) {
    try {
      const response = await DigitalSignatureService.getDigitalSignature(signatureId);
      console.log("Respuesta de la firma digital:", response.data);
      if (response.status === 200) {
        if (!response.data || !response.data.user_id) {
          console.error("La firma digital no contiene un user_id válido.");
          signature.value = {
            photo: response.data?.photo ?? "",
            user_name: "Usuario no especificado",
            user_email: "Correo no especificado",
          };
          return;
        }

        const userResponse = await UserService.getUser(response.data.user_id ?? 0).catch((error) => {
          if (error.response?.status === 404) {
            console.error("Usuario no encontrado para la firma digital.");
            return { data: { name: "Usuario no encontrado", email: "Correo no encontrado" } };
          }
          throw error;
        });
        signature.value = {
          photo: response.data.photo ?? "",
          user_name: userResponse.data.name ?? "Unknown",
          user_email: userResponse.data.email ?? "Unknown",
        };
      }
    } catch (error) {
      console.error("Error al obtener la firma digital:", error);
    }
  }
};

onMounted(fetchSignature);
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
    <div class="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 space-y-10">
      <h1 class="text-4xl font-extrabold text-gray-800 text-center border-b pb-6">
        Detalles de la Firma Digital
      </h1>

      <div v-if="signature" class="space-y-10">
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-md flex justify-center">
          <img
            :src="signature.photo"
            alt="Firma Digital"
            class="w-64 h-64 object-cover rounded-lg border border-gray-300"
          />
        </div>
        <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg shadow-md space-y-4">
          <h2 class="text-2xl font-bold text-gray-800">Nombre del Usuario</h2>
          <p class="text-gray-900 text-lg font-medium">{{ signature.user_name }}</p>
          <h2 class="text-2xl font-bold text-gray-800">Correo Electrónico</h2>
          <p class="text-gray-900 text-lg font-medium">{{ signature.user_email }}</p>
        </div>
      </div>

      <div v-else class="text-center">
        <p class="text-gray-600 text-lg">Cargando detalles de la firma digital...</p>
      </div>

      <div class="text-center">
        <router-link to="/digital-signatures" class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold">
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