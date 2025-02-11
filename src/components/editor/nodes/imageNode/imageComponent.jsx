import PropTypes from 'prop-types';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lexical Import
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
    $getNodeByKey,
    $getSelection,
    $isNodeSelection,
    $isRangeSelection,
    $setSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    createCommand,
    DRAGSTART_COMMAND,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    KEY_ENTER_COMMAND,
    KEY_ESCAPE_COMMAND,
    RootNode,
    SELECTION_CHANGE_COMMAND,
    TextNode,
} from 'lexical';

// Local Imports
import brokenImage from '@/assets/images/image-broken.svg';
import { $isImageNode } from './imageNode'
import ImageResizer from '../../ui/imageResizer';
import classes from './imageNode.module.css';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

//------------------------------------------
const imageCache = new Set();

// eslint-disable-next-line react-refresh/only-export-components
export const RIGHT_CLICK_IMAGE_COMMAND = createCommand('RIGHT_CLICK_IMAGE_COMMAND');

function useSuspenseImage(src) {
    if (!imageCache.has(src)) {
        throw new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imageCache.add(src);
                resolve(null);
            };
            img.onerror = () => {
                imageCache.add(src);
            };
        });
    }
}

function LazyImage({
    altText,
    className,
    imageRef,
    src,
    width,
    height,
    maxWidth,
    onError,
}) {
    useSuspenseImage(src);
    return (
        <img
            className={className || undefined}
            src={src}
            alt={altText}
            ref={imageRef}
            style={{
                height,
                maxWidth,
                width,
            }}
            onError={onError}
            draggable="false"

        />
    );
}
LazyImage.propTypes = {
    altText: PropTypes.string,
    className: PropTypes.string,
    height: PropTypes.any,
    imageRef: PropTypes.any,
    maxWidth: PropTypes.any,
    src: PropTypes.string,
    width: PropTypes.any,
    onError: PropTypes.func
}

function BrokenImage() {
    return (
        <img
            src={brokenImage}
            style={{
                height: 200,
                opacity: 0.2,
                width: 200,
            }}
            draggable="false"
        />
    );
}

