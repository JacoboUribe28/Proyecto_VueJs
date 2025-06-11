<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Contraseñas</h1>

            <router-link to="/password/create"
                class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4">
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Crear Contraseña
            </router-link>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead class="bg-gray-200 text-gray-700">
                        <tr>
                            <th class="px-4 py-2 border">Contenido</th>
                            <th class="px-4 py-2 border">Fecha de fin</th>
                            <th class="px-4 py-2 border">Usuario</th>
                            <th class="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="password in passwords" :key="password.id" class="hover:bg-gray-100 transition">
                            <td class="px-4 py-2 border">{{ password.content }}</td>
                            <td class="px-4 py-2 border">{{ password.endAt }}</td>
                            <td class="px-4 py-2 border">{{ getUserName(password.user_id) }}</td>
                            <td class="px-4 py-2 border flex space-x-4">
                                <router-link :to="`/password/view/${password.id}`"
                                    class="text-green-600 hover:text-green-800 flex items-center">
                                    <EyeIcon class="w-5 h-5 mr-1" />
                                    Ver
                                </router-link>
                                <router-link :to="`/password/update/${password.id}`"
                                    class="text-blue-600 hover:text-blue-800 flex items-center">
                                    <PencilIcon class="w-5 h-5 mr-1" />
                                    Editar
                                </router-link>
                                <button v-if="password.id !== undefined" @click="deletePassword(password.id)"
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
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon } from 'lucide-vue-next';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import type { User } from '../../../models/User';
import PasswordService from '../../../service/PasswordService';
import UserService from '../../../service/UserService';

interface Password {
    id?: number;
    content: string;
    endAt: string;
    user_id: number;
}

const passwords = ref<Password[]>([]);

const users = ref<User[]>([]);

const fetchPasswords = async () => {
    try {
        const [passwordRes, userRes] = await Promise.all([
            PasswordService.getPasswords(),
            UserService.getUsers()
        ]);
        passwords.value = passwordRes.data.map((p: any) => ({
            id: p.id,
            content: p.content ?? '',
            endAt: p.endAt ?? '',
            user_id: p.user_id ?? 0
        }));
        users.value = userRes.data;
    } catch (error) {
        console.error("Error al obtener las contraseñas o usuarios:", error);
    }
};

const getUserName = (userId: number) => {
    const user = users.value.find((u) => u.id === userId);
    return user ? `${user.name} (${user.email})` : 'Sin usuario';
};

const deletePassword = async (id: number) => {
    try {
        await PasswordService.deletePassword(id);
        passwords.value = passwords.value.filter((password) => password.id !== id);
        Swal.fire({
            title: 'Éxito',
            text: 'Contraseña eliminada con éxito ✅',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000
        });
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: '❌ Error al eliminar la contraseña.',
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3000
        });
    }
};

onMounted(fetchPasswords);
</script>
