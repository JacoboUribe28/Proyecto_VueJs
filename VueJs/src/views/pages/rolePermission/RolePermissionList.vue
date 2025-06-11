<script setup lang="ts">
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import RolePermissionService from "../../../service/RolePermissionServices";
import RoleService from "../../../service/RoleService";
import PermissionService from "../../../service/PermissionService";

const rolePermissions = ref<{ id: number; role_id: number; permission_id: number }[]>([]);
const roles = ref<{ id: number; name: string }[]>([]);
const permissions = ref<{ id: number; name: string }[]>([]);

const fetchRolePermissions = async () => {
  try {
    const response = await RolePermissionService.getRolePermissions();
    if (response.status === 200) {
      rolePermissions.value = response.data.map((rolePermission: any) => ({
        id: rolePermission.id,
        role_id: rolePermission.role_id,
        permission_id: rolePermission.permission_id,
      }));
    }
  } catch (error) {
    console.error("Error al obtener los permisos de roles:", error);
  }
};

const fetchRolesAndPermissions = async () => {
  try {
    const roleResponse = await RoleService.getRoles();
    if (roleResponse.status === 200) {
      roles.value = roleResponse.data.map((role: any) => ({ id: role.id, name: role.name }));
    }

    const permissionResponse = await PermissionService.getPermissions();
    if (permissionResponse.status === 200) {
      permissions.value = permissionResponse.data.map((permission: any) => ({ id: permission.id, name: permission.name }));
    }
  } catch (error) {
    console.error("Error al obtener roles o permisos:", error);
  }
};

onMounted(async () => {
  await fetchRolesAndPermissions();
  await fetchRolePermissions();
});

const deleteRolePermission = async (id: number) => {
  try {
    await RolePermissionService.deleteRolePermission(id);
    rolePermissions.value = rolePermissions.value.filter((rolePermission) => rolePermission.id !== id);
    Swal.fire({
      title: "Éxito",
      text: "Permiso de rol eliminado con éxito ✅",
      icon: "success",
      confirmButtonText: "OK",
      timer: 3000,
    });
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: "❌ Error al eliminar el permiso de rol.",
      icon: "error",
      confirmButtonText: "OK",
      timer: 3000,
    });
  }
};

const getRoleName = (roleId: number) => {
  const role = roles.value.find((role) => role.id === roleId);
  return role ? role.name : "Desconocido";
};

const getPermissionName = (permissionId: number) => {
  const permission = permissions.value.find((permission) => permission.id === permissionId);
  return permission ? permission.name : "Desconocido";
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Permisos de Roles</h1>

      <router-link
        to="/role-permission/create"
        class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
      >
        <PlusCircleIcon class="w-5 h-5 mr-2" />
        Crear Permiso de Rol
      </router-link>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-2 border">Rol</th>
              <th class="px-4 py-2 border">Permiso</th>
              <th class="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="rolePermission in rolePermissions"
              :key="rolePermission.id"
              class="hover:bg-gray-100 transition"
            >
              <td class="px-4 py-2 border">{{ getRoleName(rolePermission.role_id) }}</td>
              <td class="px-4 py-2 border">{{ getPermissionName(rolePermission.permission_id) }}</td>
              <td class="px-4 py-2 border">
                <router-link
                  :to="`/role-permission/view/${rolePermission.id}`"
                  class="text-green-600 hover:underline mr-2"
                >
                  <EyeIcon class="w-5 h-5 inline" />
                </router-link>
                <router-link
                  :to="`/role-permission/edit/${rolePermission.id}`"
                  class="text-blue-600 hover:underline mr-2"
                >
                  <PencilIcon class="w-5 h-5 inline" />
                </router-link>
                <button
                  @click="deleteRolePermission(rolePermission.id)"
                  class="text-red-600 hover:underline"
                >
                  <TrashIcon class="w-5 h-5 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo similar al de AnswerList para mantener consistencia */
.bg-gradient-to-r {
  background: linear-gradient(to right, #ebf8ff, #d1fae5);
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.text-gray-900 {
  color: #1a202c;
}

.text-gray-800 {
  color: #2d3748;
}

.text-gray-600 {
  color: #718096;
}

.text-lg {
  font-size: 1.125rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.font-extrabold {
  font-weight: 800;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.p-6 {
  padding: 1.5rem;
}

.p-8 {
  padding: 2rem;
}

.pb-6 {
  padding-bottom: 1.5rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-y-10 > * + * {
  margin-top: 2.5rem;
}
</style>