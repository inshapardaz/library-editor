import { axiosPrivate } from '@/utils/axios.helpers';

// Adapters implementing likhari-react's store interfaces (AutoCorrectStore,
// UserWordStore, CompletionStore) against the same /tools/{language}/... API
// the old in-house editor used (src/store/slices/tools.api.js), paired with
// the package's own localStorage-backed stores for an offline fallback.

export const apiAutoCorrectStore = () => ({
    id: 'nawishta-tools-autocorrect',
    // The old editor's autocorrect list has no write-back endpoint.
    readOnly: true,
    async load(language) {
        const { data } = await axiosPrivate.get(`/tools/${language}/spellchecker/autocorrect`);
        return (data ?? []).map(({ incorrectText, correctText }) => ({
            from: incorrectText,
            to: correctText,
        }));
    },
});

export const apiUserWordStore = () => ({
    id: 'nawishta-tools-words',
    async load(language) {
        const { data } = await axiosPrivate.get(`/tools/${language}/words/list`);
        return data ?? [];
    },
    async append(language, word) {
        await axiosPrivate.post(`/tools/${language}/words`, { word });
    },
});

export const apiCompletionStore = () => ({
    id: 'nawishta-tools-words',
    async load(language) {
        const { data } = await axiosPrivate.get(`/tools/${language}/words/list`);
        return data ?? [];
    },
});
