import type {Session} from '../models/Session';
import SessionService from '../service/SessionService';
import {defineStore} from 'pinia';

export const useSessionStore = defineStore('sessionStore', {
    state: () => ({
        sessions: [] as Session[],
    }),
    actions: {
        async fetchSessions() {
            let response = await SessionService.getSessions();
            this.sessions = response.data;
            return this.sessions;
        },
        async getSession(id: string) {
            return await SessionService.getSession(id);
        },
        async addSession(session: Session) {
            return await SessionService.createSession(session);
        },
        async editSession(id: string, session: Session) {
            return await SessionService.updateSession(id, session);
        },
        async removeSession(id: string) {
            return await SessionService.deleteSession(id);
        },
    }
});