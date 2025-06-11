<template>
    <div class="p-8">
        <h1 class="text-2xl font-bold mb-4">Actualizar Rol</h1>
        <RoleForm :roleId="Number($route.params.id)" />
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import RoleForm from '../../../components/Role/RoleForm.vue';
const $route = useRoute();
</script>
