<script setup lang="ts">
import SecurityQuestionForm from "../../../components/securityQuestion/SecurityQuestionForm.vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Obtener el ID de la pregunta desde los parámetros de la ruta
const questionId = route.params.id ? Number(route.params.id) : undefined;
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        Editar Pregunta de Seguridad
      </h2>

      <!-- Llamar al componente SecurityQuestionForm y pasar el questionId -->
      <SecurityQuestionForm :questionId="questionId" />
    </div>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>