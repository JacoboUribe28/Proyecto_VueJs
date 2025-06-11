<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Roles</h1>

            <router-link to="/role/create"
                class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4">
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Crear Rol
            </router-link>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead class="bg-gray-200 text-gray-700">
                        <tr>
                            <th class="px-4 py-2 border">Nombre</th>
                            <th class="px-4 py-2 border">Descripción</th>
                            <th class="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="role in roles" :key="role.id" class="hover:bg-gray-100 transition">
                            <td class="px-4 py-2 border">{{ role.name }}</td>
                            <td class="px-4 py-2 border">{{ role.description }}</td>
                            <td class="px-4 py-2 border flex space-x-4">
                                <router-link :to="`/role/view/${role.id}`"
                                    class="text-green-600 hover:text-green-800 flex items-center">
                                    <EyeIcon class="w-5 h-5 mr-1" />
                                    Ver
                                </router-link>
                                <router-link :to="`/role/update/${role.id}`"
                                    class="text-blue-600 hover:text-blue-800 flex items-center">
                                    <PencilIcon class="w-5 h-5 mr-1" />
                                    Editar
                                </router-link>
                                <button @click="deleteRole(role.id)"
                                    class="text-red-600 hover:text-red-800 flex items-center">
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

<script setup lang="ts">
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import RoleService from '../../../service/RoleService';

const roles = ref<{ id: number; name: string; description: string }[]>([]);

const fetchRoles = async () => {
    try {
        const response = await RoleService.getRoles();
        if (response.status === 200) {
            roles.value = response.data
                .filter((r: any) => typeof r.id === 'number' && r.name && r.description)
                .map((r: any) => ({
                    id: r.id as number,
                    name: r.name,
                    description: r.description
                }));
        }
    } catch (error) {
        console.error("Error al obtener los roles:", error);
    }
};

const deleteRole = async (id: number) => {
    try {
        await RoleService.deleteRole(id);
        roles.value = roles.value.filter((role) => role.id !== id);
        Swal.fire({
            title: 'Éxito',
            text: 'Rol eliminado con éxito ✅',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000
        });
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: '❌ Error al eliminar el rol.',
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3000
        });
    }
};

onMounted(fetchRoles);
</script>
