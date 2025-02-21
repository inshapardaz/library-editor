import React, { Suspense } from 'react';

// Lexical Imports
import { $applyNodeReplacement, createEditor, DecoratorNode } from 'lexical';

// Local Impports
import classes from './imageNode.module.css'
//------------------------------------


const ImageComponent = React.lazy(() => import('./imageComponent'));

function isGoogleDocCheckboxImg(img) {
    return (
        img.parentElement != null &&
        img.parentElement.tagName === 'LI' &&
        img.previousSibling === null &&
        img.getAttribute('aria-roledescription') === 'checkbox'
    );
}

function $convertImageElement(domNode) {
    const img = domNode;
    if (img.src.startsWith('file:///') || isGoogleDocCheckboxImg(img)) {
        return null;
    }
    const { alt: altText, src, width, height } = img;
    const node = $createImageNode({ altText, height, src, width });
    return { node };
}

export class ImageNode extends DecoratorNode {

    static getType() {
        return 'image';
    }

    static clone(node) {
        return new ImageNode(
            node.__src,
            node.__altText,
            node.__maxWidth,
            node.__width,
            node.__height,
            node.__showCaption,
            node.__caption,
            node.__captionsEnabled,
            node.__key,
        );
    }

    static importJSON(serializedNode) {
        const { altText, height, width, maxWidth, src, showCaption } = serializedNode;
        return $createImageNode({
            altText,
            height,
            maxWidth,
            showCaption,
            src,
            width,
        }).updateFromJSON(serializedNode);
    }

    updateFromJSON(serializedNode) {
        const node = super.updateFromJSON(serializedNode);
        const { caption } = serializedNode;

        const nestedEditor = node.__caption;
        const editorState = nestedEditor.parseEditorState(caption.editorState);
        if (!editorState.isEmpty()) {
            nestedEditor.setEditorState(editorState);
        }
        return node;
    }

    exportDOM() {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__altText);
        element.setAttribute('width', this.__width.toString());
        element.setAttribute('height', this.__height.toString());
        return { element };
    }

    static importDOM() {
        return {
            img: () => ({
                conversion: $convertImageElement,
                priority: 0,
            }),
        };
    }

    constructor(
        src,
        altText,
        maxWidth,
        width,
        height,
        showCaption,
        caption,
        captionsEnabled,
        key,
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__maxWidth = maxWidth;
        this.__width = width || 'inherit';
        this.__height = height || 'inherit';
        this.__showCaption = showCaption || false;
        this.__caption =
            caption ||
            createEditor({
                nodes: [],
            });
        this.__captionsEnabled = captionsEnabled || captionsEnabled === undefined;
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            altText: this.getAltText(),
            caption: this.__caption.toJSON(),
            height: this.__height === 'inherit' ? 0 : this.__height,
            maxWidth: this.__maxWidth,
            showCaption: this.__showCaption,
            src: this.getSrc(),
            width: this.__width === 'inherit' ? 0 : this.__width,
        };
    }

    setWidthAndHeight(
        width,
        height,
    ) {
        const writable = this.getWritable();
        writable.__width = width;
        writable.__height = height;
    }

    setShowCaption(showCaption) {
        const writable = this.getWritable();
        writable.__showCaption = showCaption;
    }

    // View

    createDOM() {
        const span = document.createElement('span');
        const className = classes.editorImage;
        if (className !== undefined) {
            span.className = className;
        }
        return span;
    }

    updateDOM() {
        return false;
    }

    getSrc() {
        return this.__src;
    }

    getAltText() {
        return this.__altText;
    }

    getWidth() {
        return this.__width;
    }

    getHeight() {
        return this.__height;
    }

    decorate() {
        return (
            <Suspense fallback={null}>
                <ImageComponent
                    src={this.__src}
                    altText={this.__altText}
                    width={this.__width}
                    height={this.__height}
                    maxWidth={this.__maxWidth}
                    nodeKey={this.getKey()}
                    showCaption={this.__showCaption}
                    caption={this.__caption}
                    captionsEnabled={this.__captionsEnabled}
                    resizable={true}
                />
            </Suspense>
        );
    }
}

export function $createImageNode({
    altText,
    height,
    maxWidth = 500,
    captionsEnabled,
    src,
    width,
    showCaption,
    caption,
    key,
}) {
    return $applyNodeReplacement(
        new ImageNode(
            src,
            altText,
            maxWidth,
            width,
            height,
            showCaption,
            caption,
            captionsEnabled,
            key,
        ),
    );
}

export function $isImageNode(
    node,
) {
    return node instanceof ImageNode;
}
