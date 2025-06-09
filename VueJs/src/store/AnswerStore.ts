import type { Answer } from '../models/Answer';
import AnswerService from '../service/AnswerService';
import { defineStore } from 'pinia';

export const useAnswerStore = defineStore('AnswerStore', {
    state: () => ({
        Answers: [] as Answer[],
    }),
    actions: {
        async fetchAnswers() {
            let response = await AnswerService.getAnswers();
            this.Answers = response.data
            return this.Answers
        },
        async getAnswer(id: number) {
            return await AnswerService.getAnswer(id);
        },
        async addAnswer(Answer: Answer) {
            return await AnswerService.createAnswer(Answer);
        },
        async editAnswer(id: number, Answer: Answer) {
            return await AnswerService.updateAnswer(id, Answer);

        },
        async removeAnswer(id: number) {
            return await AnswerService.deleteAnswer(id);
        },
    }
});