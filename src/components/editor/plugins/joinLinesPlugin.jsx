import { useEffect, useCallback } from "react";

// Lexical Imports
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW } from "lexical";

// UI Library Imports
import { useHotkeys } from '@mantine/hooks';

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
        editor.registerCommand(JOIN_LINES_COMMAND, joinLinesCallback, COMMAND_PRIORITY_LOW);
    }, [editor, joinLinesCallback]);

    useHotkeys([
        ['mod+J', () => editor.dispatchCommand(JOIN_LINES_COMMAND, { preventDefault: true })],
    ]);

    return null;
}

export default JoinLinesPlugin;
