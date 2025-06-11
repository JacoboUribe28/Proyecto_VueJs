import axios from 'axios';
import type { UserRole } from '../models/UsrRole';

const API_URL = import.meta.env.VITE_API_URL + '/api/user-roles';

class UserRoleService {
    async getUserRoles() {
        const response = await axios.get<UserRole[]>(API_URL);
        return response;
    }

    async getUserRole(id: number) {
        const response = await axios.get<UserRole>(`${API_URL}/${id}`);
        return response;
    }

    async createUserRole(userRole: { user_id: number; role_id: number; startAt?: string; endAt?: string }) {
        // Usar el endpoint custom: /api/user-roles/user/{userId}/role/{roleId}
        const url = `${API_URL}/user/${userRole.user_id}/role/${userRole.role_id}`;
        // Enviar fechas si existen
        const body: any = {};
        if (userRole.startAt) body.startAt = userRole.startAt;
        if (userRole.endAt) body.endAt = userRole.endAt;
        return axios.post(url, body);
    }

    async updateUserRole(id: number, userRole: { role_id: number }) {
        // Solo permite modificar el rol
        const response = await axios.put(`${API_URL}/${id}`, { role_id: userRole.role_id });
        return response;
    }

    async deleteUserRole(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new UserRoleService();
