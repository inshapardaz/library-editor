import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

// Lexcial Imports
import { $isCodeHighlightNode } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  getDOMSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';

// Editor imports

import { getDOMRangeRect } from '../../utils/getDOMRangeRect';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { setFloatingElemPosition } from '../../utils/setFloatingElemPosition';
import CheckboxButton from '../toolbarPlugin/controls/checkboxButton';

// UI library imports
import { Button, Divider } from '@mantine/core';

// Local Imports
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconSubScript,
  IconStrikethrough,
  IconSuperScript,
  IconLink,
  IconLowerCase,
  IconUpperCase,
  IconCapitalize,
  IconCode
} from "@/components/icons";
import './index.css';

//----------------------------------------------
function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isUppercase,
  isLowercase,
  isCapitalize,
  isCode,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  setIsLinkEditMode,
  showExtraFormat,
  showInsertLink
}) {
  const { t } = useTranslation();
  const popupCharStylesEditorRef = useRef(null);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, setIsLinkEditMode]);

  function mouseMoveListener(e) {
    if (
      popupCharStylesEditorRef?.current &&
      (e.buttons === 1 || e.buttons === 3)
    ) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'none') {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          // Mouse is not over the target element => not a normal click, but probably a drag
          popupCharStylesEditorRef.current.style.pointerEvents = 'none';
        }
      }
    }
  }
  function mouseUpListener() {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'auto') {
        popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
      }
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener('mousemove', mouseMoveListener);
      document.addEventListener('mouseup', mouseUpListener);

      return () => {
        document.removeEventListener('mousemove', mouseMoveListener);
        document.removeEventListener('mouseup', mouseUpListener);
      };
    }
  }, [popupCharStylesEditorRef]);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = getDOMSelection(editor._window);

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(
        rangeRect,
        popupCharStylesEditorElem,
        anchorElem,
        isLink,
      );
    }
  }, [popupCharStylesEditorRef, editor, anchorElem, isLink]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener('resize', update);
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateTextFormatFloatingToolbar]);

  return (
    <div ref={popupCharStylesEditorRef} className="floating-text-format-popup">
      {editor.isEditable() && (
        <Button.Group>
          <CheckboxButton tooltip={t('editor.bold')} size="lg" variant="subtle"
            icon={<IconBold />} checked={isBold} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} />

          <CheckboxButton tooltip={t('editor.italic')} size="lg" variant="subtle"
            icon={<IconItalic />} checked={isItalic} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} />

          <CheckboxButton tooltip={t('editor.underline')} size="lg" variant="subtle"
            icon={<IconUnderline />} checked={isUnderline} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} />

          {showExtraFormat && (<>
            <Divider orientation='vertical' />
            <CheckboxButton tooltip={t('editor.strikethrough')} size="lg" variant="subtle"
              icon={<IconStrikethrough />} checked={isStrikethrough}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")} />
            <CheckboxButton tooltip={t('editor.subscript')} size="lg" variant="subtle"
              icon={<IconSubScript />} checked={isSubscript}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")} />
            <CheckboxButton tooltip={t('editor.superscript')} size="lg" variant="subtle"
              icon={<IconSuperScript />} checked={isSuperscript}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")} />
            <Divider orientation='vertical' />
            <CheckboxButton tooltip={t('editor.uppercase')} size="lg" variant="subtle"
              icon={<IconUpperCase />} checked={isUppercase}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase')} />
            <CheckboxButton tooltip={t('editor.lowercase')} size="lg" variant="subtle"
              icon={<IconLowerCase />} checked={isLowercase}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase')} />
            <CheckboxButton tooltip={t('editor.capitalize')} size="lg" variant="subtle"
              icon={<IconCapitalize />} checked={isCapitalize}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize')} />
            <Divider orientation='vertical' />
            <CheckboxButton tooltip={t('editor.code')} size="lg" variant="subtle"
              icon={<IconCode />} checked={isCode}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')} />
          </>
          )}
          {showInsertLink && (
            <CheckboxButton tooltip={t('editor.link')} size="lg" variant="subtle"
              icon={<IconLink />} checked={isLink}
              onChange={insertLink} />
          )}
        </Button.Group>
      )}
    </div>
  );
}

TextFormatFloatingToolbar.propTypes = {
  language: PropTypes.string,
  editor: PropTypes.shape({
    _window: PropTypes.any,
    dispatchCommand: PropTypes.func,
    registerCommand: PropTypes.func,
    getEditorState: PropTypes.func,
    registerUpdateListener: PropTypes.func,
    getRootElement: PropTypes.func,
    isEditable: PropTypes.func,
  }),
  anchorElem: PropTypes.any,
  isLink: PropTypes.bool,
  isBold: PropTypes.bool,
  isItalic: PropTypes.bool,
  isUnderline: PropTypes.bool,
  isUppercase: PropTypes.bool,
  isLowercase: PropTypes.bool,
  isCapitalize: PropTypes.bool,
  isCode: PropTypes.bool,
  isStrikethrough: PropTypes.bool,
  isSubscript: PropTypes.bool,
  isSuperscript: PropTypes.bool,
  setIsLinkEditMode: PropTypes.func,
  showExtraFormat: PropTypes.bool,
  showInsertLink: PropTypes.bool,
}

function useFloatingTextFormatToolbar(
  editor,
  anchorElem,
  setIsLinkEditMode,
  configuration
) {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [isLowercase, setIsLowercase] = useState(false);
  const [isCapitalize, setIsCapitalize] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = getDOMSelection(editor._window);
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsUppercase(selection.hasFormat('uppercase'));
      setIsLowercase(selection.hasFormat('lowercase'));
      setIsCapitalize(selection.hasFormat('capitalize'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));

      // Update links
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ''
      ) {
        setIsText($isTextNode(node) || $isParagraphNode(node));
      } else {
        setIsText(false);
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, '');
      if (!selection.isCollapsed() && rawTextContent === '') {
        setIsText(false);
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopup]);

  if (!isText) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isUppercase={isUppercase}
      isLowercase={isLowercase}
      isCapitalize={isCapitalize}
      isStrikethrough={isStrikethrough}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isUnderline={isUnderline}
      isCode={isCode}
      setIsLinkEditMode={setIsLinkEditMode}
      showExtraFormat={configuration.toolbar.showExtraFormat}
      showInsertLink={configuration.toolbar.showInsertLink}
    />,
    anchorElem,
  );
}

export default function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
  setIsLinkEditMode,
  configuration
}) {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(editor, anchorElem, setIsLinkEditMode, configuration);
}


