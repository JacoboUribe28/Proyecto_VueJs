<script setup lang="ts">
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from 'vue-router';
import RoleService from "../../service/RoleService";
import UserRoleService from "../../service/UserRoleService";
import UserService from "../../service/UserService";
import { UserRoleValidator } from "../../utils/UserRoleValidators";

const props = defineProps<{ userRoleId?: number }>();

const userRole = reactive({
    user_id: null,
    role_id: null,
    startAt: "",
    endAt: "",
});

const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const router = useRouter();

const users = ref<{ id?: number; name?: string; email?: string }[]>([]);
const roles = ref<{ id?: number; name?: string }[]>([]);

const validateField = (field: keyof typeof userRole) => {
    const result = UserRoleValidator.validateField(field, userRole[field]);
    if (!result.success) {
        errors[field] = result.error.errors[0].message;
    } else {
        delete errors[field];
    }
};

const validateAllFields = () => {
    Object.keys(userRole).forEach((field) => {
        validateField(field as keyof typeof userRole);
    });
};

const fetchUsers = async () => {
    try {
        const response = await UserService.getUsers();
        if (response.status === 200) {
            users.value = response.data.map((user: any) => ({ id: user.id, name: user.name, email: user.email }));
        }
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
    }
};

const fetchRoles = async () => {
    try {
        const response = await RoleService.getRoles();
        if (response.status === 200) {
            roles.value = response.data.map((role: any) => ({ id: role.id, name: role.name }));
        }
    } catch (error) {
        console.error("Error al obtener los roles:", error);
    }
};

onMounted(async () => {
    await fetchUsers();
    await fetchRoles();
    if (props.userRoleId) {
        try {
            const response = await UserRoleService.getUserRole(props.userRoleId);
            if (response.status == 200) {
                Object.assign(userRole, response.data);
            }
        } catch (error) {
            console.error("Error al cargar UserRole:", error);
        }
    }
});

const submitForm = async () => {
    validateAllFields();
    if (Object.keys(errors).length > 0) return;
    isSubmitting.value = true;
    try {
        let response;
        if (props.userRoleId) {
            // Solo enviar el rol para actualizar
            response = await UserRoleService.updateUserRole(props.userRoleId, {
                role_id: userRole.role_id
            });
        } else {
            response = await UserRoleService.createUserRole({
                user_id: userRole.user_id,
                role_id: userRole.role_id,
                startAt: userRole.startAt,
                endAt: userRole.endAt
            });
        }
        if (response.status === 200 || response.status === 201) {
            Swal.fire({
                title: 'Éxito',
                text: props.userRoleId ? 'UserRole actualizado con éxito ✅' : 'UserRole creado con éxito ✅',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3000
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: `❌ Código ${response.status}: ${response.data?.message || 'Ocurrió un error'}`,
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo',
                timer: 3000
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: '❌ Error inesperado en la operación.',
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3000
        });
    } finally {
        isSubmitting.value = false;
    }
    router.push('/userroles');
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="w-full bg-white shadow-lg rounded-lg p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
                {{ props.userRoleId ? "Editar UserRole" : "Crear UserRole" }}
            </h2>
            <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700">Usuario:</label>
                    <select v-model="userRole.user_id"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        :disabled="props.userRoleId">
                        <option value="" disabled>Seleccione un usuario</option>
                        <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }} ({{ u.email }})</option>
                    </select>
                    <span class="text-red-500 text-sm" v-if="errors.user_id">{{ errors.user_id }}</span>
                </div>
                <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700">Rol:</label>
                    <select v-model="userRole.role_id"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option value="" disabled>Seleccione un rol</option>
                        <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
                    </select>
                    <span class="text-red-500 text-sm" v-if="errors.role_id">{{ errors.role_id }}</span>
                </div>
                <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700">Fecha de inicio:</label>
                    <input v-model="userRole.startAt" type="date" @input="validateField('startAt')"
                        @blur="validateField('startAt')"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        :disabled="props.userRoleId" />
                    <span class="text-red-500 text-sm" v-if="errors.startAt">{{ errors.startAt }}</span>
                </div>
                <div class="w-full">
                    <label class="block text-sm font-medium text-gray-700">Fecha de fin:</label>
                    <input v-model="userRole.endAt" type="date" @input="validateField('endAt')"
                        @blur="validateField('endAt')"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        :disabled="props.userRoleId" />
                    <span class="text-red-500 text-sm" v-if="errors.endAt">{{ errors.endAt }}</span>
                </div>
                <div class="col-span-1 md:col-span-2">
                    <button type="submit" :disabled="Object.keys(errors).length > 0 || isSubmitting"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
                        {{ isSubmitting ? "Enviando..." : props.userRoleId ? "Actualizar" : "Crear" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
