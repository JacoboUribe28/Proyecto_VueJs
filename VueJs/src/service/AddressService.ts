import axios from 'axios';
import type { Address } from '../models/Address';

const API_URL = import.meta.env.VITE_API_URL + '/api/addresses/';

class AddressService {
    async getAddresses() {
        const response = await axios.get<Address[]>(API_URL);
        return response;
    }

    async getAddress(id: number) {
        const response = await axios.get<Address>(`${API_URL}/${id}`);
        return response;
    }

    async createAddress(address: Address) {
        const response = await axios.post<Address>(API_URL, address);
        return response;
    }

    async updateAddress(id: number, address: Address) {
        const response = await axios.put<Address>(`${API_URL}/${id}`, address);
        return response;
    }

    async deleteAddress(id: number) {
        await axios.delete(`${API_URL}/${id}`);
    }

    async getAddressesByUser(userId: number) {
        const response = await axios.get<Address[]>(`${API_URL}user/${userId}`);
        return response;
    }
}

export default new AddressService();
