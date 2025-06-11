<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from 'vue-router';
import { useRolePermissionStore } from '../../store/RolePermissionStore';
import { RolePermissionValidator } from "../../utils/RolePermissionValidators";
import { object } from "zod";
import Swal from "sweetalert2";

const props = defineProps<{ rolPermissionId?: number }>();

const rolPermission = reactive({
    role_id: 0,
    permission_id: 0
});

const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const successMessage = ref("");
const store = useRolePermissionStore();
const router = useRouter();

const validateField = (field: keyof typeof rolPermission) => {
    const result = RolePermissionValidator.validateField(field, rolPermission[field]);

    if (!result.success) {
        errors[field] = result.error.errors[0].message;
    } else {
        delete errors[field]; // Borra el error si es válido
    }
};
const validateAllFields = () => {
    Object.keys(rolPermission).forEach((field) => {
        validateField(field as keyof typeof rolPermission);
    });
};

// Cargar rolPermission si se pasa un rolepermissionId
onMounted(async() => {
    if(props.rolPermissionId) {
        try{
            const response = await store.getRolePermission(props.rolPermissionId);
            if (response.status == 200) {
                let fetcheRolepermission = response.data
                Object.assign(rolPermission,fetcheRolepermission)
            }

        }catch(error){
            console.error("error al cargar el RolePermission")
        }
    }
});

//enviar formulario(crear o actualizar rolepermission)
const submitForm = async () => {
    validateAllFields();


    isSubmitting.value = true;
    successMessage.value = "";

    try {
        let response;
        if (props.rolPermissionId) {
            // Actualizar perfil existente
            response = await store.editRolePermission(props.rolPermissionId, rolPermission);
        } else {
            // Crear nuevo perfil
            response = await store.addRolePermission(rolPermission);
        }

        if (response.status === 200 || response.status === 201) {
            successMessage.value = "Perfil guardado correctamente.";
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: successMessage.value,
            });
            router.push({ name: 'profile-list' });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "No se pudo guardar el perfil.",
            });
        }
    } catch (error) {
        console.error("Error al enviar formulario:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Ocurrió un error al guardar el perfil.",
        });
    } finally {
        isSubmitting.value = false;
    }
    router.push('/profile');
    
};


</script>

<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="w-full bg-white shadow-lg rounded-lg p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
                {{ props.rolPermissionId ? "Editar Usuario" : "Crear Usuario" }}
            </h2>

            <div class="w-full">
                <label class="block text-sm font-medium text-gray-700">Fecha de Inicio:</label>
                <input v-model="rolPermission.role_id" type="date" @input="validateField('role_id')"
                    @blur="validateField('role_id')"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                <span class="text-red-500 text-sm" v-if="errors.startAt">{{ errors.startAt }}</span>
            </div>

            <div class="w-full">
                <label class="block text-sm font-medium text-gray-700">Fecha de Fin:</label>
                <input v-model="rolPermission.permission_id" type="date" @input="validateField('permission_id')"
                    @blur="validateField('permission_id')"
                    class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                <span class="text-red-500 text-sm" v-if="errors.endAt">{{ errors.endAt }}</span>
            </div>

            <div class="col-span-1 md:col-span-2">
                <button type="submit" :disabled="Object.keys(errors).length > 0 || isSubmitting"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
                    {{ isSubmitting ? "Enviando..." : props.rolPermissionId ? "Actualizar" : "Crear" }}
                </button>
            </div>
        </div>
    </div>
</template>
