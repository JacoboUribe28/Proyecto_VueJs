<template>
    <div>
        <h1>Crear Usuario</h1>
        <UserForm @submit="createUser" />
    </div>
</template>

<script setup lang="ts">
import UserForm from '../../../components/users/UserForm.vue';

function createUser(userData: any) {
    // Implement user creation logic here
    console.log('User data submitted:', userData);
}
</script>