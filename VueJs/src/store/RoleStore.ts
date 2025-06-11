import type { Role } from '@/models/Role';
import RoleService from '@/service/RoleService';
import { defineStore } from 'pinia';

export const useRoleStore = defineStore('roleStore', {
    state: () => ({
        roles: [] as Role[],
    }),
    actions: {
        async fetchRoles() {
            let response = await RoleService.getRoles();
            this.roles = response.data;
            return this.roles;
        },
        async getRole(id: number) {
            return await RoleService.getRole(id);
        },
        async addRole(role: Role) {
            return await RoleService.createRole(role);
        },
        async editRole(id: number, role: Role) {
            return await RoleService.updateRole(id, role);
        },
        async removeRole(id: number) {
            return await RoleService.deleteRole(id);
        },
    }
});
