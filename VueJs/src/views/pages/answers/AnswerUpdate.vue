<script setup lang="ts">
import AnswerForm from "../../../components/answer/AnswerForm.vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Obtener el ID de la respuesta desde los parámetros de la ruta
const answerId = route.params.id ? Number(route.params.id) : undefined;
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        Editar Respuesta
      </h2>

      <!-- Llamar al componente AnswerForm y pasar el answerId -->
      <AnswerForm :answerId="answerId" />
    </div>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>