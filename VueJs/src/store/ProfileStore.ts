import type { Profile } from '../models/Profile';
import ProfileService from '../service/ProfileService';
import { defineStore } from 'pinia';

export const useProfileStore = defineStore('profileStore', {
    state: () => ({
        profiles: [] as Profile[],
    }),
    actions: {
        async fetchProfiles() {
            let response = await ProfileService.getProfiles();
            this.profiles = response.data;
            return this.profiles;
        },
        async getProfile(id: number) {
            return await ProfileService.getProfile(id);
        },
        async addProfile(profile: Profile) {
            return await ProfileService.createProfile(profile);
        },
        async editProfile(id: number, profile: Profile) {
            return await ProfileService.updateProfile(id, profile);
        },
        async removeProfile(id: number) {
            return await ProfileService.deleteProfile(id);
        },
    }
});

