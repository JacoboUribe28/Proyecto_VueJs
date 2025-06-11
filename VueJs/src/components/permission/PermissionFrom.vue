<script setup lang="ts">
import { usePermissionStore } from '../../store/PermissionStore';
import { PermissionValidator } from "../../utils/PermissionValidator";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from 'vue-router';

const props = defineProps<{ permissionId?: number }>();   

const permission = reactive({
    url: "",
    method: "",
});
const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const successMessage = ref("");
const store = usePermissionStore();
const router = useRouter();

const validateField = (field: keyof typeof permission) => {
    const result = PermissionValidator.validateField(field, permission[field]);

    if (!result.success) {
        errors[field] = result.error.errors[0].message;
    } else {
        delete errors[field]; // Borra el error si es válido
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
        }
    }
});

// Enviar formulario (crear o actualizar permiso)
const submitForm = async () => {
    validateAllFields();

    isSubmitting.value = true;
    successMessage.value = "";

    try {
        if (Object.keys(errors).length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, corrige los errores antes de enviar el formulario.',
            });
            return;
        }

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
        {{ props.permissionId ? "Editar Permiso" : "Crear Usuario" }}
      </h2>

        
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">URL:</label>
          <input v-model="permission.url" type="text" @input="validateField('url')" @blur="validateField('url')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.nurl">{{ errors.nurl }}</span>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Método:</label>
          <input v-model="permission.method" type="text" @input="validateField('method')" @blur="validateField('method')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.method">{{ errors.method }}</span>
        </div>
        
        <div class="col-span-1 md:col-span-2">
          <button type="submit" :disabled="Object.keys(errors).length > 0 || isSubmitting"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
            {{ isSubmitting ? "Enviando..." : props.permissionId ? "Actualizar" : "Crear" }}
          </button>
        </div>
    </div>
  </div>
</template>