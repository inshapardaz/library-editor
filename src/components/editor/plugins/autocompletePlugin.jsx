import PropTypes from 'prop-types';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isAtNodeEnd } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
    $addUpdateTag,
    $createTextNode,
    $getNodeByKey,
    $getSelection,
    $isRangeSelection,
    $isTextNode,
    $setSelection,
    COMMAND_PRIORITY_LOW,
    KEY_ARROW_RIGHT_COMMAND,
    KEY_TAB_COMMAND,
} from 'lexical';
import { useCallback, useEffect } from 'react';

import { useToolbarState } from './toolbarPlugin/toolbarContext';
import {
    $createAutocompleteNode,
    AutocompleteNode,
} from '../nodes/autocompleteNode';
import { addSwipeRightListener } from '../utils/swipe';

const HISTORY_MERGE = { tag: 'history-merge' };
const MIN_SEARCH_LENGTH = 2;
export const uuid = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);

function $search(selection) {
    if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        return [false, ''];
    }
    const node = selection.getNodes()[0];
    const anchor = selection.anchor;
    // Check siblings?
    if (!$isTextNode(node) || !node.isSimpleText() || !$isAtNodeEnd(anchor)) {
        return [false, ''];
    }
    const word = [];
    const text = node.getTextContent();
    let i = node.getTextContentSize();
    let c;
    while (i-- && i >= 0 && (c = text[i]) !== ' ') {
        word.push(c);
    }
    if (word.length === 0) {
        return [false, ''];
    }
    return [true, word.reverse().join('')];
}

function useQuery(wordList) {
    return useCallback((searchText) => {
        const server = new AutocompleteServer(wordList);
        console.time('query');
        const response = server.query(searchText);
        console.timeEnd('query');
        return response;
    }, []);
}

function formatSuggestionText(suggestion) {
    const userAgentData = window.navigator.userAgentData;
    const isMobile =
        userAgentData !== undefined
            ? userAgentData.mobile
            : window.innerWidth <= 800 && window.innerHeight <= 600;

    return `${suggestion} ${isMobile ? '(SWIPE \u2B95)' : '(TAB)'}`;
}

