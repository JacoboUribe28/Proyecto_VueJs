<template>
    <div class="p-8">
        <h1 class="text-2xl font-bold mb-4">Actualizar Dirección</h1>
        <AddressForm :addressId="Number($route.params.id)" />
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import AddressForm from '../../../components/Address/AddressForm.vue';
const $route = useRoute();
</script>
