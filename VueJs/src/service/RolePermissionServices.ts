import axios from 'axios';
import type { RolePermission } from '../models/RolePermission';

const API_URL = import.meta.env.VITE_API_URL + "/api/role-permissions/";

class RolePermissionService {
    async getRolePermissions() {
        const response = await axios.get<RolePermission[]>(API_URL);
        return response;
    }

    async getRolePermission(id: number) {
        const response = await axios.get<RolePermission>(`${API_URL}/${id}`);
        return response;
    }

    async createRolePermission(
    role_id: number,
    permission_id: number,
    rolePermission: Omit<RolePermission, "role_id" | "permission_id" | "id">
  ) {
    const response = await axios.post<RolePermission>(
      `${API_URL}role/${role_id}/permission/${permission_id}`,
      rolePermission,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  }

    async updateRolePermission(id: number, rolePermission: RolePermission) {
        const response = await axios.put<RolePermission>(`${API_URL}/${id}`, rolePermission);
        return response;
    }

    async deleteRolePermission(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new RolePermissionService();