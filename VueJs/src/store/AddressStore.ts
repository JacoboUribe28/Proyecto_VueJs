import type { Address } from '@/models/Address';
import AddressService from '@/service/AddressService';
import { defineStore } from 'pinia';

export const useAddressStore = defineStore('addressStore', {
    state: () => ({
        addresses: [] as Address[],
    }),
    actions: {
        async fetchAddresses() {
            let response = await AddressService.getAddresses();
            this.addresses = response.data;
            return this.addresses;
        },
        async getAddress(id: number) {
            return await AddressService.getAddress(id);
        },
        async addAddress(address: Address) {
            return await AddressService.createAddress(address);
        },
        async editAddress(id: number, address: Address) {
            return await AddressService.updateAddress(id, address);
        },
        async removeAddress(id: number) {
            return await AddressService.deleteAddress(id);
        },
    }
});
