<template>    import PermissionForm from '../../../components/permission/PermissionFrom.vue';div class="min-h-screen bg-gray-100 p-6">
        <div class="w-full bg-white shadow-lg rounded-lg p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Actualizar Permiso</h2>
            <PermissionForm
                v-if="route.params.id"
                :permissionId="parseInt(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">    
import { useRoute } from 'vue-router';
// Update the import path if the folder name is 'permissions' instead of 'permission'
import PermissionForm from '@/components/permission/PermissionFrom.vue';

const route = useRoute();
</script>
