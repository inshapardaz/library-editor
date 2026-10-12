import { LANGUAGE_TOOLS } from '@/config';

// The autocorrect and punctuation lists are managed in LanguageTools (dictionary.*), which opens
// the list named by `profile` ('autocorrect' | 'punctuation') for `language`.
export const correctionsUrl = (profile, language) =>
    `${LANGUAGE_TOOLS}/corrections?profile=${encodeURIComponent(profile)}&language=${encodeURIComponent(language)}`;
