import axios from "axios";
import type { Profile } from "../models/Profile";

const API_URL = import.meta.env.VITE_API_URL + "/api/profiles";

class ProfileService {
    async getProfiles() {
        const response = await axios.get<Profile[]>(API_URL);
        return response;
    }

    async getProfile(id: number) {
        const response = await axios.get<Profile>(`${API_URL}/${id}`);
        return response;
    }    async createProfile(userId: number, formData: FormData) {
    try {
        // Crear una nueva URL con el userId en la ruta
        const url = `${API_URL}/user/${userId}`;
        console.log('URL de la solicitud:', url);
        
        // Eliminar user_id del FormData si existe, ya que va en la URL
        formData.delete('user_id');
        
        // Log del contenido del FormData
        console.log('FormData contenido:');
        for (const pair of formData.entries()) {
            console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
        }

        const response = await axios.post<Profile>(
            url,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                },
                // Asegurarse de que axios no procese el FormData
                transformRequest: [(data) => data]
            }
        );
        return response;
    } catch (error: any) {
        console.error('Error al enviar la solicitud al backend:', error);
        if (error.response) {
            console.error('Respuesta del servidor:', error.response.data);
            console.error('Estado HTTP:', error.response.status);
            console.error('Cabeceras:', error.response.headers);
        }
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