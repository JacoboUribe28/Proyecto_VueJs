<template>
  <div>
    <h1>Crear Perfil</h1>
    <ProfileForm @submit="createProfile" />
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '@/store/ProfileStore';
import { useRouter } from 'vue-router';
import ProfileForm from '@/components/profile/ProfileForm.vue';

const store = useProfileStore();
const router = useRouter();

const createProfile = async (newProfile: { phone: string; photo: string }) => {
  const response = await store.addProfile(newProfile);
  // Se asume que la respuesta exitosa es 200 o 201
  if (response.status === 200 || response.status === 201) {
    router.push('/profile/list');
  }
};
</script>
