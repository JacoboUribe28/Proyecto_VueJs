<template>
    <div>
        <h1>Crear Pregunta de Seguridad</h1>
        <SecurityQuestionForm @submit="createQuestion" />
    </div>
</template>

<script setup lang="ts">
import SecurityQuestionForm from '../../../components/securityQuestion/SecurityQuestionForm.vue';
import SecurityQuestionService from '../../../service/SecurityQuestionService';

async function createQuestion(questionData: any) {
    try {
        const response = await SecurityQuestionService.createSecurityQuestion(questionData);
        if (response.status === 201) {
            console.log('Pregunta de seguridad creada con éxito:', response.data);
            // Aquí puedes redirigir o mostrar un mensaje de éxito
        } else {
            console.error('Error al crear la pregunta de seguridad:', response);
        }
    } catch (error) {
        console.error('Error inesperado al crear la pregunta de seguridad:', error);
    }
}
</script>