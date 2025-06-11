import axios from "axios";
import type { Session } from "../models/Session";

const API_URL = import.meta.env.VITE_API_URL + "/sessions";

class SessionService {
    async getSessions() {
        const response = await axios.get<Session[]>(API_URL);
        return response;
    }

    async getSession(id: string) {
        const response = await axios.get<Session>(`${API_URL}/${id}`);
        return response;
    }

    async createSession(session: Session) {
        const response = await axios.post<Session>(API_URL, session);
        return response;
    }

    async updateSession(id: string, session: Session) {
        const response = await axios.put<Session>(`${API_URL}/${id}`, session);
        return response;
    }

    async deleteSession(id: string) {
        await axios.delete(`${API_URL}/${id}`);
    }
}
export default new SessionService();