import axios from "axios";
import type { Permission } from "../models/Permission";

const API_URL = import.meta.env.VITE_API_URL + "/permissions";

class PermissionService {
    async getPermissions() {
        const response = await axios.get<Permission[]>(API_URL);
        return response;
    }

    async getPermission(id: number) {
        const response = await axios.get<Permission>(`${API_URL}/${id}`);
        return response;
    }

    async createPermission(permission: Permission) {
        const response = await axios.post<Permission>(API_URL, permission);
        return response;
    }

    async updatePermission(id: number, permission: Permission) {
        const response = await axios.put<Permission>(`${API_URL}/${id}`, permission);
        return response;
    }

    async deletePermission(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }
}
export default new PermissionService();