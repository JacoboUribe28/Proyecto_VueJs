<script setup lang="ts">
import { SecurityQuestionValidator } from "../../utils/SecurityQuestionValidators";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from 'vue-router';
import SecurityQuestionService from '../../service/SecurityQuestionService';

const props = defineProps<{ questionId?: number }>();

const question = reactive({
  name: "",
  description: "",
});

const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const router = useRouter();

const validateField = (field: keyof typeof question) => {
  const result = SecurityQuestionValidator.validateField(field, question[field]);

  if (!result.success) {
    errors[field] = result.error.errors[0].message;
  } else {
    delete errors[field]; // Borra el error si es válido
  }
};

const validateAllFields = () => {
  Object.keys(question).forEach((field) => {
    validateField(field as keyof typeof question);
  });
};

// Cargar pregunta si se pasa un questionId
onMounted(async () => {
  if (props.questionId) {
    try {
      const response = await SecurityQuestionService.getSecurityQuestion(props.questionId);
      if (response.status == 200) {
        let fetchedQuestion = response.data;
        Object.assign(question, fetchedQuestion);
      }
    } catch (error) {
      console.error("Error al cargar la pregunta de seguridad:", error);
    }
  }
});

// Enviar formulario (crear o actualizar pregunta)
const submitForm = async () => {
  validateAllFields();

  if (Object.keys(errors).length > 0) return;

  isSubmitting.value = true;

  try {
    let response;
    if (props.questionId) {
      response = await SecurityQuestionService.updateSecurityQuestion(props.questionId, question);
    } else {
      response = await SecurityQuestionService.createSecurityQuestion(question);
    }

    if (response.status === 200 || response.status === 201) {
      Swal.fire({
        title: 'Éxito',
        text: props.questionId ? 'Pregunta actualizada con éxito ✅' : 'Pregunta creada con éxito ✅',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: `❌ Código ${response.status}: ${typeof response.data === 'object' && 'message' in response.data ? (response.data as any).message : 'Ocurrió un error'}`,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        timer: 3000
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: '❌ Error inesperado en la operación.',
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
  router.push('/security-questions');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        {{ props.questionId ? "Editar Pregunta de Seguridad" : "Crear Pregunta de Seguridad" }}
      </h2>

      <form @submit.prevent="submitForm" class="grid grid-cols-1 gap-6">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Nombre:</label>
          <input v-model="question.name" type="text" @input="validateField('name')" @blur="validateField('name')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <span class="text-red-500 text-sm" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Descripción:</label>
          <textarea v-model="question.description" @input="validateField('description')" @blur="validateField('description')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
          <span class="text-red-500 text-sm" v-if="errors.description">{{ errors.description }}</span>
        </div>

        <div class="col-span-1">
          <button type="submit" :disabled="Object.keys(errors).length > 0 || isSubmitting"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
            {{ isSubmitting ? "Enviando..." : props.questionId ? "Actualizar" : "Crear" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>