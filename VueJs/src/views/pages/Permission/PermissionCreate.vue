<template>
    <div>
        <h1>Crear Perfil</h1>
        <ProfileForm @submit="createProfile" />
    </div>
</template>

<script setup lang="ts">
import ProfileForm from '../../../components/permission/PermissionFrom.vue';

function createProfile(profileData: any) {
    // Implement profile creation logic here
    console.log('Profile data submitted:', profileData);
}
</script>

