<script setup lang="ts">
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import DigitalSignatureService from "../../service/DigitalSignatureService";
import UserService from "../../service/UserService";

const userId = ref<number | null>(null);
const photo = ref<File | null>(null);
const photoPreview = ref<string | null>(null);
const isSubmitting = ref(false);
const users = ref<{ id: number; name: string }[]>([]);

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "Error",
        text: "La imagen no debe superar los 5MB",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    photo.value = file;
    photoPreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async () => {
  if (!userId.value) {
    Swal.fire({
      title: "Error",
      text: "Debe seleccionar un usuario",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  if (!photo.value) {
    Swal.fire({
      title: "Error",
      text: "Debe seleccionar una foto",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  const formData = new FormData();
  formData.append("photo", photo.value);
  formData.append("user_id", userId.value.toString()); // Cambiado a "user_id"

  isSubmitting.value = true;

  try {
    const response = await DigitalSignatureService.createDigitalSignature(userId.value, formData);
    if (response.status === 201) {
      Swal.fire({
        title: "Éxito",
        text: "Firma digital creada con éxito ✅",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/signatures";
      });
    }
  } catch (error) {
    console.error("Error al enviar la firma digital:", error);
    Swal.fire({
      title: "Error",
      text: "Ocurrió un error al enviar la firma digital",
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const fetchUsers = async () => {
  try {
    const response = await UserService.getUsers();
    if (response.status === 200) {
      users.value = response.data.map((user: any) => ({ id: user.id, name: user.name }));
    }
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    Swal.fire({
      title: "Error",
      text: "No se pudieron cargar los usuarios",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">Crear Firma Digital</h2>

      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Usuario:</label>
          <select
            v-model="userId"
            class="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="" disabled>Seleccione un usuario</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Foto:</label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          />
          <div v-if="photoPreview" class="mt-4">
            <p class="text-sm text-gray-500">Vista previa:</p>
            <img :src="photoPreview" alt="Vista previa de la foto" class="mt-2 max-w-xs rounded-lg border" />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {{ isSubmitting ? "Enviando..." : "Crear Firma Digital" }}
        </button>
      </form>
    </div>
  </div>
</template>
