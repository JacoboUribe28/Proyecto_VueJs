<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="w-full bg-white shadow-lg rounded-lg p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
                Crear Permiso
            </h2>
            <PermissionForm />
        </div>
    </div>
</template>

<script setup lang="ts">
import PermissionForm from '../../../components/permission/PermissionFrom.vue';
</script>

