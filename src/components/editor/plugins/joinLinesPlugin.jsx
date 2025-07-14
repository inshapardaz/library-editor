import { useEffect, useCallback } from "react";

// Lexical Imports
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, COMMAND_PRIORITY_NORMAL, KEY_DOWN_COMMAND } from "lexical";

// Editor Imports
import { JOIN_LINES_COMMAND } from "../commands/joinLinesCommand";
// ------------------------------------------------------
function JoinLinesPlugin() {
    const [editor] = useLexicalComposerContext();

    const joinLinesCallback = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const text = selection.getTextContent();
                const joinedText = text.replace(/\n/g, " ");
                selection.insertText(joinedText);
            }
        });
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(JOIN_LINES_COMMAND, joinLinesCallback, COMMAND_PRIORITY_LOW);
    }, [editor, joinLinesCallback]);

    useEffect(() => {
        return editor.registerCommand(
            KEY_DOWN_COMMAND,
            (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
                    editor.dispatchCommand(JOIN_LINES_COMMAND);
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

export default JoinLinesPlugin;
