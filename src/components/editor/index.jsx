import PropTypes from 'prop-types';
import { useMemo } from 'react';
import cx from 'clsx';
import { useComputedColorScheme, Group, Select, Slider, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

// Editor package
import { EditorRoot, DEFAULT_FONT_OPTIONS } from '@inshapardaz/likhari-react';

// Local imports
import { apiAutoCorrectStore, apiUserWordStore, apiCompletionStore } from './stores';
import classes from './editorView.module.css';

// likhari-react's own localStorage-backed stores, paired with the API adapters
// above so corrections/dictionary/completions keep working offline too.
import {
    localStorageAutoCorrectStore,
    localStorageUserWordStore,
} from '@inshapardaz/likhari-react';

//-----------------------------------------

const FONT_OPTIONS = DEFAULT_FONT_OPTIONS.map(({ name, family }) => ({ value: family, label: name }));

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
    font: { family: true, size: true, scope: 'both' },
    blocks: { headingLevels: [1, 2, 3, 4, 5, 6] },
    joinLines: true,
};

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

    // View-only preferences: which font/zoom the canvas renders text in when
    // there's no explicit formatting on it. Kept in this browser's
    // localStorage (same keys the old in-house editor used), independent of
    // the toolbar's own font-family/size controls, which apply real document
    // formatting that markdown deliberately doesn't carry across save/reload
    // (docs/markdown-dialect.md: "Font family and size are intentionally not
    // supported").
    const [viewFont, setViewFont] = useLocalStorage({ key: 'editor-view-font', defaultValue: '' });
    const [viewZoom, setViewZoom] = useLocalStorage({ key: 'editor-text-zoom', defaultValue: 100 });

    return (
        <div
            className={cx(classes.canvasWrapper, {
                [classes.customFont]: Boolean(viewFont),
                [classes.customZoom]: viewZoom !== 100,
            })}
            style={{
                '--view-font': viewFont || undefined,
                '--view-zoom': viewZoom / 100,
                height: height ?? '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div className={classes.viewBar}>
                <Select
                    size="xs"
                    w={200}
                    placeholder="Default font"
                    data={FONT_OPTIONS}
                    value={viewFont || null}
                    onChange={(value) => setViewFont(value ?? '')}
                    clearable
                />
                <Group gap="xs" wrap="nowrap" w={180}>
                    <Text size="xs" c="dimmed">{viewZoom}%</Text>
                    <Slider
                        size="xs"
                        min={50}
                        max={200}
                        step={10}
                        value={viewZoom}
                        onChange={setViewZoom}
                        style={{ flex: 1 }}
                    />
                </Group>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <EditorRoot
                    documentId={documentId}
                    initialContent={initialContent}
                    featurePreset={featurePreset}
                    featureConfig={{ ...EXTRA_FEATURES, ...featureConfig }}
                    autoCorrectStores={AUTO_CORRECT_STORES}
                    dictionaryStores={DICTIONARY_STORES}
                    completionStores={COMPLETION_STORES}
                    autoCompleteLanguage={locale}
                    colorScheme={colorScheme}
                    locale={locale}
                    placeholder={placeholder}
                    height="100%"
                    autosave
                    restoreDraft="prompt"
                    navigationGuard="confirm"
                    onSave={onSave}
                    onChange={onChange}
                />
            </div>
        </div>
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
