import PropTypes from 'prop-types';
import { useEffect, useCallback } from "react";

// Lexical Imports
import { $convertToMarkdownString } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_LOW, COMMAND_PRIORITY_NORMAL, KEY_DOWN_COMMAND } from "lexical";

// Editor Imports
import { SAVE_COMMAND } from "../commands/saveCommand";
import MarkdownTransformers from '../transformers';
// ------------------------------------------------------
function SavePlugin({ format, onSave }) {
    const [editor] = useLexicalComposerContext();

    const saveCallback = useCallback(() => {
        if (format === "markdown") {
            editor.update(() => {
                const markdown = $convertToMarkdownString(MarkdownTransformers);
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
        return editor.registerCommand(SAVE_COMMAND, saveCallback, COMMAND_PRIORITY_LOW);
    }, [editor, format, saveCallback]);

    useEffect(() => {
        return editor.registerCommand(
            KEY_DOWN_COMMAND,
            (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                    editor.dispatchCommand(SAVE_COMMAND);
                    event.preventDefault();
                    return true;
                }
                return false;
            },
            COMMAND_PRIORITY_NORMAL,
        );
    }, [editor]);
    return null;
}

SavePlugin.propTypes = {
    format: PropTypes.any,
    onSave: PropTypes.func
}

export default SavePlugin;
