import axios from 'axios';
import type { Answer } from '../models/Answer';

const API_URL = import.meta.env.VITE_API_URL + "/api/answers/";

class AnswerService {
    async getAnswers() {
        const response = await axios.get<Answer[]>(API_URL);
        return response;
    }

    async getAnswer(id: number) {
        const response = await axios.get<Answer>(`${API_URL}/${id}`);
        return response;
    }

    async createAnswer(Answer: Answer) {
        const response = await axios.post<Answer>(API_URL, Answer);
        return response;
    }

    async updateAnswer(id: number, Answer: Answer) {
        const response = await axios.put<Answer>(`${API_URL}/${id}`, Answer);
        return response;
    }

    async deleteAnswer(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new AnswerService();