<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="w-full bg-white shadow-lg rounded-lg p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
                Detalle del Rol de Usuario
            </h2>
            <div v-if="userrole">
                <div class="mb-4">
                    <span class="font-semibold">Usuario:</span>
                    <span>{{ userName }}</span>
                </div>
                <div class="mb-4">
                    <span class="font-semibold">Rol:</span>
                    <span>{{ roleName }}</span>
                </div>
            </div>
            <div v-else>
                <p class="text-gray-500">Cargando datos...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { UserRole } from '../../../models/UsrRole';
import RoleService from '../../../service/RoleService';
import UserRoleService from '../../../service/UserRoleService';
import UserService from '../../../service/UserService';

const route = useRoute();
const userRoleId = route.params.id ? Number(route.params.id) : undefined;
const userrole = ref<UserRole | null>(null);
const userName = ref('');
const roleName = ref('');

const fetchUserRole = async () => {
    if (userRoleId) {
        try {
            const response = await UserRoleService.getUserRole(userRoleId);
            if (response.status === 200) {
                userrole.value = response.data as UserRole;
                if (userrole.value) {
                    if (userrole.value.user_id !== undefined) {
                        await fetchUserName(userrole.value.user_id);
                    } else {
                        userName.value = 'Desconocido';
                    }
                    if (userrole.value.role_id !== undefined) {
                        await fetchRoleName(userrole.value.role_id);
                    } else {
                        roleName.value = 'Desconocido';
                    }
                }
            }
        } catch (error) {
            console.error('Error al obtener el userrole:', error);
        }
    }
};

const fetchUserName = async (userId: number) => {
    try {
        const response = await UserService.getUser(userId);
        if (response.status === 200) {
            userName.value = response.data.name ?? 'Desconocido';
        }
    } catch (error) {
        userName.value = 'Desconocido';
    }
};

const fetchRoleName = async (roleId: number) => {
    try {
        const response = await RoleService.getRole(roleId);
        if (response.status === 200) {
            roleName.value = response.data.name ?? 'Desconocido';
        }
    } catch (error) {
        roleName.value = 'Desconocido';
    }
};

onMounted(fetchUserRole);
</script>
