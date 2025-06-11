<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Direcciones</h1>

            <div class="mb-4 flex items-center space-x-4">
                <label for="user-select" class="font-semibold">Filtrar por usuario:</label>
                <select id="user-select" v-model="selectedUserId" class="border rounded px-2 py-1">
                    <option :value="null">Todos</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                        {{ user.name }} ({{ user.email }})
                    </option>
                </select>
            </div>

            <router-link to="/address/create"
                class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4">
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Crear Dirección
            </router-link>

            <div v-if="loading" class="flex justify-center items-center h-32">
                <span class="text-gray-500">Cargando direcciones...</span>
            </div>
            <div v-else>
                <div v-if="errorMsg" class="mb-4 text-red-600">{{ errorMsg }}</div>
                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white border border-gray-300 rounded-lg"
                        aria-label="Lista de direcciones">
                        <thead class="bg-gray-200 text-gray-700">
                            <tr>
                                <th class="px-4 py-2 border">Calle</th>
                                <th class="px-4 py-2 border">Número</th>
                                <th class="px-4 py-2 border">Latitud</th>
                                <th class="px-4 py-2 border">Longitud</th>
                                <th class="px-4 py-2 border">Usuario</th>
                                <th class="px-4 py-2 border">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="address in addresses" :key="address.id" class="hover:bg-gray-100 transition">
                                <td class="px-4 py-2 border">{{ address.street }}</td>
                                <td class="px-4 py-2 border">{{ address.number }}</td>
                                <td class="px-4 py-2 border">{{ address.latitude }}</td>
                                <td class="px-4 py-2 border">{{ address.longitude }}</td>
                                <td class="px-4 py-2 border">{{ getUserName(address.user_id ?? 0) }}</td>
                                <td class="px-4 py-2 border flex space-x-4">
                                    <router-link :to="`/address/view/${address.id}`"
                                        class="text-green-600 hover:text-green-800 flex items-center">
                                        <EyeIcon class="w-5 h-5 mr-1" />
                                        Ver
                                    </router-link>
                                    <router-link :to="`/address/update/${address.id}`"
                                        class="text-blue-600 hover:text-blue-800 flex items-center">
                                        <PencilIcon class="w-5 h-5 mr-1" />
                                        Editar
                                    </router-link>
                                    <button @click="deleteAddress(address.id ?? 0)"
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
    </div>
</template>

<script setup lang="ts">
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon } from 'lucide-vue-next';
import Swal from 'sweetalert2';
import { onMounted, ref, watch } from 'vue';
import type { Address } from '../../../models/Address';
import type { User } from '../../../models/User';
import AddressService from '../../../service/AddressService';
import UserService from '../../../service/UserService';

const addresses = ref<Address[]>([]);
const users = ref<User[]>([]);
const loading = ref(true);
const errorMsg = ref('');
const selectedUserId = ref<number | null>(null);

const fetchAddresses = async (): Promise<void> => {
    loading.value = true;
    errorMsg.value = '';
    try {
        const userRes = await UserService.getUsers();
        users.value = userRes.data as User[];
        if (selectedUserId.value) {
            const addressRes = await AddressService.getAddressesByUser(selectedUserId.value);
            addresses.value = addressRes.data as Address[];
        } else {
            const addressRes = await AddressService.getAddresses();
            addresses.value = addressRes.data as Address[];
        }
    } catch (error) {
        console.error("Error al obtener las direcciones o usuarios:", error);
        errorMsg.value = 'No se pudieron cargar los datos. Intenta nuevamente.';
    } finally {
        loading.value = false;
    }
};

const getUserName = (userId: number): string => {
    const user = users.value.find((u: User) => u.id === userId);
    return user ? `${user.name} (${user.email})` : 'Sin usuario';
};

const deleteAddress = async (id: number): Promise<void> => {
    try {
        await AddressService.deleteAddress(id);
        addresses.value = addresses.value.filter((address: Address) => address.id !== id);
        Swal.fire({
            title: 'Éxito',
            text: 'Dirección eliminada con éxito ✅',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000
        });
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: '❌ Error al eliminar la dirección.',
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3000
        });
    }
};

watch(selectedUserId, fetchAddresses);

onMounted(fetchAddresses);
</script>

<style scoped>
/* Aquí puedes agregar estilos específicos para este componente */
</style>
