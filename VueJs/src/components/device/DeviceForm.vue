<script setup lang="ts">
import { DeviceValidator } from "../../utils/DeviceValidators";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import DeviceService from "../../service/DeviceService";
import UserService from "../../service/UserService";

const props = defineProps<{ deviceId?: number }>();

const device = reactive({
  name: "",
  ip: "",
  operating_system: "",
  user_id: undefined as number | undefined,
});

const users = ref<{ id: number; name: string }[]>([]);
const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const router = useRouter();

const validateField = (field: keyof typeof device) => {
  const result = DeviceValidator.validateField(field, device[field]);

  if (!result.success) {
    errors[field] = result.error.errors[0].message;
  } else {
    delete errors[field];
  }
};

const validateAllFields = () => {
  Object.keys(device).forEach((field) => {
    validateField(field as keyof typeof device);
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

  if (props.deviceId) {
    try {
      const response = await DeviceService.getDevice(props.deviceId);
      if (response.status === 200) {
        Object.assign(device, response.data);
      }
    } catch (error) {
      console.error("Error al cargar el dispositivo:", error);
    }
  }
});

const submitForm = async () => {
  validateAllFields();

  if (Object.keys(errors).length > 0) return;

  isSubmitting.value = true;

  try {
    let response;
    if (props.deviceId) {
      response = await DeviceService.updateDevice(props.deviceId, device);
    } else {
      response = await DeviceService.createDevice(device);
    }

    if (response.status === 200 || response.status === 201) {
      Swal.fire({
        title: "Éxito",
        text: props.deviceId ? "Dispositivo actualizado con éxito ✅" : "Dispositivo creado con éxito ✅",
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
  router.push("/devices");
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        {{ props.deviceId ? "Editar Dispositivo" : "Crear Dispositivo" }}
      </h2>

      <form @submit.prevent="submitForm" class="grid grid-cols-1 gap-6">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Nombre:</label>
          <input
            v-model="device.name"
            type="text"
            @input="validateField('name')"
            @blur="validateField('name')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <span class="text-red-500 text-sm" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">IP:</label>
          <input
            v-model="device.ip"
            type="text"
            @input="validateField('ip')"
            @blur="validateField('ip')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <span class="text-red-500 text-sm" v-if="errors.ip">{{ errors.ip }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Sistema Operativo:</label>
          <input
            v-model="device.operating_system"
            type="text"
            @input="validateField('operating_system')"
            @blur="validateField('operating_system')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <span class="text-red-500 text-sm" v-if="errors.operating_system">{{ errors.operating_system }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Usuario:</label>
          <select
            v-model="device.user_id"
            @change="validateField('user_id')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Seleccione un usuario</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
          <span class="text-red-500 text-sm" v-if="errors.user_id">{{ errors.user_id }}</span>
        </div>

        <div class="col-span-1">
          <button
            type="submit"
            :disabled="Object.keys(errors).length > 0 || isSubmitting"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {{ isSubmitting ? "Enviando..." : props.deviceId ? "Actualizar" : "Crear" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>