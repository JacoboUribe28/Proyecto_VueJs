<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Preguntas de Seguridad</h1>

            <router-link to="/security-questions/create"
                class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4">
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Crear Pregunta
            </router-link>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead class="bg-gray-200 text-gray-700">
                        <tr>
                            <th class="px-4 py-2 border">Nombre</th>
                            <th class="px-4 py-2 border">Descripción</th>
                            <th class="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="question in questions" :key="question.id" class="hover:bg-gray-100 transition">
                            <td class="px-4 py-2 border">{{ question.name }}</td>
                            <td class="px-4 py-2 border">{{ question.description }}</td>
                            <td class="px-4 py-2 border flex space-x-4">
                                <router-link :to="`/security-questions/update/${question.id}`"
                                    class="text-blue-600 hover:text-blue-800 flex items-center">
                                    <PencilIcon class="w-5 h-5 mr-1" />
                                    Editar
                                </router-link>
                                <button @click="deleteQuestion(question.id)"
                                    class="text-red-600 hover:text-red-800 flex items-center">
                                    <TrashIcon class="w-5 h-5 mr-1" />
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PencilIcon, PlusCircleIcon, TrashIcon } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import SecurityQuestionService from '../../../service/SecurityQuestionService';

const questions = ref<{ id: number; name: string; description: string }[]>([]);

const fetchQuestions = async () => {
  try {
    const response = await SecurityQuestionService.getSecurityQuestions();
    if (response.status === 200) {
      questions.value = response.data
        .filter((q: any) => typeof q.id === 'number' && q.name && q.description)
        .map((q: any) => ({
          id: q.id as number,
          name: q.name,
          description: q.description
        }));
    }
  } catch (error) {
    console.error("Error al obtener las preguntas de seguridad:", error);
  }
};

const deleteQuestion = async (id: number) => {
  try {
    await SecurityQuestionService.deleteSecurityQuestion(id);
    questions.value = questions.value.filter((question) => question.id !== id);
    Swal.fire({
      title: 'Éxito',
      text: 'Pregunta eliminada con éxito ✅',
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 3000
    });
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: '❌ Error al eliminar la pregunta.',
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 3000
    });
  }
};

onMounted(fetchQuestions);
</script>
