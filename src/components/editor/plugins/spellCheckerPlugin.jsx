import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

// Lexical Imports
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// Editor imports
import { SPELLCHECK_COMMAND } from "../commands/spellCheckCommand";

// Ui Library Imports
import { Button, Drawer, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Local Imports

//---------------------------------------
const SpellCheckerPlugin = ({ locale, language, configuration = { enabled: false } }) => {
  const [editor] = useLexicalComposerContext();
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState(null);
  const onClose = () => {
    close();
  };


  //----------------SPELL CHECK---------------
  const findNextError = useCallback(() => {
    const unicodeWordRegex = /\p{L}+(?:'\p{L}+)?|\p{N}+|[^\p{L}\p{N}\s]+/gu;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        if ($isTextNode(anchorNode)) {
          const text = anchorNode.getTextContent();
          const startOffset = selection.anchor.offset;
          const remainingText = text.slice(startOffset);
          const match = remainingText.match(unicodeWordRegex);
          if (match) {
            const firstWord = match[0]; // Get the first word
            const wordStart = startOffset + match.index; // Start position of the word
            const wordEnd = wordStart + firstWord.length; // End position of the word

            selection.setTextNodeRange(anchorNode, wordStart, anchorNode, wordEnd);
            setError(firstWord);
          }
        }
      }
    });
  }, [editor]);

  useEffect(() => {
    editor.registerCommand(
      SPELLCHECK_COMMAND,
      () => {
        open();
        findNextError();
      },
      COMMAND_PRIORITY_LOW,
    );


  }, [configuration, editor, findNextError, language, open]);
  //-------------------------------
  return (
    <>
      <Drawer
        title={locale?.resources?.spellchecker}
        position="right"
        onClose={onClose}
        opened={opened}
      >
        <Text>
          {error}
        </Text>
        <Button onClick={findNextError}>Next</Button>
      </Drawer>
    </>);
}

SpellCheckerPlugin.propTypes = {
  locale: PropTypes.string,
  language: PropTypes.string,
  configuration: PropTypes.shape({
    enabled: PropTypes.bool,
  }),
}
export default SpellCheckerPlugin;
