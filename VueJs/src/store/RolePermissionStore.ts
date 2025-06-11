import type { RolePermission } from '../models/RolePermission';
import RolePermissionService from '../service/RolePermissionServices';
import { defineStore } from 'pinia';

export const useRolePermissionStore = defineStore('RolePermissionStore', {
    state: () => ({
        rolePermissions: [] as RolePermission[],
    }),
    actions: {
        async fetchRolePermissions() {
            let response = await RolePermissionService.getRolePermissions();
            this.rolePermissions = response.data;
            return this.rolePermissions;
        },
        async getRolePermission(id: number) {
            return await RolePermissionService.getRolePermission(id);
        },
        async addRolePermission(roleId: number, permissionId: number, rolePermission: RolePermission) {
            return await RolePermissionService.createRolePermission(roleId, permissionId, rolePermission);
        },
        async editRolePermission(id: number, rolePermission: RolePermission) {
            return await RolePermissionService.updateRolePermission(id, rolePermission);
        },
        async removeRolePermission(id: number) {
            return await RolePermissionService.deleteRolePermission(id);
        },
    }
});