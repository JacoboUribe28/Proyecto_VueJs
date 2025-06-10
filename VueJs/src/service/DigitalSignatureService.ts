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

    async createDigitalSignature(DigitalSignature: DigitalSignature) {
        const response = await axios.post<DigitalSignature>(API_URL, DigitalSignature);
        return response;
    }

    async updateDigitalSignature(id: number, DigitalSignature: DigitalSignature) {
        const response = await axios.put<DigitalSignature>(`${API_URL}/${id}`, DigitalSignature);
        return response;
    }

    async deleteDigitalSignature(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new DigitalSignatureService();