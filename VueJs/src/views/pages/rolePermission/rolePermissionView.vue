<script setup lang="ts">
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import RolePermissionService from "../../../service/RolePermissionServices";
import RoleService from "../../../service/RoleService";
import PermissionService from "../../../service/PermissionService";

interface RolePermission {
  id: number;
  role_id: number;
  permission_id: number;
  startAt?: string;
  endAt?: string;
}

const rolePermissions = ref<RolePermission[]>([]);
const roles = ref<{ id: number; name: string }[]>([]);
const permissions = ref<{ id: number; method: string }[]>([]);

const fetchRolePermissions = async () => {
  try {
    const response = await RolePermissionService.getRolePermissions();
    if (response.status === 200) {
      rolePermissions.value = response.data;
    }
  } catch (error) {
    console.error("Error al obtener los permisos de roles:", error);
    Swal.fire({
      title: "Error",
      text: "No se pudieron cargar los permisos de roles",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

const fetchRolesAndPermissions = async () => {
  try {
    // Cargar roles
    const roleResponse = await RoleService.getRoles();
    if (roleResponse.status === 200) {
      roles.value = roleResponse.data;
    }
    
    // Cargar permisos
    const permissionResponse = await PermissionService.getPermissions();
    if (permissionResponse.status === 200) {
      permissions.value = permissionResponse.data;
    }
  } catch (error) {
    console.error("Error al obtener roles o permisos:", error);
    Swal.fire({
      title: "Error",
      text: "No se pudieron cargar los roles o permisos",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

onMounted(async () => {
  await Promise.all([fetchRolesAndPermissions(), fetchRolePermissions()]);
});

const deleteRolePermission = async (id: number) => {
  try {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await RolePermissionService.deleteRolePermission(id);
      rolePermissions.value = rolePermissions.value.filter(
        (rolePermission) => rolePermission.id !== id
      );
      Swal.fire({
        title: "Éxito",
        text: "Permiso de rol eliminado con éxito ✅",
        icon: "success",
        timer: 2000,
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: "❌ Error al eliminar el permiso de rol",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

const getRoleName = (roleId: number) => {
  const role = roles.value.find((role) => role.id === roleId);
  return role ? role.name : "Desconocido";
};

const getPermissionMethod = (permissionId: number) => {
  const permission = permissions.value.find(
    (permission) => permission.id === permissionId
  );
  return permission ? permission.method : "Desconocido";
};

const formatDate = (date: string | undefined) => {
  if (!date) return "No especificada";
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Lista de Permisos de Roles</h1>
        <router-link
          to="/role-permission/create"
          class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircleIcon class="w-5 h-5 mr-2" />
          Crear Permiso de Rol
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-2 border">ID</th>
              <th class="px-4 py-2 border">Rol</th>
              <th class="px-4 py-2 border">Permiso</th>
              <th class="px-4 py-2 border">Fecha Inicio</th>
              <th class="px-4 py-2 border">Fecha Fin</th>
              <th class="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="rolePermission in rolePermissions"
              :key="rolePermission.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-2 border">{{ rolePermission.id }}</td>
              <td class="px-4 py-2 border">{{ getRoleName(rolePermission.role_id) }}</td>
              <td class="px-4 py-2 border">{{ getPermissionMethod(rolePermission.permission_id) }}</td>
              <td class="px-4 py-2 border">{{ formatDate(rolePermission.startAt) }}</td>
              <td class="px-4 py-2 border">{{ formatDate(rolePermission.endAt) }}</td>
              <td class="px-4 py-2 border">
                <div class="flex justify-center space-x-2">
                  <router-link
                    :to="`/role-permission/view/${rolePermission.id}`"
                    class="text-green-600 hover:text-green-800 transition-colors"
                    title="Ver detalles"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </router-link>
                  <router-link
                    :to="`/role-permission/edit/${rolePermission.id}`"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Editar"
                  >
                    <PencilIcon class="w-5 h-5" />
                  </router-link>
                  <button
                    @click="deleteRolePermission(rolePermission.id)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="rolePermissions.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                No hay permisos de roles registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>