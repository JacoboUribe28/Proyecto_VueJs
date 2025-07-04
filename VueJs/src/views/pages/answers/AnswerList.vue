<script setup lang="ts">
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import AnswerService from "../../../service/AnswerService";
import UserService from "../../../service/UserService";
import SecurityQuestionService from "../../../service/SecurityQuestionService";

const answers = ref<{ id: number; content: string; user_id: number; security_question_id: number }[]>([]);
const users = ref<{ id: number; name: string }[]>([]);
const securityQuestions = ref<{ id: number; name: string }[]>([]);

const fetchAnswers = async () => {
  try {
    const response = await AnswerService.getAnswers();
    if (response.status === 200) {
      answers.value = response.data.map((answer: any) => ({
        id: answer.id,
        content: answer.content,
        user_id: answer.user_id,
        security_question_id: answer.security_question_id,
      }));
    }
  } catch (error) {
    console.error("Error al obtener las respuestas:", error);
  }
};

const fetchUsersAndQuestions = async () => {
  try {
    const userResponse = await UserService.getUsers();
    if (userResponse.status === 200) {
      users.value = userResponse.data.map((user: any) => ({ id: user.id, name: user.name }));
    }

    const questionResponse = await SecurityQuestionService.getSecurityQuestions();
    if (questionResponse.status === 200) {
      securityQuestions.value = questionResponse.data.map((question: any) => ({ id: question.id, name: question.name }));
    }
  } catch (error) {
    console.error("Error al obtener usuarios o preguntas de seguridad:", error);
  }
};

onMounted(async () => {
  await fetchUsersAndQuestions();
  await fetchAnswers();
});

const deleteAnswer = async (id: number) => {
  try {
    await AnswerService.deleteAnswer(id);
    answers.value = answers.value.filter((answer) => answer.id !== id);
    Swal.fire({
      title: "Éxito",
      text: "Respuesta eliminada con éxito ✅",
      icon: "success",
      confirmButtonText: "OK",
      timer: 3000,
    });
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: "❌ Error al eliminar la respuesta.",
      icon: "error",
      confirmButtonText: "OK",
      timer: 3000,
    });
  }
};

const getUserName = (userId: number) => {
  const user = users.value.find((user) => user.id === userId);
  return user ? user.name : "Desconocido";
};

const getQuestionName = (questionId: number) => {
  const question = securityQuestions.value.find((question) => question.id === questionId);
  return question ? question.name : "Desconocido";
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Respuestas</h1>

      <router-link
        to="/answer/create"
        class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
      >
        <PlusCircleIcon class="w-5 h-5 mr-2" />
        Crear Respuesta
      </router-link>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-2 border">Contenido</th>
              <th class="px-4 py-2 border">Usuario</th>
              <th class="px-4 py-2 border">Pregunta de Seguridad</th>
              <th class="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="answer in answers"
              :key="answer.id"
              class="hover:bg-gray-100 transition"
            >
              <td class="px-4 py-2 border">{{ answer.content }}</td>
              <td class="px-4 py-2 border">{{ getUserName(answer.user_id) }}</td>
              <td class="px-4 py-2 border">{{ getQuestionName(answer.security_question_id) }}</td>
              <td class="px-4 py-2 border">
                <router-link
                  :to="`/answer/view/${answer.id}`"
                  class="text-green-600 hover:underline mr-2"
                >
                  <EyeIcon class="w-5 h-5 inline" />
                </router-link>
                <router-link
                  :to="`/answer/edit/${answer.id}`"
                  class="text-blue-600 hover:underline mr-2"
                >
                  <PencilIcon class="w-5 h-5 inline" />
                </router-link>
                <button
                  @click="deleteAnswer(answer.id)"
                  class="text-red-600 hover:underline"
                >
                  <TrashIcon class="w-5 h-5 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo similar al de DeviceList para mantener consistencia */
.bg-gradient-to-r {
  background: linear-gradient(to right, #ebf8ff, #d1fae5);
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.text-gray-900 {
  color: #1a202c;
}

.text-gray-800 {
  color: #2d3748;
}

.text-gray-600 {
  color: #718096;
}

.text-lg {
  font-size: 1.125rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.font-extrabold {
  font-weight: 800;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.p-6 {
  padding: 1.5rem;
}

.p-8 {
  padding: 2rem;
}

.pb-6 {
  padding-bottom: 1.5rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-y-10 > * + * {
  margin-top: 2.5rem;
}
</style>