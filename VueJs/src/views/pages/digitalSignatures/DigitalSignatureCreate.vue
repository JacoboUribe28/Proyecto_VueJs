<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        Crear Firma Digital
      </h1>
      <DigitalSignatureForm @submit="createDigitalSignature" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DigitalSignatureForm from "../../../components/digitalSignature/DigitalSignatureForm.vue";
import DigitalSignatureService from "../../../service/DigitalSignatureService";

async function createDigitalSignature(signatureData: any) {
  try {
    // Asegúrate de obtener el userId adecuado, aquí se usa un ejemplo estático
    const userId = 1; // Reemplaza esto con el userId real según tu lógica
    const response = await DigitalSignatureService.createDigitalSignature(userId, signatureData);
    if (response.status === 201) {
      console.log("Firma digital creada con éxito:", response.data);
      // Aquí puedes redirigir o mostrar un mensaje de éxito
    } else {
      console.error("Error al crear la firma digital:", response);
    }
  } catch (error) {
    console.error("Error inesperado al crear la firma digital:", error);
  }
}
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>