import axios from 'axios';
import type { DigitalSignature } from '../models/DigitalSignature';

const API_URL = import.meta.env.VITE_API_URL + "/api/digital-signatures/";

class DigitalSignatureService {
    async getDigitalSignatures() {
        const response = await axios.get<DigitalSignature[]>(API_URL);
        return response;
    }

    async getDigitalSignature(id: number) {
        const response = await axios.get<DigitalSignature>(`${API_URL}/${id}`);
        return response;
    }

    async createDigitalSignature(userId: number, formData: FormData) {
        try {
            const response = await axios.post<DigitalSignature>(
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

    async updateDigitalSignature(id: number, digitalSignature: DigitalSignature) {
        if (!digitalSignature.photo) {
            throw new Error('La foto es requerida');
        }

        // Crear FormData y agregar el archivo
        const formData = new FormData();
        const byteCharacters = atob(digitalSignature.photo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        formData.append('photo', blob, 'signature.jpg');

        // Log para verificar el contenido de FormData
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        const response = await axios.put<DigitalSignature>(
            `${API_URL}/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response;
    }

    async deleteDigitalSignature(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new DigitalSignatureService();