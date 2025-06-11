import type { UserRole } from '@/models/UsrRole';
import UserRoleService from '@/service/UserRoleService';
import { defineStore } from 'pinia';

export const useUserRoleStore = defineStore('userRoleStore', {
    state: () => ({
        userRoles: [] as UserRole[],
    }),
    actions: {
        async fetchUserRoles() {
            let response = await UserRoleService.getUserRoles();
            this.userRoles = response.data;
            return this.userRoles;
        },
        async getUserRole(id: number) {
            return await UserRoleService.getUserRole(id);
        },
        async addUserRole(userRole: UserRole) {
            return await UserRoleService.createUserRole(userRole);
        },
        async editUserRole(id: number, userRole: UserRole) {
            return await UserRoleService.updateUserRole(id, userRole);
        },
        async removeUserRole(id: number) {
            return await UserRoleService.deleteUserRole(id);
        },
    }
});
