import { registerSpellDictionary } from '@inshapardaz/likhari-react';
import { axiosPrivate } from '@/utils/axios.helpers';

// Adapters implementing likhari-react's store interfaces (AutoCorrectStore,
// UserWordStore, CompletionStore) against the same /tools/{language}/... API
// the old in-house editor used (src/store/slices/tools.api.js), paired with
// the package's own localStorage-backed stores for an offline fallback.

// likhari-react only knows how to build a speller from a Hunspell `.aff`/`.dic`
// pair (registerSpellDictionary), not from a flat word list — so the API's
// word list is wrapped as a minimal Hunspell dictionary (no affix rules, one
// word per line) rather than changing likhari-react itself. This makes the
// API word list the spellchecker's base dictionary for a language (and gives
// Urdu a dictionary at all, since no Hunspell files are bundled for it); words
// added via apiUserWordStore.append below land in that same list on next load.
['en', 'ur'].forEach((language) => {
    registerSpellDictionary(language, async () => {
        const { data } = await axiosPrivate.get(`/tools/${language}/words/list`);
        const words = (data ?? []).filter(Boolean);
        return {
            aff: 'SET UTF-8\n',
            dic: `${words.length}\n${words.join('\n')}\n`,
        };
    });
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
