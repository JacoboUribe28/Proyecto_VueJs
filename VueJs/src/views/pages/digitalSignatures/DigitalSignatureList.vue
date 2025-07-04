<script setup lang="ts">
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import DigitalSignatureService from "../../../service/DigitalSignatureService";
import UserService from "../../../service/UserService";

const signatures = ref<{ id: number; photo: string; user_name: string, user_email: string }[]>([]);

const fetchSignatures = async () => {
  try {
    const response = await DigitalSignatureService.getDigitalSignatures();
    if (response.status === 200) {
      const usersResponse = await UserService.getUsers();
      const usersMap = new Map(usersResponse.data.map((user: any) => [user.id, { name: user.name, email: user.email }]));

      signatures.value = response.data.map((signature: any) => ({
        id: signature.id,
        photo: signature.photo,
        user_name: usersMap.get(signature.user_id)?.name || "Unknown",
        user_email: usersMap.get(signature.user_id)?.email || "Unknown",
      }));
    }
  } catch (error) {
    console.error("Error al obtener las firmas digitales:", error);
  }
};

const deleteSignature = async (id: number) => {
  try {
    await DigitalSignatureService.deleteDigitalSignature(id);
    signatures.value = signatures.value.filter((signature) => signature.id !== id);
    Swal.fire({
      title: "Éxito",
      text: "Firma digital eliminada con éxito ✅",
      icon: "success",
      confirmButtonText: "OK",
      timer: 3000,
    });
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: "❌ Error al eliminar la firma digital.",
      icon: "error",
      confirmButtonText: "OK",
      timer: 3000,
    });
  }
};

onMounted(fetchSignatures);
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Firmas Digitales</h1>

      <router-link
        to="/digital-signature/create"
        class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
      >
        <PlusCircleIcon class="w-5 h-5 mr-2" />
        Crear Firma Digital
      </router-link>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-2 border">Foto</th>
              <th class="px-4 py-2 border">Nombre de Usuario</th>
              <th class="px-4 py-2 border">Correo Electrónico</th>
              <th class="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="signature in signatures"
              :key="signature.id"
              class="hover:bg-gray-100 transition"
            >
              <td class="px-4 py-2 border">
                <img
                  :src="signature.photo"
                  alt="Firma Digital"
                  class="w-16 h-16 object-cover rounded-lg border border-gray-300"
                />
              </td>
              <td class="px-4 py-2 border">{{ signature.user_name }}</td>
              <td class="px-4 py-2 border">{{ signature.user_email }}</td>
              <td class="px-4 py-2 border flex space-x-4">
                <router-link
                  :to="`/digital-signature/view/${signature.id}`"
                  class="text-green-600 hover:text-green-800 flex items-center"
                >
                  <EyeIcon class="w-5 h-5 mr-1" />
                  Ver
                </router-link>
                <router-link
                  :to="`/digital-signature/update/${signature.id}`"
                  class="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <PencilIcon class="w-5 h-5 mr-1" />
                  Editar
                </router-link>
                <button
                  @click="deleteSignature(signature.id)"
                  class="text-red-600 hover:text-red-800 flex items-center"
                >
                  <TrashIcon class="w-5 h-5 mr-1" />
                  Eliminar
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
/* Estilo similar al de DeviceList para mantener consistencia */
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