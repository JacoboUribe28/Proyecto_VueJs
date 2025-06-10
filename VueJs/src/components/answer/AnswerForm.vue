<script setup lang="ts">
import { AnswerValidator } from "../../utils/AnswerValidators";
import Swal from "sweetalert2";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AnswerService from "../../service/AnswerService";
import UserService from "../../service/UserService";
import SecurityQuestionService from "../../service/SecurityQuestionService";

const props = defineProps<{ answerId?: number }>();

const answer = reactive({
  content: "",
  user_id: undefined as number | undefined,
  security_question_id: undefined as number | undefined,
});

const users = ref<{ id: number; name: string }[]>([]);
const securityQuestions = ref<{ id: number; name: string }[]>([]);
const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const router = useRouter();

const validateField = (field: keyof typeof answer) => {
  const result = AnswerValidator.validateField(field, answer[field]);

  if (!result.success) {
    errors[field] = result.error.errors[0].message;
  } else {
    delete errors[field];
  }
};

const validateAllFields = () => {
  Object.keys(answer).forEach((field) => {
    validateField(field as keyof typeof answer);
  });
};

const fetchUsers = async () => {
  try {
    const response = await UserService.getUsers();
    if (response.status === 200) {
      users.value = response.data.map((user: any) => ({ id: user.id, name: user.name }));
    }
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

const fetchSecurityQuestions = async () => {
  try {
    const response = await SecurityQuestionService.getSecurityQuestions();
    if (response.status === 200) {
      securityQuestions.value = response.data.map((question: any) => ({ id: question.id, name: question.name }));
    }
  } catch (error) {
    console.error("Error al obtener las preguntas de seguridad:", error);
  }
};

onMounted(async () => {
  await fetchUsers();
  await fetchSecurityQuestions();

  if (props.answerId) {
    try {
      const response = await AnswerService.getAnswer(props.answerId);
      if (response.status === 200) {
        Object.assign(answer, response.data);
      }
    } catch (error) {
      console.error("Error al cargar la respuesta:", error);
    }
  }
});

const submitForm = async () => {
  validateAllFields();

  if (Object.keys(errors).length > 0) return;

  isSubmitting.value = true;

  try {
    let response;
    if (props.answerId) {
      response = await AnswerService.updateAnswer(props.answerId, answer);
    } else {
      response = await AnswerService.createAnswer(answer);
    }

    if (response.status === 200 || response.status === 201) {
      Swal.fire({
        title: "Éxito",
        text: props.answerId ? "Respuesta actualizada con éxito ✅" : "Respuesta creada con éxito ✅",
        icon: "success",
        confirmButtonText: "OK",
        timer: 3000,
      });
    } else {
      Swal.fire({
        title: "Error",
        text: `❌ Código ${response.status}: ${typeof response.data === 'object' && 'message' in response.data ? response.data.message : "Ocurrió un error"}`,
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
        timer: 3000,
      });
    }
  } catch (error: any) {
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "❌ Error inesperado en la operación.",
      icon: "error",
      confirmButtonText: "OK",
      timer: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
  router.push("/answers");
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full bg-white shadow-lg rounded-lg p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        {{ props.answerId ? "Editar Respuesta" : "Crear Respuesta" }}
      </h2>

      <form @submit.prevent="submitForm" class="grid grid-cols-1 gap-6">
        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Contenido:</label>
          <input
            v-model="answer.content"
            type="text"
            @input="validateField('content')"
            @blur="validateField('content')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <span class="text-red-500 text-sm" v-if="errors.content">{{ errors.content }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Usuario:</label>
          <select
            v-model="answer.user_id"
            @change="validateField('user_id')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Seleccione un usuario</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
          <span class="text-red-500 text-sm" v-if="errors.user_id">{{ errors.user_id }}</span>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium text-gray-700">Pregunta de Seguridad:</label>
          <select
            v-model="answer.security_question_id"
            @change="validateField('security_question_id')"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Seleccione una pregunta</option>
            <option v-for="question in securityQuestions" :key="question.id" :value="question.id">
              {{ question.name }}
            </option>
          </select>
          <span class="text-red-500 text-sm" v-if="errors.security_question_id">{{ errors.security_question_id }}</span>
        </div>

        <div class="col-span-1">
          <button
            type="submit"
            :disabled="Object.keys(errors).length > 0 || isSubmitting"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {{ isSubmitting ? "Enviando..." : props.answerId ? "Actualizar" : "Crear" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Puedes agregar estilos personalizados aquí */
</style>