<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        Crear Respuesta
      </h1>
      <AnswerForm @submit="createAnswer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AnswerForm from "../../../components/answer/AnswerForm.vue";
import AnswerService from "../../../service/AnswerService";

async function createAnswer(answerData: any) {
  try {
    const response = await AnswerService.createAnswer(answerData);
    if (response.status === 201) {
      console.log("Respuesta creada con éxito:", response.data);
      // Aquí puedes redirigir o mostrar un mensaje de éxito
    } else {
      console.error("Error al crear la respuesta:", response);
    }
  } catch (error) {
    console.error("Error inesperado al crear la respuesta:", error);
  }
}
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>