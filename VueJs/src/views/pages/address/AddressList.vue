<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Lista de Direcciones</h1>

            <router-link to="/address/create"
                class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4">
                <PlusCircleIcon class="w-5 h-5 mr-2" />
                Crear Dirección
            </router-link>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300 rounded-lg">
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
                            <td class="px-4 py-2 border">{{ getUserName(address.user_id) }}</td>
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
                                <button @click="deleteAddress(address.id)"
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
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import AddressService from '../../../service/AddressService';
import UserService from '../../../service/UserService';

const addresses = ref([]);
const users = ref([]);

const fetchAddresses = async () => {
    try {
        const [addressRes, userRes] = await Promise.all([
            AddressService.getAddresses(),
            UserService.getUsers()
        ]);
        addresses.value = addressRes.data;
        users.value = userRes.data;
    } catch (error) {
        console.error("Error al obtener las direcciones o usuarios:", error);
    }
};

const getUserName = (userId: number) => {
    const user = users.value.find((u: any) => u.id === userId);
    return user ? `${user.name} (${user.email})` : 'Sin usuario';
};

const deleteAddress = async (id: number) => {
    try {
        await AddressService.deleteAddress(id);
        addresses.value = addresses.value.filter((address: any) => address.id !== id);
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

onMounted(fetchAddresses);
</script>

<style scoped>
/* Aquí puedes agregar estilos específicos para este componente */
</style>
