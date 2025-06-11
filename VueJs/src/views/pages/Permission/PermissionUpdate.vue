<template>
    <div>
        <h1>Crear Perfil</h1> 
        <PermissionForm
            v-if="route.params.id"
            :permissionId="parseInt(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)"
            @submit="updatePermission"
        />
    </div>
</template>

<script setup lang="ts">    
import { useRoute } from 'vue-router';
// Update the import path if the folder name is 'permissions' instead of 'permission'
import PermissionForm from '@/components/permission/PermissionForm.vue';

const route = useRoute();

function updatePermission(permissionData: any) {
    // Implement the logic to update the permission here
    // For example, call an API or update state
    console.log('Updating permission:', permissionData);
}
</script>
