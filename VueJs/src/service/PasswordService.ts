import axios from 'axios';
import type { Password } from '../models/Password';

const API_URL = import.meta.env.VITE_API_URL + '/api/passwords/';

class PasswordService {
    async getPasswords() {
        const response = await axios.get<Password[]>(API_URL);
        return response;
    }

    async getPassword(id: number) {
        const response = await axios.get<Password>(`${API_URL}/${id}`);
        return response;
    }

    async createPassword(password: { content: string; startAt: string; endAt: string }) {
        const response = await axios.post(API_URL, password);
        return response;
    }

    async createPasswordForUser(userId: number, password: { content: string; startAt: string; endAt: string }) {
        const response = await axios.post(`${API_URL}user/${userId}`, password);
        return response;
    }

    async updatePassword(id: number, password: { content: string; endAt: string }) {
        const response = await axios.put(`${API_URL}${id}`, password);
        return response;
    }

    async deletePassword(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new PasswordService();
