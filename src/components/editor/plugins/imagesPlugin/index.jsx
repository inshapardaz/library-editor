import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lexical Imports
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

// UI Library Imports
import { Button, FileButton, Modal, Stack, TextInput } from '@mantine/core';

// Local Imports
import {
    $createImageNode,
    $isImageNode,
    ImageNode,
} from '../../nodes/imageNode/imageNode';


// eslint-disable-next-line react-refresh/only-export-components
export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND');

export function InsertImageUriDialogBody({ opened, onClose, onClick }) {
    const { t } = useTranslation()
    const [src, setSrc] = useState('');
    const [altText, setAltText] = useState('');

    const isDisabled = src === '';

    useEffect(() => {
        if (opened) {
            setSrc('');
            setAltText('')
        }
    }, [opened]);

    return (<Modal opened={opened} onClose={onClose}>
        <Stack>
            <TextInput
                label={t('editor.insertImage.url.title')}
                placeholder={t('editor.insertImage.url.placeholder')}
                onChange={event => setSrc(event.currentTarget.value)}
                value={src}
            />
            <TextInput
                label={t('editor.insertImage.altText.title')}
                placeholder={t('editor.insertImage.altText.placeholder')}
                onChange={event => setAltText(event.currentTarget.value)}
                value={altText}
            />
            <Button
                disabled={isDisabled}
                onClick={() => onClick({ altText, src })}>
                {t('actions.ok')}
            </Button>
        </Stack>
    </Modal>
    );
}

InsertImageUriDialogBody.propTypes = {
    opened: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func
}

export function InsertImageUploadedDialogBody({ opened, onClick, onClose }) {
    const { t } = useTranslation()
    const [src, setSrc] = useState('');
    const [altText, setAltText] = useState('');

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
        }
    }, [opened]);


    return (
        <Modal opened={opened} onClose={onClose}>
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
                <Button
                    disabled={isDisabled}
                    onClick={() => onClick({ altText, src })}>
                    Confirm
                </Button>
            </Stack>
        </Modal>
    );
}

InsertImageUploadedDialogBody.propTypes = {
    opened: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func
}


export function InsertImageDialog({
    mode = 'file',
    opened = false,
    activeEditor,
    onClose,
}) {
    const onClick = (payload) => {
        activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
        onClose();
    };

    if (mode === 'url') {
        return (<InsertImageUriDialogBody opened={opened} onClick={onClick} onClose={onClose} />);
    } else if (mode === 'file') {
        return (<InsertImageUploadedDialogBody opened={opened} onClick={onClick} onClose={onClose} />);
    }

    return null;
}

InsertImageDialog.propTypes = {
    mode: PropTypes.string,
    opened: PropTypes.bool,
    activeEditor: PropTypes.any,
    onClose: PropTypes.func
}


export default function ImagesPlugin({ captionsEnabled }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            throw new Error('ImagesPlugin: ImageNode not registered on editor');
        }

        return mergeRegister(
            editor.registerCommand(
                INSERT_IMAGE_COMMAND,
                (payload) => {
                    const imageNode = $createImageNode(payload);
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
    }, [captionsEnabled, editor]);

    return null;
}


ImagesPlugin.propTypes = {
    captionsEnabled: PropTypes.bool
}

const TRANSPARENT_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
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
                maxWidth: node.__maxWidth,
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
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
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
    return $isImageNode(node) ? node : null;
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
        throw Error(`Cannot get the selection when dragging`);
    }

    return range;
}
