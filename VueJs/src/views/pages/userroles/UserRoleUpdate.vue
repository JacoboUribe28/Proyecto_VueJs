<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="w-full bg-white shadow-lg rounded-lg p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
                Editar Rol de Usuario
            </h2>
            <UserRoleForm :userRoleId="Number($route.params.id)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import UserRoleForm from '../../../components/UserRole/UserRoleForm.vue';
const $route = useRoute();
</script>
