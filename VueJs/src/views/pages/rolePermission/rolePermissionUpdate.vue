<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        Editar Permiso de Rol
      </h2>

      <!-- Llamar al componente RolePermissionForm y pasar el rolePermissionId -->
      <RolePermissionForm :rolePermissionId="rolePermissionId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import RolePermissionForm from "../../../components/rolePermission/RolePermissionForm.vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Obtener el ID del permiso de rol desde los parámetros de la ruta
const rolePermissionId = route.params.id ? Number(route.params.id) : undefined;
</script>



