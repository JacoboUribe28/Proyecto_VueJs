<template>
    <div>
        <h1>Editar Permiso de Rol</h1>
        <rolPermissionForm v-if="route.params.id" :roleId="parseInt(route.params.id)" @submit="updateRolePermission" />
    </div>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router';
import RolePermissionForm from '@/components/rolePermission/RolePermissionForm.vue';
</script>



