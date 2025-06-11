import axios from 'axios';
import type { SecurityQuestion } from '../models/SecurityQuestion';

const API_URL = import.meta.env.VITE_API_URL + "/api/security-questions/";

class SecurityQuestionService {
    async getSecurityQuestions() {
        const response = await axios.get<SecurityQuestion[]>(API_URL);
        return response;
    }

    async getSecurityQuestion(id: number) {
        const response = await axios.get<SecurityQuestion>(`${API_URL}/${id}`);
        return response;
    }

    async createSecurityQuestion(SecurityQuestion: SecurityQuestion) {
        const response = await axios.post<SecurityQuestion>(API_URL, SecurityQuestion);
        return response;
    }

    async updateSecurityQuestion(id: number, SecurityQuestion: SecurityQuestion) {
        const response = await axios.put<SecurityQuestion>(`${API_URL}/${id}`, SecurityQuestion);
        return response;
    }

    async deleteSecurityQuestion(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new SecurityQuestionService();