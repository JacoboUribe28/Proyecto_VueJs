<template>
    <div>
        <h1>Crear Perfil</h1>
        <sessionForm v-if="route.params.id" :sessionId="parseInt(route.params.id)" @submit="updateSession" />
    </div>

</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import SessionForm from '@/components/session/SessionForm.vue' 
</script>