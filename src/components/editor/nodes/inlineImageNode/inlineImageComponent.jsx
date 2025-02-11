import PropTypes from 'prop-types';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lexical Imports
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

// UI Library imports
import { Button, Checkbox, Modal, Select, Stack, TextInput } from '@mantine/core';

// Local Imports
import './inlineImageNode.css';

import LinkPlugin from '../../plugins/link.Plugin';
import { $isInlineImageNode } from './inlineImageNode';
import { useDisclosure } from '@mantine/hooks';

//---------------------------------------------

const imageCache = new Set();

function useSuspenseImage(src) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
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
  position,
}) {
  useSuspenseImage(src);
  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      data-position={position}
      style={{
        display: 'block',
        height,
        width,
      }}
      draggable="false"
    />
  );
}

LazyImage.propTypes = {
  altText: PropTypes.string,
  className: PropTypes.string,
  imageRef: PropTypes.any,
  src: PropTypes.string,
  width: PropTypes.any,
  height: PropTypes.any,
  position: PropTypes.any
}

export function UpdateInlineImageDialog({
  opened,
  activeEditor,
  nodeKey,
  onClose,
}) {
  const { t } = useTranslation();
  const editorState = activeEditor.getEditorState();
  const node = editorState.read(
    () => $getNodeByKey(nodeKey),
  );
  const [altText, setAltText] = useState(node.getAltText());
  const [showCaption, setShowCaption] = useState(node.getShowCaption());
  const [position, setPosition] = useState(node.getPosition());

  const handleOnConfirm = () => {
    const payload = { altText, position, showCaption };
    if (node) {
      activeEditor.update(() => {
        node.update(payload);
      });
    }
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose}>
      <Stack>
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

        <Button onClick={() => handleOnConfirm()}>
          {t('actions.ok')}
        </Button>
      </Stack>
    </Modal >
  );
}

UpdateInlineImageDialog.propTypes = {
  opened: PropTypes.bool,
  activeEditor: PropTypes.any,
  nodeKey: PropTypes.any,
  onClose: PropTypes.func,
}

export default function InlineImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  showCaption,
  caption,
  position,
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();
  const imageRef = useRef(null);
  const buttonRef = useRef(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState(null);
  const activeEditorRef = useRef(null);
  const isEditable = useLexicalEditable();

  const $onDelete = useCallback(
    (payload) => {
      const deleteSelection = $getSelection();
      if (isSelected && $isNodeSelection(deleteSelection)) {
        const event = payload;
        event.preventDefault();
        if (isSelected && $isNodeSelection(deleteSelection)) {
          editor.update(() => {
            deleteSelection.getNodes().forEach((node) => {
              if ($isInlineImageNode(node)) {
                node.remove();
              }
            });
          });
        }
      }
      return false;
    },
    [editor, isSelected],
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

  useEffect(() => {
    let isMounted = true;
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
        (payload) => {
          const event = payload;
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
    return () => {
      isMounted = false;
      unregister();
    };
  }, [
    clearSelection,
    editor,
    isSelected,
    nodeKey,
    $onDelete,
    $onEnter,
    $onEscape,
    setSelected,
  ]);

  const draggable = isSelected && $isNodeSelection(selection);
  const isFocused = isSelected && isEditable;
  return (
    <Suspense fallback={null}>
      <>
        <span draggable={draggable}>
          {isEditable && (
            <button
              className="image-edit-button"
              ref={buttonRef}
              onClick={open}>
              {t('actions.edit')}
            </button>
          )}
          <LazyImage
            className={
              isFocused
                ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}`
                : null
            }
            src={src}
            altText={altText}
            imageRef={imageRef}
            width={width}
            height={height}
            position={position}
          />
        </span>
        {showCaption && (
          <span className="image-caption-container">
            <LexicalNestedComposer initialEditor={caption}>
              <AutoFocusPlugin />
              <LinkPlugin />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    placeholder={t('editor.insertImage.caption.placeholder')}
                    // placeholderClassName="InlineImageNode__placeholder"
                    className="InlineImageNode__contentEditable"
                  />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </LexicalNestedComposer>
          </span>
        )}
      </>
      <UpdateInlineImageDialog
        opened={opened}
        activeEditor={editor}
        nodeKey={nodeKey}
        onClose={close}
      />
    </Suspense>
  );
}


InlineImageComponent.propTypes = {
  src: PropTypes.string,
  altText: PropTypes.string,
  nodeKey: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  showCaption: PropTypes.bool,
  caption: PropTypes.any,
  position: PropTypes.any,
}