import type { Password } from '@/models/Password';
import PasswordService from '@/service/PasswordService';
import { defineStore } from 'pinia';

export const usePasswordStore = defineStore('passwordStore', {
    state: () => ({
        passwords: [] as Password[],
    }),
    actions: {
        async fetchPasswords() {
            let response = await PasswordService.getPasswords();
            this.passwords = response.data;
            return this.passwords;
        },
        async getPassword(id: number) {
            return await PasswordService.getPassword(id);
        },
        async addPassword(password: Password) {
            return await PasswordService.createPassword(password);
        },
        async editPassword(id: number, password: Password) {
            return await PasswordService.updatePassword(id, password);
        },
        async removePassword(id: number) {
            return await PasswordService.deletePassword(id);
        },
    }
});
