import type { Permission }  from "../models/Permission";
import { defineStore } from "pinia";
import PermissionService from "../service/PermissionService";

export const usePermissionStore = defineStore("permissionStore", {
    state: () => ({
        permissions: [] as Permission[],
    }),
    actions: {
        async fetchPermissions() {
            let response = await PermissionService.getPermissions();
            this.permissions = response.data;
            return this.permissions;
        },
        async getPermission(id: number) {
            return await PermissionService.getPermission(id);
        },
        async addPermission(permission: Permission) {
            return await PermissionService.createPermission(permission);
        },
        async editPermission(id: number, permission: Permission) {
            return await PermissionService.updatePermission(id, permission);
        },
        async removePermission(id: number) {
            return await PermissionService.deletePermission(id);
        },
    }
});