<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="w-full bg-white shadow-lg rounded-lg p-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
                Lista de Roles de Usuario
            </h1>
            <router-link to="/userrole/create"
                class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4">
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Crear Rol de Usuario
            </router-link>
            <div v-if="loading" class="flex justify-center items-center h-32">
                <span class="text-gray-500">Cargando roles de usuario...</span>
            </div>
            <div v-else>
                <div v-if="errorMsg" class="mb-4 text-red-600">{{ errorMsg }}</div>
                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white border border-gray-300 rounded-lg"
                        aria-label="Lista de roles de usuario">
                        <thead class="bg-gray-200 text-gray-700">
                            <tr>
                                <th class="px-4 py-2 border">Usuario</th>
                                <th class="px-4 py-2 border">Rol</th>
                                <th class="px-4 py-2 border">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="userrole in userroles" :key="userrole.id" class="hover:bg-gray-100 transition">
                                <td class="px-4 py-2 border">{{ getUserName(userrole.user_id ?? 0) }}</td>
                                <td class="px-4 py-2 border">{{ getRoleName(userrole.role_id ?? 0) }}</td>
                                <td class="px-4 py-2 border flex space-x-4">
                                    <router-link :to="`/userrole/view/${userrole.id}`"
                                        class="text-green-600 hover:text-green-800 flex items-center">
                                        <EyeIcon class="w-5 h-5 mr-1" />Ver
                                    </router-link>
                                    <router-link :to="`/userrole/update/${userrole.id}`"
                                        class="text-blue-600 hover:text-blue-800 flex items-center">
                                        <PencilIcon class="w-5 h-5 mr-1" />Editar
                                    </router-link>
                                    <button @click="deleteUserRole(userrole.id ?? 0)"
                                        class="text-red-600 hover:text-red-800 flex items-center">
                                        <TrashIcon class="w-5 h-5 mr-1" />Eliminar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon } from 'lucide-vue-next';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import type { Role } from '../../../models/Role';
import type { User } from '../../../models/User';
import type { UserRole } from '../../../models/UsrRole';
import RoleService from '../../../service/RoleService';
import UserRoleService from '../../../service/UserRoleService';
import UserService from '../../../service/UserService';

const userroles = ref<UserRole[]>([]);
const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const loading = ref(true);
const errorMsg = ref('');

const fetchUserRoles = async (): Promise<void> => {
    loading.value = true;
    errorMsg.value = '';
    try {
        const [userRoleRes, userRes, roleRes] = await Promise.all([
            UserRoleService.getUserRoles(),
            UserService.getUsers(),
            RoleService.getRoles()
        ]);
        userroles.value = userRoleRes.data as UserRole[];
        users.value = userRes.data as User[];
        roles.value = roleRes.data as Role[];
    } catch (error) {
        console.error('Error al obtener los roles de usuario, usuarios o roles:', error);
        errorMsg.value = 'No se pudieron cargar los datos. Intenta nuevamente.';
    } finally {
        loading.value = false;
    }
};

const getUserName = (userId?: number): string => {
    if (!userId) return 'Sin usuario';
    const user = users.value.find((u) => u.id === userId);
    return user ? `${user.name} (${user.email})` : 'Sin usuario';
};

const getRoleName = (roleId?: number): string => {
    if (!roleId) return 'Sin rol';
    const role = roles.value.find((r) => r.id === roleId);
    return role && role.name ? role.name : 'Sin rol';
};

const deleteUserRole = async (id?: number): Promise<void> => {
    if (!id) return;
    try {
        await UserRoleService.deleteUserRole(id);
        userroles.value = userroles.value.filter((ur: UserRole) => ur.id !== id);
        Swal.fire({
            title: 'Éxito',
            text: 'Rol de usuario eliminado con éxito ✅',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000
        });
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: '❌ Error al eliminar el rol de usuario.',
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3000
        });
    }
};

onMounted(fetchUserRoles);
</script>
