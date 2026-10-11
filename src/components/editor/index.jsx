import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useComputedColorScheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

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

const PER_DOCUMENT_FONT_KEY_PREFIX = 'likhari:font:';

// EditorRoot's uniform-font toolbar controls always write a per-document
// entry (likhari:font:{documentId}) on change, even when fontFamily/zoom are
// passed as controlled props — there's no prop to suppress that internal
// write. Since this app keeps the real setting in one global entry instead
// (see Editor below), every per-document one is dead weight; this removes
// them outright, including ones a previous session already wrote before the
// global setting existed.
const clearPerDocumentFontSettings = () => {
    try {
        Object.keys(localStorage)
            .filter((key) => key.startsWith(PER_DOCUMENT_FONT_KEY_PREFIX))
            .forEach((key) => localStorage.removeItem(key));
    } catch {
        // Storage unavailable: nothing to clean up.
    }
};

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
 * preference rather than per-selection document formatting (markdown
 * deliberately doesn't carry font/size — docs/markdown-dialect.md).
 *
 * EditorRoot normally remembers uniform font/zoom per `documentId`, but this
 * app wants one global preference shared by every editor instance, so
 * fontFamily/zoom/onFontChange are passed explicitly (controlled) backed by
 * a single shared localStorage entry instead of the package's per-document
 * default — and the per-document entries it still writes internally on every
 * toolbar change are swept away immediately (see clearPerDocumentFontSettings).
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

    const [uniformFont, setUniformFont] = useLocalStorage({
        key: 'likhari-uniform-font',
        defaultValue: { fontFamily: undefined, zoom: 100 },
    });

    const handleFontChange = useCallback(
        (change) => {
            setUniformFont(change);
            clearPerDocumentFontSettings();
        },
        [setUniformFont],
    );

    // One-time sweep for leftovers from before this app controlled the
    // setting globally (or from any EditorRoot internal write this render
    // missed, e.g. a change made right before unmount).
    useEffect(() => {
        clearPerDocumentFontSettings();
    }, []);

    return (
        <EditorRoot
            documentId={documentId}
            initialContent={initialContent}
            featurePreset={featurePreset}
            featureConfig={{ ...EXTRA_FEATURES, ...featureConfig }}
            fontMode="uniform"
            fontFamily={uniformFont.fontFamily}
            zoom={uniformFont.zoom}
            onFontChange={handleFontChange}
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
