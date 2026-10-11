import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useComputedColorScheme } from '@mantine/core';

// Editor package
import { EditorRoot } from '@inshapardaz/likhari-react';

// Local imports
import { apiAutoCorrectStore, apiUserWordStore, apiCompletionStore } from './stores';

// likhari-react's own localStorage-backed stores, paired with the API adapters
// above so corrections/dictionary/completions keep working offline too.
import {
    localStorageAutoCorrectStore,
    localStorageUserWordStore,
} from '@inshapardaz/likhari-react';

//-----------------------------------------

const AUTO_CORRECT_STORES = [apiAutoCorrectStore(), localStorageAutoCorrectStore()];
const DICTIONARY_STORES = [localStorageUserWordStore(), apiUserWordStore()];
const COMPLETION_STORES = [apiCompletionStore()];

// The "standard"/"poetry" presets leave these off by default (see
// @inshapardaz/likhari-core's STANDARD_FEATURE_CONFIG); this app wants them
// on everywhere, so they're layered on top of whichever preset a page picks
// rather than repeated at every call site.
const EXTRA_FEATURES = {
    poetry: { enabled: true },
    language: {
        spellCheck: true,
        thesaurus: true,
        autocomplete: true,
        autocorrect: true,
        textCleanup: true,
    },
    font: { family: true, size: true },
    blocks: { headingLevels: [1, 2, 3, 4, 5, 6], pageBreak: true },
    joinLines: true,
    footnotes: true,
    columns: true,
};

/**
 * Thin wrapper around likhari-react's EditorRoot: fixes the stores (so every
 * call site shares the same backend-backed spellcheck/autocorrect/autocomplete
 * sources), maps this app's language/theme state onto the editor's props, and
 * uses uniform font mode — one font + zoom for the whole canvas, a view
 * preference EditorRoot itself remembers in localStorage (keyed by
 * documentId) rather than per-selection document formatting. Markdown
 * deliberately doesn't carry font/size (docs/markdown-dialect.md), so
 * uniform mode is the right fit here: it survives reload without needing
 * the document itself to store it.
 */
const Editor = ({
    documentId,
    language = 'en',
    initialContent,
    featurePreset,
    featureConfig,
    placeholder,
    height,
    onSave,
    onChange,
}) => {
    const colorScheme = useComputedColorScheme('light');
    const locale = useMemo(() => (language === 'ur' ? 'ur' : 'en'), [language]);

    return (
        <EditorRoot
            documentId={documentId}
            initialContent={initialContent}
            featurePreset={featurePreset}
            featureConfig={{ ...EXTRA_FEATURES, ...featureConfig }}
            fontMode="uniform"
            autoCorrectStores={AUTO_CORRECT_STORES}
            dictionaryStores={DICTIONARY_STORES}
            completionStores={COMPLETION_STORES}
            autoCompleteLanguage={locale}
            colorScheme={colorScheme}
            locale={locale}
            placeholder={placeholder}
            height={height ?? '100%'}
            autosave
            restoreDraft="prompt"
            navigationGuard="confirm"
            onSave={onSave}
            onChange={onChange}
        />
    );
};

Editor.propTypes = {
    documentId: PropTypes.string,
    language: PropTypes.string,
    initialContent: PropTypes.shape({
        format: PropTypes.oneOf(['markdown', 'html', 'plain-text', 'lexical-json']),
        value: PropTypes.string,
    }),
    featurePreset: PropTypes.oneOf(['minimal', 'standard', 'full', 'poetry']),
    featureConfig: PropTypes.object,
    placeholder: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSave: PropTypes.func,
    onChange: PropTypes.func,
};

export default Editor;
