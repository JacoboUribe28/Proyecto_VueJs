<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Perfiles</h1>

            <router-link to="/profile/create"
                class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4">
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Crear Perfil
            </router-link>

            <router-link to="/address/create"
                class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4">
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Crear Dirección
            </router-link>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead class="bg-gray-200 text-gray-700">
                        <tr>
                            <th class="px-4 py-2 border">Teléfono</th>
                            <th class="px-4 py-2 border">Foto</th>
                            <th class="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="profile in profiles" :key="profile.id" class="hover:bg-gray-100 transition">
                            <td class="px-4 py-2 border">{{ profile.phone }}</td>
                            <td class="px-4 py-2 border">
                                <img :src="profile.photo" alt="Foto" class="w-10 h-10 object-cover rounded-full" />
                            </td>
                            <td class="px-4 py-2 border flex space-x-4">
                                <router-link :to="`/profile/update/${profile.id}`"
                                    class="text-blue-600 hover:text-blue-800 flex items-center">
                                    <PencilIcon class="w-5 h-5 mr-1" />
                                    Editar
                                </router-link>
                                <button v-if="profile.id !== undefined" @click="deleteProfile(profile.id)"
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
import { computed, onMounted } from 'vue';
import { useProfileStore } from '../../../store/ProfileStore';

const store = useProfileStore();

onMounted(() => {
    store.fetchProfiles();
});

// Escucha los cambios reactivos en la tienda
const profiles = computed(() => store.profiles);

const deleteProfile = async (id: number) => {
    await store.removeProfile(id);
    await store.fetchProfiles();
};
</script>
