<script setup lang="ts">
import { usePermissionStore } from '../../store/PermissionStore';
import { PermissionValidator } from "../../utils/PermissionValidator";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from 'vue-router';

const props = defineProps<{ permissionId?: number }>();

const permission = reactive({
  entity: "",
  url: "",
  method: "",
});

const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"];
const entities = ["Usuarios", "Roles", "Permisos", "Productos", "Órdenes"]; // <-- Nueva lista de entidades

const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const successMessage = ref("");
const store = usePermissionStore();
const router = useRouter();

const validateField = (field: keyof typeof permission) => {
  const result = PermissionValidator.validateField(field, permission[field]);

  if (!result.success && 'error' in result && Array.isArray(result.error.errors) && result.error.errors.length > 0) {
    errors[field] = result.error.errors[0].message;
  } else {
    delete errors[field];
  }
};

const validateAllFields = () => {
  Object.keys(permission).forEach((field) => {
    validateField(field as keyof typeof permission);
  });
};

// Cargar permiso si se pasa un permissionId
onMounted(async () => {
  if (props.permissionId) {
    try {
      const response = await store.getPermission(props.permissionId);
      if (response.status == 200) {
        let fetchedPermission = response.data;
        Object.assign(permission, fetchedPermission);
      }
    } catch (error) {
      console.error("Error al cargar permiso:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar el permiso.',
      });
    }
  }
});

// Enviar formulario (crear o actualizar permiso)
const submitForm = async () => {
  validateAllFields();

  if (Object.keys(errors).length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, corrige los errores antes de enviar el formulario.',
    });
    return;
  }

  isSubmitting.value = true;
  successMessage.value = "";

  try {
    let response;
    if (props.permissionId) {
      response = await store.editPermission(props.permissionId, permission);
    } else {
      response = await store.addPermission(permission);
    }

    if (response.status === 200 || response.status === 201) {
      successMessage.value = "Permiso guardado correctamente.";
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: successMessage.value,
      });
      router.push('/permissions');
    }
  } catch (error) {
    console.error("Error al guardar permiso:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al guardar el permiso. Por favor, inténtalo de nuevo más tarde.',
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        {{ props.permissionId ? "Editar Permiso" : "Crear Permiso" }}
      </h2>

      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">URL:</label>
          <input
            v-model="permission.url"
            type="text"
            @input="validateField('url')"
            @blur="validateField('url')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <span class="text-red-500 text-sm" v-if="errors.url">{{ errors.url }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Método:</label>
          <select
            v-model="permission.method"
            @change="validateField('method')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Seleccione un método</option>
            <option v-for="method in httpMethods" :key="method" :value="method">
              {{ method }}
            </option>
          </select>
          <span class="text-red-500 text-sm" v-if="errors.method">{{ errors.method }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Entidad:</label>
          <select
            v-model="permission.entity"
            @change="validateField('entity')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Seleccione una Entidad</option>
            <option v-for="entity in entities" :key="entity" :value="entity">
              {{ entity }}
            </option>
          </select>
          <span class="text-red-500 text-sm" v-if="errors.entity">{{ errors.entity }}</span>
        </div>

        <div class="col-span-1 md:col-span-2">
          <button
            type="submit"
            :disabled="Object.keys(errors).length > 0 || isSubmitting"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {{ isSubmitting ? "Enviando..." : props.permissionId ? "Actualizar" : "Crear" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
