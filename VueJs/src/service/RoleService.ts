import axios from 'axios';
import type { Role } from '../models/Role';

const API_URL = import.meta.env.VITE_API_URL + '/roles';

class RoleService {
    async getRoles() {
        const response = await axios.get<Role[]>(API_URL);
        return response;
    }

    async getRole(id: number) {
        const response = await axios.get<Role>(`${API_URL}/${id}`);
        return response;
    }

    async createRole(role: Role) {
        const response = await axios.post<Role>(API_URL, role);
        return response;
    }

    async updateRole(id: number, role: Role) {
        const response = await axios.put<Role>(`${API_URL}/${id}`, role);
        return response;
    }

    async deleteRole(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new RoleService();
