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
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead class="bg-gray-200 text-gray-700">
                        <tr>
                            <th class="px-4 py-2 border">Usuario</th>
                            <th class="px-4 py-2 border">Rol</th>
                            <th class="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="userrole in userroles" :key="userrole.id" class="hover:bg-gray-100 transition">
                            <td class="px-4 py-2 border">{{ getUserName(userrole.user_id) }}</td>
                            <td class="px-4 py-2 border">{{ getRoleName(userrole.role_id) }}</td>
                            <td class="px-4 py-2 border flex space-x-4">
                                <router-link :to="`/userrole/view/${userrole.id}`"
                                    class="text-green-600 hover:text-green-800 flex items-center">
                                    <EyeIcon class="w-5 h-5 mr-1" />Ver
                                </router-link>
                                <router-link :to="`/userrole/update/${userrole.id}`"
                                    class="text-blue-600 hover:text-blue-800 flex items-center">
                                    <PencilIcon class="w-5 h-5 mr-1" />Editar
                                </router-link>
                                <button @click="deleteUserRole(userrole.id)"
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
</template>

<script setup lang="ts">
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import UserRoleService from '../../../service/UserRoleService';
import UserService from '../../../service/UserService';
import RoleService from '../../../service/RoleService';

const userroles = ref([]);
const users = ref([]);
const roles = ref([]);

const fetchUserRoles = async () => {
    try {
        const [userRoleRes, userRes, roleRes] = await Promise.all([
            UserRoleService.getUserRoles(),
            UserService.getUsers(),
            RoleService.getRoles()
        ]);
        userroles.value = userRoleRes.data;
        users.value = userRes.data;
        roles.value = roleRes.data;
    } catch (error) {
        console.error('Error al obtener los roles de usuario, usuarios o roles:', error);
    }
};

const getUserName = (userId) => {
    const user = users.value.find((u) => u.id === userId);
    return user ? `${user.name} (${user.email})` : 'Sin usuario';
};

const getRoleName = (roleId) => {
    const role = roles.value.find((r) => r.id === roleId);
    return role ? role.name : 'Sin rol';
};

const deleteUserRole = async (id) => {
    try {
        await UserRoleService.deleteUserRole(id);
        userroles.value = userroles.value.filter((ur) => ur.id !== id);
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
