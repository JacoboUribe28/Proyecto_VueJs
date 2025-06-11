import type { RolePermission } from "../models/RolePermission";
import RolePermissionServices  from "../service/RolePermissionServices";
import { defineStore } from "pinia";

export const useRolePermissionStore = defineStore("rolePermissionStore", {
    state: () => ({
        rolePermissions: [] as RolePermission[],
    }),
    actions: {
        async fetchRolePermissions() {
            let response = await RolePermissionServices.getRolePermissions();
            this.rolePermissions = response.data;
            return this.rolePermissions;
        },
        async getRolePermission(id: number) {
            return await RolePermissionServices.getRolePermission(id);
        },
        async addRolePermission(rolePermission: RolePermission) {
            return await RolePermissionServices.createRolePermission(rolePermission);
        },
        async editRolePermission(id: number, rolePermission: RolePermission) {
            return await RolePermissionServices.updateRolePermission(id, rolePermission);
        },
        async removeRolePermission(id: number) {
            return await RolePermissionServices.deleteRolePermission(id);
        },
    }
});