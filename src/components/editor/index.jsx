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

/**
 * Thin wrapper around likhari-react's EditorRoot: fixes the stores (so every
 * call site shares the same backend-backed spellcheck/autocorrect/autocomplete
 * sources) and maps this app's language/theme state onto the editor's props.
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
            featureConfig={featureConfig}
            autoCorrectStores={AUTO_CORRECT_STORES}
            dictionaryStores={DICTIONARY_STORES}
            completionStores={COMPLETION_STORES}
            autoCompleteLanguage={locale}
            colorScheme={colorScheme}
            locale={locale}
            placeholder={placeholder}
            height={height}
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
