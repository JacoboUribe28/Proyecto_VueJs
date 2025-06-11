<script setup lang="ts">
import DigitalSignatureForm from "../../../components/digitalSignature/DigitalSignatureForm.vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Obtener el ID de la firma digital desde los parámetros de la ruta
const signatureId = route.params.id ? Number(route.params.id) : undefined;
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        Editar Firma Digital
      </h2>

      <!-- Llamar al componente DigitalSignatureForm y pasar el signatureId -->
      <DigitalSignatureForm :signatureId="signatureId" />
    </div>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>