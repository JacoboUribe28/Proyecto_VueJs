<template>
    <div>
        <h1>Crear Perfil</h1> 
        <PermissionFrom v-if="route.params.id" :permissionId="parseInt(route.params.id)" @submit="updatePermission" />
    </div>
</template>

<script setup lang="ts">    
import { useRoute } from 'vue-router';
import PermissionFrom from '@/components/permission/PermissionFrom.vue';
</script>
