<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        Crear Permiso de Rol
      </h1>
      <RolePermissionForm @submit="createRolePermission" />
    </div>
  </div>
</template>
<script setup lang="ts">
import RolePermissionForm from "../../../components/rolePermission/RolePermissionForm.vue";
import RolePermissionService from "../../../service/RolePermissionServices";

async function createRolePermission(rolePermissionData: any) {
  try {
    const response = await RolePermissionService.createRolePermission(
      rolePermissionData.roleId,
      rolePermissionData.permissionId,
      rolePermissionData
    );
    if (response.status === 201) {
      console.log("Permiso de rol creado con éxito:", response.data);
      // Aquí puedes redirigir o mostrar un mensaje de éxito
    } else {
      console.error("Error al crear el permiso de rol:", response);
    }
  } catch (error) {
    console.error("Error inesperado al crear el permiso de rol:", error);
  }
}
</script>

