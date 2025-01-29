import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';

// Lexical imports
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { $isCodeNode, CODE_LANGUAGE_MAP } from "@lexical/code";
import { $isListNode, ListNode } from "@lexical/list";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
} from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  $isEditorIsNestedEditor,
  mergeRegister,
} from "@lexical/utils";
import { $isTableNode, $isTableSelection } from "@lexical/table";
import { $isHeadingNode } from "@lexical/rich-text";

// UI Library Import
import { ActionIcon, Button, Group, Tooltip } from "@mantine/core";
import { useLocalStorage } from '@mantine/hooks';

// Editor Imports
import { sanitizeUrl } from "../../utils/url";
import { getSelectedNode } from "../../utils/getSelectedNode";
import BlockFormatDropDown from "./blockFormatDropDown";
import {
  BlockTypeToBlockName,
  useToolbarState,
} from './toolbarContext';
import { SAVE_COMMAND } from "../../commands/saveCommand";
import classes from './toolbar.module.css'
import { AUTO_CORRECT_COMMAND, PUNCTUATION_CORRECT_COMMAND, SPELLCHECK_COMMAND } from '../../commands/spellCheckCommand';

// Local imports
import { IconSave, IconZoomIn, IconZoomOut, IconUndo, IconRedo, IconBold, IconItalic, IconUnderline, IconSubScript, IconStrikethrough, IconSuperScript, IconLink, IconAutoCorrect, IconPunctuation, IconSpellCheck } from "@/components/icons";
import CheckboxButton from './controls/checkboxButton';
import AlignFormatDropDown from './alignFormatDropDown';
import FontDropDown from './fontDropdown';
import FontSizeDropDown from './fontSizeDropdown';
import If from '@/components/if';
// -----------------------------------------------------------

const MIN_ZOOM = 10;
const MAX_ZOOM = 200;
const ZOOM_STEP = 10;

