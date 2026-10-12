import { registerSpellDictionary } from '@inshapardaz/likhari-react';
import { axiosPrivate } from '@/utils/axios.helpers';

// Adapters implementing likhari-react's store interfaces (AutoCorrectStore,
// UserWordStore, CompletionStore) against the same /tools/{language}/... API
// the old in-house editor used (src/store/slices/tools.api.js), paired with
// the package's own localStorage-backed stores for an offline fallback.

// English already ships a comprehensive bundled Hunspell dictionary, and the
// API word list is already folded into it as "accepted" words via
// apiUserWordStore below (loadUserWords merges every dictionaryStore's words
// into the set EditorRoot's speller treats as correct) — so overriding it
// here would replace that broad dictionary with just the much smaller API
// word list and flag most ordinary words as misspelled. Urdu has no bundled
// dictionary at all, so for it alone the API word list is registered as a
// Hunspell dictionary (registerSpellDictionary, wrapped as a minimal `.dic`
// with no affix rules) so it has a speller at all.
registerSpellDictionary('ur', async () => {
    const { data } = await axiosPrivate.get('/tools/ur/words/list');
    const words = (data ?? []).filter(Boolean);
    return {
        aff: 'SET UTF-8\n',
        dic: `${words.length}\n${words.join('\n')}\n`,
    };
});

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
