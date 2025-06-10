<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        Crear Dispositivo
      </h1>
      <DeviceForm @submit="createDevice" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DeviceForm from "../../../components/device/DeviceForm.vue";
import DeviceService from "../../../service/DeviceService";

async function createDevice(deviceData: any) {
  try {
    const response = await DeviceService.createDevice(deviceData);
    if (response.status === 201) {
      console.log("Dispositivo creado con éxito:", response.data);
      // Aquí puedes redirigir o mostrar un mensaje de éxito
    } else {
      console.error("Error al crear el dispositivo:", response);
    }
  } catch (error) {
    console.error("Error inesperado al crear el dispositivo:", error);
  }
}
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>