import type { DigitalSignature } from '../models/DigitalSignature';
import DigitalSignatureService from '../service/DigitalSignatureService';
import { defineStore } from 'pinia';

export const useDigitalSignatureStore = defineStore('DigitalSignatureStore', {
    state: () => ({
        DigitalSignatures: [] as DigitalSignature[],
    }),
    actions: {
        async fetchDigitalSignatures() {
            let response = await DigitalSignatureService.getDigitalSignatures();
            this.DigitalSignatures = response.data
            return this.DigitalSignatures
        },
        async getDigitalSignature(id: number) {
            return await DigitalSignatureService.getDigitalSignature(id);
        },
        async addDigitalSignature(DigitalSignature: DigitalSignature) {
            return await DigitalSignatureService.createDigitalSignature(DigitalSignature);
        },
        async editDigitalSignature(id: number, DigitalSignature: DigitalSignature) {
            return await DigitalSignatureService.updateDigitalSignature(id, DigitalSignature);

        },
        async removeDigitalSignature(id: number) {
            return await DigitalSignatureService.deleteDigitalSignature(id);
        },
    }
});