export default function AutocompletePlugin({ wordList }) {
    const [editor] = useLexicalComposerContext();
    const query = useQuery(wordList);
    const { toolbarState } = useToolbarState();

    useEffect(() => {
        let autocompleteNodeKey = null;
        let lastMatch = null;
        let lastSuggestion = null;
        let searchPromise = null;
        let prevNodeFormat = 0;
        function $clearSuggestion() {
            const autocompleteNode =
                autocompleteNodeKey !== null
                    ? $getNodeByKey(autocompleteNodeKey)
                    : null;
            if (autocompleteNode !== null && autocompleteNode.isAttached()) {
                autocompleteNode.remove();
                autocompleteNodeKey = null;
            }
            if (searchPromise !== null) {
                searchPromise.dismiss();
                searchPromise = null;
            }
            lastMatch = null;
            lastSuggestion = null;
            prevNodeFormat = 0;
        }
        function updateAsyncSuggestion(
            refSearchPromise,
            newSuggestion,
        ) {
            if (searchPromise !== refSearchPromise || newSuggestion === null) {
                // Outdated or no suggestion
                return;
            }
            editor.update(() => {
                const selection = $getSelection();
                const [hasMatch, match] = $search(selection);
                if (!hasMatch || match !== lastMatch || !$isRangeSelection(selection)) {
                    // Outdated
                    return;
                }
                const selectionCopy = selection.clone();
                const prevNode = selection.getNodes()[0];
                prevNodeFormat = prevNode.getFormat();
                const node = $createAutocompleteNode(
                    formatSuggestionText(newSuggestion),
                    uuid,
                )
                    .setFormat(prevNodeFormat)
                    .setStyle(`font-size: ${toolbarState.fontSize}`);
                autocompleteNodeKey = node.getKey();
                selection.insertNodes([node]);
                $setSelection(selectionCopy);
                lastSuggestion = newSuggestion;
            }, HISTORY_MERGE);
        }

        function $handleAutocompleteNodeTransform(node) {
            const key = node.getKey();
            if (node.__uuid === uuid && key !== autocompleteNodeKey) {
                // Max one Autocomplete node per session
                $clearSuggestion();
            }
        }
        function handleUpdate() {
            editor.update(() => {
                const selection = $getSelection();
                const [hasMatch, match] = $search(selection);
                if (!hasMatch) {
                    $clearSuggestion();
                    return;
                }
                if (match === lastMatch) {
                    return;
                }
                $clearSuggestion();
                searchPromise = query(match);
                searchPromise.promise
                    .then((newSuggestion) => {
                        if (searchPromise !== null) {
                            updateAsyncSuggestion(searchPromise, newSuggestion);
                        }
                    })
                    .catch((e) => {
                        if (e !== 'Dismissed') {
                            console.error(e);
                        }
                    });
                lastMatch = match;
            }, HISTORY_MERGE);
        }
        function $handleAutocompleteIntent() {
            if (lastSuggestion === null || autocompleteNodeKey === null) {
                return false;
            }
            const autocompleteNode = $getNodeByKey(autocompleteNodeKey);
            if (autocompleteNode === null) {
                return false;
            }
            const textNode = $createTextNode(lastSuggestion)
                .setFormat(prevNodeFormat)
                .setStyle(`font-size: ${toolbarState.fontSize}`);
            autocompleteNode.replace(textNode);
            textNode.selectNext();
            $clearSuggestion();
            return true;
        }
        function $handleKeypressCommand(e) {
            if ($handleAutocompleteIntent()) {
                e.preventDefault();
                return true;
            }
            return false;
        }
        function handleSwipeRight(_force, e) {
            editor.update(() => {
                if ($handleAutocompleteIntent()) {
                    e.preventDefault();
                } else {
                    $addUpdateTag(HISTORY_MERGE.tag);
                }
            });
        }
        function unmountSuggestion() {
            editor.update(() => {
                $clearSuggestion();
            }, HISTORY_MERGE);
        }

        const rootElem = editor.getRootElement();

        return mergeRegister(
            editor.registerNodeTransform(
                AutocompleteNode,
                $handleAutocompleteNodeTransform,
            ),
            editor.registerUpdateListener(handleUpdate),
            editor.registerCommand(
                KEY_TAB_COMMAND,
                $handleKeypressCommand,
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_ARROW_RIGHT_COMMAND,
                $handleKeypressCommand,
                COMMAND_PRIORITY_LOW,
            ),
            ...(rootElem !== null
                ? [addSwipeRightListener(rootElem, handleSwipeRight)]
                : []),
            unmountSuggestion,
        );
    }, [editor, query, toolbarState.fontSize]);

    return null;
}

AutocompletePlugin.propTypes = {
    wordList: PropTypes.any
};


class AutocompleteServer {
    LATENCY = 200;
    constructor(wordList) {
        this.DATABASE = wordList
    }

    query = (searchText) => {
        let isDismissed = false;

        const dismiss = () => {
            isDismissed = true;
        };
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (isDismissed) {
                    return reject('Dismissed');
                }
                const searchTextLength = searchText.length;
                if (searchText === '' || searchTextLength < MIN_SEARCH_LENGTH) {
                    return resolve(null);
                }
                const char0 = searchText.charCodeAt(0);
                const isCapitalized = char0 >= 65 && char0 <= 90;
                const caseInsensitiveSearchText = isCapitalized
                    ? String.fromCharCode(char0 + 32) + searchText.substring(1)
                    : searchText;
                const match = this.DATABASE.find(
                    (dictionaryWord) =>
                        dictionaryWord.startsWith(caseInsensitiveSearchText) ?? null,
                );
                if (match === undefined) {
                    return resolve(null);
                }
                const matchCapitalized = isCapitalized
                    ? String.fromCharCode(match.charCodeAt(0) - 32) + match.substring(1)
                    : match;
                const autocompleteChunk = matchCapitalized.substring(searchTextLength);
                if (autocompleteChunk === '') {
                    return resolve(null);
                }
                return resolve(autocompleteChunk);
            }, this.LATENCY);
        });

        return {
            dismiss,
            promise,
        };
    };
}
