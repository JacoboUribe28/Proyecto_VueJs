import axios from "axios";
import type { Profile } from "../models/Profile";

const API_URL = import.meta.env.VITE_API_URL + "/api/profiles/";

class ProfileService {
    async getProfiles() {
        const response = await axios.get<Profile[]>(API_URL);
        return response;
    }

    async getProfile(id: number) {
        const response = await axios.get<Profile>(`${API_URL}/${id}`);
        return response;
    }

    async createProfile(userId: number, formData: FormData) {
    try {
        const response = await axios.post<Profile>(
            `${API_URL}user/${userId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response;
    } catch (error) {
        console.error('Error al enviar la solicitud al backend:', error);
        throw error;
    }
}

    async updateProfile(id: number, profile: Profile) {
        const response = await axios.put<Profile>(`${API_URL}/${id}`, profile);
        return response;
    }

    async deleteProfile(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }
}
export default new ProfileService();