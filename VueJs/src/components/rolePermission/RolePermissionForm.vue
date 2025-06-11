<script setup lang="ts">
import { RolePermissionValidator } from "../../utils/RolePermissionValidators";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import RolePermissionService from "../../service/RolePermissionServices";
import RoleService from "../../service/RoleService";
import PermissionService from "../../service/PermissionService";

const props = defineProps<{ rolePermissionId?: number }>();

const rolePermission = reactive({
  startAt: undefined as string | Date | undefined,
  endAt: undefined as string | Date | undefined,
  role_id: undefined as number | undefined,
  permission_id: undefined as number | undefined,
});

const roles = ref<{ id: number; name: string }[]>([]);
const permissions = ref<{ id: number; name: string }[]>([]);
const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const router = useRouter();

const validateField = (field: "role_id" | "permission_id" | "startAt" | "endAt") => {
  let result;
  if (field === "role_id" || field === "permission_id") {
    result = RolePermissionValidator.validateField(field, rolePermission[field]);
  } else if (field === "startAt" || field === "endAt") {
    result = RolePermissionValidator.validateField(field, rolePermission[field]);
  }

  if (result && !result.success) {
    errors[field] = result.error.errors[0].message;
  } else {
    delete errors[field];
  }
};

const validateAllFields = () => {
  Object.keys(rolePermission).forEach((field) => {
    validateField(field as keyof typeof rolePermission);
  });
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

const fetchPermissions = async () => {
  try {
    const response = await PermissionService.getPermissions();
    if (response.status === 200) {
      permissions.value = response.data.map((perm: any) => ({ id: perm.id, name: perm.name }));
    }
  } catch (error) {
    console.error("Error al obtener los permisos:", error);
  }
};

onMounted(async () => {
  await fetchRoles();
  await fetchPermissions();

  if (props.rolePermissionId) {
    try {
      const response = await RolePermissionService.getRolePermission(props.rolePermissionId);
      if (response.status === 200) {
        // Convert startAt and endAt to the expected type if necessary
        Object.assign(rolePermission, {
          ...response.data,
          startAt: response.data.startAt ? response.data.startAt : undefined,
          endAt: response.data.endAt ? response.data.endAt : undefined,
        });
      }
    } catch (error) {
      console.error("Error al cargar el RolePermission:", error);
    }
  }
});

const submitForm = async () => {
  validateAllFields();

  if (Object.keys(errors).length > 0) return;

  isSubmitting.value = true;

  try {
    let response;

    if (props.rolePermissionId) {
      response = await RolePermissionService.updateRolePermission(
        props.rolePermissionId,
        rolePermission
      );
    } else {
      if (!rolePermission.role_id || !rolePermission.permission_id) {
        throw new Error("Debe seleccionar un rol y un permiso.");
      }

      response = await RolePermissionService.createRolePermission(
        rolePermission.startAt,
        rolePermission.endAt,
        rolePermission.role_id,
        rolePermission.permission_id
      );
    }

    if ([200, 201].includes(response.status)) {
      Swal.fire({
        title: "Éxito",
        text: props.rolePermissionId
          ? "RolePermission actualizado con éxito ✅"
          : "RolePermission creado con éxito ✅",
        icon: "success",
        confirmButtonText: "OK",
        timer: 3000,
      });
    } else {
      Swal.fire({
        title: "Error",
        text: `❌ Código ${response.status}: ${
          typeof response.data === "object" && "message" in response.data
            ? response.data.message
            : "Ocurrió un error"
        }`,
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
        timer: 3000,
      });
    }
  } catch (error: any) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "❌ Error inesperado en la operación.",
      icon: "error",
      confirmButtonText: "OK",
      timer: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }

  router.push("/role-permissions");
};
</script>


<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        {{ props.rolePermissionId ? "Editar RolePermission" : "Crear RolePermission" }}
      </h2>

      <form @submit.prevent="submitForm" class="grid grid-cols-1 gap-6">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Fecha de Inicio:</label>
          <input
            v-model="rolePermission.startAt"
            type="date"
            @input="validateField('startAt')"
            @blur="validateField('startAt')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <span class="text-red-500 text-sm" v-if="errors.startAt">{{ errors.startAt }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Fecha de Fin:</label>
          <input
            v-model="rolePermission.endAt"
            type="date"
            @input="validateField('endAt')"
            @blur="validateField('endAt')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <span class="text-red-500 text-sm" v-if="errors.endAt">{{ errors.endAt }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Rol:</label>
          <select
            v-model="rolePermission.role_id"
            @change="validateField('role_id')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Seleccione un rol</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
          <span class="text-red-500 text-sm" v-if="errors.role_id">{{ errors.role_id }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Permiso:</label>
          <select
            v-model="rolePermission.permission_id"
            @change="validateField('permission_id')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Seleccione un permiso</option>
            <option v-for="permission in permissions" :key="permission.id" :value="permission.id">
              {{ permission.name }}
            </option>
          </select>
          <span class="text-red-500 text-sm" v-if="errors.permission_id">{{ errors.permission_id }}</span>
        </div>

        <div class="col-span-1">
          <button
            type="submit"
            :disabled="Object.keys(errors).length > 0 || isSubmitting"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {{ isSubmitting ? "Enviando..." : props.rolePermissionId ? "Actualizar" : "Crear" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>