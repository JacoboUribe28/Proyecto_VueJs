import AuthService from '../service/AuthService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { User } from '../models/User';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(AuthService.getCurrentUser()); // <-- Reactivo


    const login = async (userData: User) => {
        try {
            let loggedUser = await AuthService.login(userData);
            console.log("iniciando usuario" + JSON.stringify(loggedUser));
            user.value = loggedUser;
            console.log("fin");
            return loggedUser; // Retornar el usuario logueado
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error("Error desconocido");
            }
        }
    };

    const logout = () => {
        console.log("cerrando")
        AuthService.logout();
        user.value = null;

    };

    const isAuthenticated = computed(() => user.value !== null);

    return { user, login, logout, isAuthenticated };
});
