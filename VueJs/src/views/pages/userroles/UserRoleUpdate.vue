<template>
    <div class="p-8">
        <h1 class="text-2xl font-bold mb-4">Actualizar UserRole</h1>
        <UserRoleForm :userRoleId="Number($route.params.id)" />
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import UserRoleForm from '../../../components/UserRole/UserRoleForm.vue';
const $route = useRoute();
</script>