const ToolbarPlugin = ({ configuration, setIsLinkEditMode, locale }) => {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const { toolbarState, updateToolbarState } = useToolbarState();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [zoom, setZoom] = useLocalStorage({
    key: "editor-text-zoom",
    defaultValue: 100
  });
  const [viewFont, setViewFont] = useLocalStorage({
    key: "editor-view-font",
    defaultValue: null
  });
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
        const rootElement = activeEditor.getRootElement();
        updateToolbarState(
          'isImageCaption',
          !!rootElement?.parentElement?.classList.contains(
            'image-caption-container',
          ),
        );
      } else {
        updateToolbarState('isImageCaption', false);
      }

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();
            return parent !== null && $isRootOrShadowRoot(parent);
          });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      updateToolbarState('isRTL', $isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      const isLink = $isLinkNode(parent) || $isLinkNode(node);
      updateToolbarState('isLink', isLink);

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        updateToolbarState('rootType', 'table');
      } else {
        updateToolbarState('rootType', 'root');
      }

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          updateToolbarState('blockType', type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (BlockTypeToBlockName[type]) {
            updateToolbarState(
              'blockType',
              type,
            );
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage();
            updateToolbarState(
              'codeLanguage',
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }
      }
      // Handle buttons
      updateToolbarState(
        'fontColor',
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      );
      updateToolbarState(
        'bgColor',
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff',
        ),
      );
      updateToolbarState(
        'fontFamily',
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
      );
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      // If matchingParent is a valid node, pass it's format type
      updateToolbarState(
        'elementFormat',
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left',
      );
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      // Update text format
      updateToolbarState('isBold', selection.hasFormat('bold'));
      updateToolbarState('isItalic', selection.hasFormat('italic'));
      updateToolbarState('isUnderline', selection.hasFormat('underline'));
      updateToolbarState(
        'isStrikethrough',
        selection.hasFormat('strikethrough'),
      );
      updateToolbarState('isSubscript', selection.hasFormat('subscript'));
      updateToolbarState('isSuperscript', selection.hasFormat('superscript'));
      updateToolbarState('isCode', selection.hasFormat('code'));
      updateToolbarState(
        'fontSize',
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
      );
      updateToolbarState('isLowercase', selection.hasFormat('lowercase'));
      updateToolbarState('isUppercase', selection.hasFormat('uppercase'));
      updateToolbarState('isCapitalize', selection.hasFormat('capitalize'));
    }
  }, [activeEditor, editor, updateToolbarState]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, setIsLinkEditMode, toolbarState.isLink]);

  //----------- Zoom functions ------------------------

  const canZoomIn = useMemo(() => zoom < MAX_ZOOM, [zoom]);
  const canZoomOut = useMemo(() => zoom > MIN_ZOOM, [zoom]);

  const resetZoom = () => {
    setZoom(100);
  }

  const zoomIn = () => {
    if (canZoomIn) {
      setZoom(z => z + ZOOM_STEP);
    }
  }

  const zoomOut = () => {
    if (canZoomOut) {
      setZoom(z => z - ZOOM_STEP);
    }
  }

  return (
    <div className={classes.toolbar}>
      <Group>
        <If condition={configuration.toolbar.showSave}>
          <Tooltip label={t('editor.save')}>
            <ActionIcon size="lg"
              variant="default"
              onClick={() => editor.dispatchCommand(SAVE_COMMAND)}
            >
              <IconSave />
            </ActionIcon>
          </Tooltip>
        </If>
        <If condition={configuration.toolbar.showUndoRedo}>
          <Button.Group>
            <Tooltip label={t('editor.undo')}>
              <ActionIcon size="lg"
                variant="default"
                onClick={() =>
                  activeEditor.dispatchCommand(UNDO_COMMAND, undefined)
                }
                disabled={!canUndo}>
                {locale.isRtl ? <IconRedo /> : <IconUndo />}
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t('editor.redo')}>
              <ActionIcon size="lg"
                variant="default"
                onClick={() =>
                  activeEditor.dispatchCommand(REDO_COMMAND, undefined)
                }
                disabled={!canRedo}>
                {locale.isRtl ? <IconUndo /> : <IconRedo />}
              </ActionIcon>
            </Tooltip>
          </Button.Group>
        </If>
        <If condition={configuration.toolbar.showBlockFormat}>
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={toolbarState.blockType}
            editor={editor}
            locale={locale}
          />
        </If>
        <Button.Group>
          <CheckboxButton tooltip={t('editor.bold')} size="lg" icon={<IconBold />} checked={toolbarState.isBold} onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} />
          <CheckboxButton tooltip={t('editor.italic')} size="lg" icon={<IconItalic />} checked={toolbarState.isItalic} onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} />
          <CheckboxButton tooltip={t('editor.underline')} size="lg" icon={<IconUnderline />} checked={toolbarState.isUnderline} onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} />
        </Button.Group>
        <If condition={configuration.toolbar.showExtraFormat}>
          <Button.Group>
            <CheckboxButton tooltip={t('editor.strikethrough')}
              size="lg"
              icon={<IconStrikethrough />}
              checked={toolbarState.isStrikethrough}
              onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")} />
            <CheckboxButton tooltip={t('editor.subscript')}
              size="lg"
              icon={<IconSubScript />}
              checked={toolbarState.isSubscript}
              onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")} />
            <CheckboxButton tooltip={t('editor.superscript')}
              size="lg"
              icon={<IconSuperScript />}
              checked={toolbarState.isSuperscript}
              onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")} />
          </Button.Group>
        </If>
        <If condition={configuration.toolbar.showAlignment}>
          <AlignFormatDropDown
            editor={editor}
            disabled={!isEditable}
            locale={locale}
            value={toolbarState.elementFormat}
          />
        </If>
        <If condition={configuration.toolbar.showFontFormat}>
          <>
            <FontDropDown
              t={t}
              editor={editor}
              locale={locale}
              value={toolbarState.fontFamily}
            />
            <FontSizeDropDown
              editor={editor}
              value={toolbarState.fontSize}
            />
          </>
        </If>
        <If condition={configuration.toolbar.showInsertLink}>
          <CheckboxButton tooltip={t('editor.link')}
            size="lg"
            icon={<IconLink />}
            checked={toolbarState.isLink}
            onClick={insertLink} />

        </If>
        <If condition={configuration.spellchecker.enabled}>
          <Button.Group>
            <CheckboxButton tooltip={t('editor.spellcheck')}
              size="lg"
              icon={<IconSpellCheck />}
              onClick={() => editor.dispatchCommand(SPELLCHECK_COMMAND)} />
            <CheckboxButton tooltip={t('editor.punctuation')}
              size="lg"
              icon={<IconPunctuation />}
              onClick={() => editor.dispatchCommand(PUNCTUATION_CORRECT_COMMAND)} />
            <CheckboxButton tooltip={t('editor.autoCorrect')}
              size="lg"
              icon={<IconAutoCorrect />}
              onClick={() => editor.dispatchCommand(AUTO_CORRECT_COMMAND)} />
          </Button.Group>
        </If>

        <If condition={configuration.toolbar.showViewFont}>
          <FontDropDown
            t={t}
            editor={editor}
            locale={locale}
            value={viewFont || toolbarState.fontFamily}
            onFontSelected={setViewFont}
          />
        </If>
        <If condition={configuration.toolbar.showZoom}>
          <Button.Group>
            <Tooltip label={t("actions.zoonIn")}>
              <Button variant="default" size="sm" onClick={zoomIn} >
                <IconZoomIn />
              </Button>
            </Tooltip>
            <Tooltip label={t("actions.zoonReset")}>
              <Button variant="default" size="sm" onClick={resetZoom} >
                {`${zoom}%`}
              </Button>
            </Tooltip>
            <Tooltip label={t("actions.zoonOut")}>
              <Button variant="default" size="sm" onClick={zoomOut} >
                <IconZoomOut />
              </Button>
            </Tooltip>
          </Button.Group>
        </If>
      </Group>
    </div >
  );
};

ToolbarPlugin.propTypes = {
  configuration: PropTypes.shape({
    richText: PropTypes.bool,
    format: PropTypes.string,
    language: PropTypes.string,
    placeholder: PropTypes.string,
    toolbar: PropTypes.shape({
      fonts: PropTypes.arrayOf(PropTypes.string),
      defaultFont: PropTypes.string,
      showAlignment: PropTypes.bool,
      showBlockFormat: PropTypes.bool,
      showFontFormat: PropTypes.bool,
      showInsert: PropTypes.bool,
      showListFormat: PropTypes.bool,
      showUndoRedo: PropTypes.bool,
      showExtraFormat: PropTypes.bool,
      showInsertLink: PropTypes.bool,
      showSave: PropTypes.bool,
      showZoom: PropTypes.bool,
      showViewFont: PropTypes.bool,
    }),
    spellchecker: PropTypes.shape({
      enabled: PropTypes.bool,
      language: PropTypes.string,
      punctuationCorrections: PropTypes.func,
      autoCorrections: PropTypes.func,
      wordList: PropTypes.func,
    }),
  }),
  setIsLinkEditMode: PropTypes.func,
  locale: PropTypes.string
}
export default ToolbarPlugin;
