import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lexicl imports
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
    $createParagraphNode,
    $createRangeSelection,
    $getSelection,
    $insertNodes,
    $isNodeSelection,
    $isRootOrShadowRoot,
    $setSelection,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    createCommand,
    DRAGOVER_COMMAND,
    DRAGSTART_COMMAND,
    DROP_COMMAND,
    getDOMSelectionFromTarget,
    isHTMLElement,
} from 'lexical';

// UI Library imports
import { Button, Checkbox, FileButton, Modal, Select, Stack, TextInput } from '@mantine/core';

// Local imports
import {
    $createInlineImageNode,
    $isInlineImageNode,
    InlineImageNode,
} from '../nodes/inlineImageNode/inlineImageNode';
import '../nodes/inlineImageNode/inlineImageNode.css';

//---------------------------------------------
export const INSERT_INLINE_IMAGE_COMMAND = createCommand('INSERT_INLINE_IMAGE_COMMAND');

export function InsertInlineImageDialog({
    opened,
    activeEditor,
    onClose,
}) {
    const { t } = useTranslation()
    const hasModifier = useRef(false);

    const [src, setSrc] = useState('');
    const [altText, setAltText] = useState('');
    const [showCaption, setShowCaption] = useState(false);
    const [position, setPosition] = useState('left');

    const isDisabled = src === '';

    const loadImage = (file) => {
        const reader = new FileReader();
        reader.onload = function () {
            if (typeof reader.result === 'string') {
                setSrc(reader.result);
            }
            return '';
        };
        if (file !== null) {
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (opened) {
            setSrc('')
            setAltText('')
            setShowCaption(false)
            setPosition('left')
        }
    }, [opened]);

    useEffect(() => {
        hasModifier.current = false;
        const handler = (e) => {
            hasModifier.current = e.altKey;
        };
        document.addEventListener('keydown', handler);
        return () => {
            document.removeEventListener('keydown', handler);
        };
    }, [activeEditor]);

    const handleOnClick = () => {
        const payload = { altText, position, showCaption, src };
        activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, payload);
        onClose();
    };

    return (<Modal opened={opened} onClose={onClose}>
        <Stack>
            <FileButton onChange={loadImage} accept="image/png, image/jpeg" >
                {(props) => <Button variant='default' {...props}>{t('editor.insertImage.imageUpload.title')}</Button>}
            </FileButton>

            <TextInput
                label={t('editor.insertImage.altText.title')}
                placeholder={t('editor.insertImage.altText.placeholder')}
                onChange={event => setAltText(event.currentTarget.value)}
                value={altText}
            />

            <Select
                value={position}
                label={t('editor.insertImage.position.title')}
                onChange={setPosition}
                data={[
                    { value: 'left', label: t('editor.insertImage.position.left') },
                    { value: 'right', label: t('editor.insertImage.position.right') },
                    { value: 'full', label: t('editor.insertImage.position.fullWidth') },
                ]}>
            </Select>

            <Checkbox
                checked={showCaption}
                onChange={(event) => setShowCaption(event.currentTarget.checked)}
                label={t('editor.insertImage.caption.title')} />

            <Button disabled={isDisabled} onClick={handleOnClick}>
                {t('actions.ok')}
            </Button>
        </Stack>
    </Modal>
    );
}

InsertInlineImageDialog.propTypes = {
    opened: PropTypes.bool,
    activeEditor: PropTypes.any,
    onClose: PropTypes.func
}

export default function InlineImagePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([InlineImageNode])) {
            throw new Error('ImagesPlugin: ImageNode not registered on editor');
        }

        return mergeRegister(
            editor.registerCommand(
                INSERT_INLINE_IMAGE_COMMAND,
                (payload) => {
                    const imageNode = $createInlineImageNode(payload);
                    $insertNodes([imageNode]);
                    if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
                        $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
                    }

                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),
            editor.registerCommand(
                DRAGSTART_COMMAND,
                (event) => {
                    return $onDragStart(event);
                },
                COMMAND_PRIORITY_HIGH,
            ),
            editor.registerCommand(
                DRAGOVER_COMMAND,
                (event) => {
                    return $onDragover(event);
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                DROP_COMMAND,
                (event) => {
                    return $onDrop(event, editor);
                },
                COMMAND_PRIORITY_HIGH,
            ),
        );
    }, [editor]);

    return null;
}

const TRANSPARENT_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const img = document.createElement('img');
img.src = TRANSPARENT_IMAGE;

function $onDragStart(event) {
    const node = $getImageNodeInSelection();
    if (!node) {
        return false;
    }
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) {
        return false;
    }
    dataTransfer.setData('text/plain', '_');
    dataTransfer.setDragImage(img, 0, 0);
    dataTransfer.setData(
        'application/x-lexical-drag',
        JSON.stringify({
            data: {
                altText: node.__altText,
                caption: node.__caption,
                height: node.__height,
                key: node.getKey(),
                showCaption: node.__showCaption,
                src: node.__src,
                width: node.__width,
            },
            type: 'image',
        }),
    );

    return true;
}

function $onDragover(event) {
    const node = $getImageNodeInSelection();
    if (!node) {
        return false;
    }
    if (!canDropImage(event)) {
        event.preventDefault();
    }
    return true;
}

function $onDrop(event, editor) {
    const node = $getImageNodeInSelection();
    if (!node) {
        return false;
    }
    const data = getDragImageData(event);
    if (!data) {
        return false;
    }
    event.preventDefault();
    if (canDropImage(event)) {
        const range = getDragSelection(event);
        node.remove();
        const rangeSelection = $createRangeSelection();
        if (range !== null && range !== undefined) {
            rangeSelection.applyDOMRange(range);
        }
        $setSelection(rangeSelection);
        editor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, data);
    }
    return true;
}

function $getImageNodeInSelection() {
    const selection = $getSelection();
    if (!$isNodeSelection(selection)) {
        return null;
    }
    const nodes = selection.getNodes();
    const node = nodes[0];
    return $isInlineImageNode(node) ? node : null;
}

function getDragImageData(event) {
    const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
    if (!dragData) {
        return null;
    }
    const { type, data } = JSON.parse(dragData);
    if (type !== 'image') {
        return null;
    }

    return data;
}

function canDropImage(event) {
    const target = event.target;
    return !!(
        isHTMLElement(target) &&
        !target.closest('code, span.editor-image') &&
        isHTMLElement(target.parentElement) &&
        target.parentElement.closest('div.ContentEditable__root')
    );
}

function getDragSelection(event) {
    let range;
    const domSelection = getDOMSelectionFromTarget(event.target);
    if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(event.clientX, event.clientY);
    } else if (event.rangeParent && domSelection !== null) {
        domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
        range = domSelection.getRangeAt(0);
    } else {
        throw Error('Cannot get the selection when dragging');
    }

    return range;
}
