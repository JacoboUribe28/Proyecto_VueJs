<template>
    <div>
        <h1>Editar Perfil</h1>
        <ProfileForm v-if="route.params.id" :profileId="parseInt(route.params.id)" @submit="updateProfile" />
    </div>


</template>

<script>    
import {useRoute} from 'vue-router'
import ProfileForm from '@/components/profile/ProfileForm';
const route = useRoute();
</script>