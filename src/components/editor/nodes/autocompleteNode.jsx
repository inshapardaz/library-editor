
import { TextNode } from 'lexical';

import { uuid as UUID } from '../plugins/autocompletePlugin';

export class AutocompleteNode extends TextNode {

    static clone(node) {
        return new AutocompleteNode(node.__text, node.__uuid, node.__key);
    }

    static getType() {
        return 'autocomplete';
    }

    static importJSON(serializedNode) {
        return $createAutocompleteNode(
            serializedNode.text,
            serializedNode.uuid,
        ).updateFromJSON(serializedNode);
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            uuid: this.__uuid,
        };
    }

    constructor(text, uuid, key) {
        super(text, key);
        this.__uuid = uuid;
    }

    updateDOM() {
        return false;
    }

    exportDOM() {
        return { element: null };
    }

    excludeFromCopy() {
        return true;
    }

    createDOM(config) {
        const dom = super.createDOM(config);
        dom.classList.add(config.theme.autocomplete);
        if (this.__uuid !== UUID) {
            dom.style.display = 'none';
        }
        return dom;
    }
}

export function $createAutocompleteNode(text, uuid) {
    return new AutocompleteNode(text, uuid).setMode('token');
}