export default function ImageComponent({
    src,
    altText,
    nodeKey,
    resizable,
    width,
    height,
    maxWidth,
    showCaption,
    caption,
    captionsEnabled
}) {
    const { t } = useTranslation();
    const imageRef = useRef(null);
    const buttonRef = useRef(null);
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [editor] = useLexicalComposerContext();
    const [selection, setSelection] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const activeEditorRef = useRef(null);
    const [isLoadError, setIsLoadError] = useState(false);
    const isEditable = useLexicalEditable();

    const $onDelete = useCallback(
        (payload) => {
            const deleteSelection = $getSelection();
            if (isSelected && $isNodeSelection(deleteSelection)) {
                const event = payload;
                event.preventDefault();
                deleteSelection.getNodes().forEach((node) => {
                    if ($isImageNode(node)) {
                        node.remove();
                    }
                });
            }
            return false;
        },
        [isSelected],
    );

    const $onEnter = useCallback(
        (event) => {
            const latestSelection = $getSelection();
            const buttonElem = buttonRef.current;
            if (
                isSelected &&
                $isNodeSelection(latestSelection) &&
                latestSelection.getNodes().length === 1
            ) {
                if (showCaption) {
                    // Move focus into nested editor
                    $setSelection(null);
                    event.preventDefault();
                    caption.focus();
                    return true;
                } else if (
                    buttonElem !== null &&
                    buttonElem !== document.activeElement
                ) {
                    event.preventDefault();
                    buttonElem.focus();
                    return true;
                }
            }
            return false;
        },
        [caption, isSelected, showCaption],
    );

    const $onEscape = useCallback(
        (event) => {
            if (
                activeEditorRef.current === caption ||
                buttonRef.current === event.target
            ) {
                $setSelection(null);
                editor.update(() => {
                    setSelected(true);
                    const parentRootElement = editor.getRootElement();
                    if (parentRootElement !== null) {
                        parentRootElement.focus();
                    }
                });
                return true;
            }
            return false;
        },
        [caption, editor, setSelected],
    );

    const onClick = useCallback(
        (payload) => {
            const event = payload;
            if (isResizing) {
                return true;
            }

            if (event.target === imageRef.current) {
                if (event.shiftKey) {
                    setSelected(!isSelected);
                } else {
                    clearSelection();
                    setSelected(true);
                }
                return true;
            }

            return false;
        },
        [isResizing, setSelected, isSelected, clearSelection],
    );

    const onRightClick = useCallback(
        (event) => {
            editor.getEditorState().read(() => {
                const latestSelection = $getSelection();
                const domElement = event.target;
                if (
                    domElement.tagName === 'IMG' &&
                    $isRangeSelection(latestSelection) &&
                    latestSelection.getNodes().length === 1
                ) {
                    editor.dispatchCommand(
                        RIGHT_CLICK_IMAGE_COMMAND,
                        event,
                    );
                }
            });
        },
        [editor],
    );

    useEffect(() => {
        let isMounted = true;
        const rootElement = editor.getRootElement();
        const unregister = mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                if (isMounted) {
                    setSelection(editorState.read(() => $getSelection()));
                }
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_, activeEditor) => {
                    activeEditorRef.current = activeEditor;
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                CLICK_COMMAND,
                onClick,
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                RIGHT_CLICK_IMAGE_COMMAND,
                onClick,
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                DRAGSTART_COMMAND,
                (event) => {
                    if (event.target === imageRef.current) {
                        // TODO This is just a temporary workaround for FF to behave like other browsers.
                        // Ideally, this handles drag & drop too (and all browsers).
                        event.preventDefault();
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_DELETE_COMMAND,
                $onDelete,
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_BACKSPACE_COMMAND,
                $onDelete,
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW),
            editor.registerCommand(
                KEY_ESCAPE_COMMAND,
                $onEscape,
                COMMAND_PRIORITY_LOW,
            ),
        );

        rootElement?.addEventListener('contextmenu', onRightClick);

        return () => {
            isMounted = false;
            unregister();
            rootElement?.removeEventListener('contextmenu', onRightClick);
        };
    }, [
        clearSelection,
        editor,
        isSelected,
        isResizing,
        nodeKey,
        $onDelete,
        $onEnter,
        $onEscape,
        onClick,
        onRightClick,
        setSelected
    ]);


    const setShowCaption = () => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) {
                node.setShowCaption(true);
            }
        });
    };

    const onResizeEnd = (nextWidth, nextHeight) => {
        // Delay hiding the resize bars for click case
        setTimeout(() => {
            setIsResizing(false);
        }, 200);

        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) {
                node.setWidthAndHeight(nextWidth, nextHeight);
            }
        });
    };

    const onResizeStart = () => {
        setIsResizing(true);
    };

    const draggable = isSelected && $isNodeSelection(selection) && !isResizing;
    const isFocused = (isSelected || isResizing) && isEditable;
    return (
        <Suspense fallback={null}>
            <>
                <div draggable={draggable}>
                    {isLoadError ? (
                        <BrokenImage />
                    ) : (
                        <LazyImage
                            className={
                                `${isFocused ? classes.imageFocused : null} ${$isNodeSelection(selection) ? classes.imageDraggable : null}`
                            }
                            src={src}
                            altText={altText}
                            imageRef={imageRef}
                            width={width}
                            height={height}
                            maxWidth={maxWidth}
                            onError={() => setIsLoadError(true)}
                        />
                    )}
                </div>
                {showCaption && (
                    <div className={classes.captionContainer}>
                        <LexicalNestedComposer
                            initialEditor={caption}
                            initialNodes={[
                                RootNode,
                                TextNode,
                            ]}>
                            <PlainTextPlugin
                                contentEditable={<ContentEditable className={classes.contentEditable}
                                    placeholder={<div className={classes.placeholder}>
                                        {t('editor.placeholder')}
                                    </div>}
                                />}
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                        </LexicalNestedComposer>
                    </div>
                )}
                {resizable && $isNodeSelection(selection) && isFocused && (
                    <ImageResizer
                        showCaption={showCaption}
                        setShowCaption={setShowCaption}
                        editor={editor}
                        buttonRef={buttonRef}
                        imageRef={imageRef}
                        maxWidth={maxWidth}
                        onResizeStart={onResizeStart}
                        onResizeEnd={onResizeEnd}
                        captionsEnabled={!isLoadError && captionsEnabled}
                    />
                )}
            </>
        </Suspense>
    );
}

ImageComponent.propTypes = {
    src: PropTypes.string,
    altText: PropTypes.string,
    className: PropTypes.string,
    nodeKey: PropTypes.string,
    height: PropTypes.any,
    imageRef: PropTypes.any,
    maxWidth: PropTypes.any,
    width: PropTypes.any,
    resizable: PropTypes.bool,
    showCaption: PropTypes.bool,
    caption: PropTypes.string,
    captionsEnabled: PropTypes.bool,
    onError: PropTypes.func
}
