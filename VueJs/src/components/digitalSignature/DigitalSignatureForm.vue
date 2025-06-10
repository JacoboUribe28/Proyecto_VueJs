<script setup lang="ts">
import { DigitalSignatureValidator } from "../../utils/DigitalSignatureValidators";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import DigitalSignatureService from "../../service/DigitalSignatureService";
import UserService from "../../service/UserService";

const props = defineProps<{ signatureId?: number }>();

const signature = reactive({
  photo: "",
  id_user: undefined as number | undefined,
});

const users = ref<{ id: number; name: string }[]>([]);
const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const router = useRouter();

const validateField = (field: keyof typeof signature) => {
  const result = DigitalSignatureValidator.validateField(field, signature[field]);

  if (!result.success) {
    errors[field] = result.error.errors[0].message;
  } else {
    delete errors[field];
  }
};

const validateAllFields = () => {
  Object.keys(signature).forEach((field) => {
    validateField(field as keyof typeof signature);
  });
};

const fetchUsers = async () => {
  try {
    const response = await UserService.getUsers();
    if (response.status === 200) {
      users.value = response.data.map((user: any) => ({ id: user.id, name: user.name }));
    }
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

onMounted(async () => {
  await fetchUsers();

  if (props.signatureId) {
    try {
      const response = await DigitalSignatureService.getDigitalSignature(props.signatureId);
      if (response.status === 200) {
        Object.assign(signature, response.data);
      }
    } catch (error) {
      console.error("Error al cargar la firma digital:", error);
    }
  }
});

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      signature.photo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const submitForm = async () => {
  validateAllFields();

  if (Object.keys(errors).length > 0) return;

  isSubmitting.value = true;

  try {
    let response;
    if (props.signatureId) {
      response = await DigitalSignatureService.updateDigitalSignature(props.signatureId, signature);
    } else {
      response = await DigitalSignatureService.createDigitalSignature(signature);
    }

    if (response.status === 200 || response.status === 201) {
      Swal.fire({
        title: "Éxito",
        text: props.signatureId ? "Firma digital actualizada con éxito ✅" : "Firma digital creada con éxito ✅",
        icon: "success",
        confirmButtonText: "OK",
        timer: 3000,
      });
    } else {
      Swal.fire({
        title: "Error",
        text: `❌ Código ${response.status}: ${typeof response.data === 'object' && 'message' in response.data ? response.data.message : "Ocurrió un error"}`,
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
        timer: 3000,
      });
    }
  } catch (error: any) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "❌ Error inesperado en la operación.",
      icon: "error",
      confirmButtonText: "OK",
      timer: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
  router.push("/digital-signatures");
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        {{ props.signatureId ? "Editar Firma Digital" : "Crear Firma Digital" }}
      </h2>

      <form @submit.prevent="submitForm" class="grid grid-cols-1 gap-6">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Usuario:</label>
          <select
            v-model="signature.id_user"
            @change="validateField('id_user')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Seleccione un usuario</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
          <span class="text-red-500 text-sm" v-if="errors.id_user">{{ errors.id_user }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Foto:</label>
          <div class="flex items-center space-x-4">
            <div v-if="signature.photo" class="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
              <img :src="signature.photo" alt="Foto actual" class="w-full h-full object-cover" />
            </div>
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <span class="text-red-500 text-sm" v-if="errors.photo">{{ errors.photo }}</span>
        </div>

        <div class="col-span-1">
          <button
            type="submit"
            :disabled="Object.keys(errors).length > 0 || isSubmitting"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {{ isSubmitting ? "Enviando..." : props.signatureId ? "Actualizar" : "Crear" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>