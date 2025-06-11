<template>
    <div class="p-8">
        <h1 class="text-2xl font-bold mb-4">Actualizar Contraseña</h1>
        <PasswordForm :passwordId="Number($route.params.id)" />
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import PasswordForm from '../../../components/Passworrd/PasswordForm.vue';
const $route = useRoute();
</script>
