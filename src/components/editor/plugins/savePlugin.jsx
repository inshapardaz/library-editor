import PropTypes from 'prop-types';
import { useEffect, useCallback } from "react";

// Lexical Imports
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_LOW } from "lexical";

// UI Library Imports
import { useHotkeys } from '@mantine/hooks';

// Editor Imports
import { SAVE_COMMAND } from "../commands/saveCommand";
import { IMAGE } from '../transformers/markdownImageTransformer';
// ------------------------------------------------------
function SavePlugin({ format, onSave }) {
  const [editor] = useLexicalComposerContext();

  const saveCallback = useCallback(() => {
    if (format === "markdown") {
      editor.update(() => {
        const markdown = $convertToMarkdownString([...TRANSFORMERS, IMAGE]);
        if (onSave) {
          onSave(markdown);
        }
      });
    } else {
      const editorState = editor.getEditorState();
      const json = editorState.toJSON();
      if (onSave) {
        onSave(json);
      }
    }
  }, [editor, format, onSave]);

  useEffect(() => {
    if (editor._commands.has(SAVE_COMMAND)) {
      editor._commands.delete(SAVE_COMMAND);
    }
    editor.registerCommand(SAVE_COMMAND, saveCallback, COMMAND_PRIORITY_LOW);
  }, [editor, format, saveCallback]);

  useHotkeys([
    ['mod+S', () => editor.dispatchCommand(SAVE_COMMAND, { preventDefault: true })],
  ])

  return null;
}

SavePlugin.propTypes = {
  format: PropTypes.any,
  onSave: PropTypes.func
}

export default SavePlugin;
