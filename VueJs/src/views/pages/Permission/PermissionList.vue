<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Permisos</h1>            <router-link to="/permission/create"
                class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4">
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Crear Permiso
            </router-link>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300 rounded-lg">                    <thead class="bg-gray-200 text-gray-700">
                        <tr>
                            <th class="px-4 py-2 border">ID</th>
                            <th class="px-4 py-2 border">Método</th>
                            <th class="px-4 py-2 border">URL</th>
                            <th class="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="permission in permissions" :key="permission.id" class="hover:bg-gray-100 transition">
                            <td class="px-4 py-2 border">{{ permission.id }}</td>
                            <td class="px-4 py-2 border">{{ permission.method }}</td>
                            <td class="px-4 py-2 border">{{ permission.url }}</td>
                            <td class="px-4 py-2 border flex space-x-4">                                <router-link :to="`/permission/view/${permission.id}`"
                                    class="text-green-600 hover:text-green-800 flex items-center">
                                    <EyeIcon class="w-5 h-5 mr-1" />
                                    Ver
                                </router-link>
                                <router-link :to="`/permission/update/${permission.id}`"
                                    class="text-blue-600 hover:text-blue-800 flex items-center">
                                    <PencilIcon class="w-5 h-5 mr-1" />
                                    Editar
                                </router-link>
                                <button @click="deletePermission(permission.id)"
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
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import PermissionService from '../../../service/PermissionService';

const permissions = ref<{ id: number; method: string; url: string }[]>([]);

const fetchPermissions = async () => {
  try {
    const response = await PermissionService.getPermissions();
    if (response.status === 200) {
      permissions.value = response.data
        .filter((p: any) => typeof p.id === 'number' && p.method && p.url)
        .map((p: any) => ({
          id: p.id as number,
          method: p.method,
          url: p.url
        }));
    }
  } catch (error) {
    console.error("Error al obtener los permisos:", error);
  }
};

const deletePermission = async (id: number) => {
  try {
    await PermissionService.deletePermission(id);
    permissions.value = permissions.value.filter((permission) => permission.id !== id);
    Swal.fire({
      title: 'Éxito',
      text: 'Permiso eliminado con éxito ✅',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 3000
    });
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: '❌ Error al eliminar el permiso.',
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 3000
    });
  }
};

onMounted(fetchPermissions);
</script>