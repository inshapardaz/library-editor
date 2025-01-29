import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';

// Lexical Imports
import {
  $getRoot,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// Editor imports
import { AUTO_CORRECT_COMMAND, PUNCTUATION_CORRECT_COMMAND } from "../commands/spellCheckCommand";

// Ui Library Imports

// Local Imports
import {
  useGetPunctuationQuery,
  useGetAutoCorrectQuery,
} from "/src/store/slices/tools.api";

//---------------------------------------------

const getReplaceAllRegex = (corrections) => {
  let retVal = '';
  corrections.forEach((c) => {
    retVal += `(${c.incorrectText.trim()})|`;
  });

  return new RegExp(`\\b${retVal.slice(0, -1)}\\b`, 'giu');
};
const correctPunctuations = (punctuationCorrections, text) => {
  text = text.replace(/  +/g, ' ');
  punctuationCorrections.forEach((c) => {
    console.log(`replacing ${c.incorrectText} with ${c.correctText}`)
    text = text.replaceAll(c.completeWord ? `${c.incorrectText}\\b` : c.incorrectText, c.correctText);
  });
  return text;
};

const autoCorrectText = (autoCorrections, text) => {
  const correctionRegex = getReplaceAllRegex(autoCorrections);
  return text.replaceAll(correctionRegex, (matched) => autoCorrections.find((o) => o.incorrectText === matched)?.correctText.trim());
};

//---------------------------------------
const AutoCorrectPlugin = ({ language, configuration = { enabled: false } }) => {
  const [editor] = useLexicalComposerContext();

  const {
    data: punctuationList,
    error: punctuationListError,
    isFetching: punctuationListLoading,
  } = useGetPunctuationQuery(
    { language }
  );

  const {
    data: autoCorrectList,
    error: autoCorrectListError,
    isFetching: autoCorrectListLoading,
  } = useGetAutoCorrectQuery(
    { language }
  );

  const punctuationCorrectionNode = useCallback((node, corrections) => {
    if (node.getChildren) {
      node.getChildren().map((child) => {
        punctuationCorrectionNode(child, corrections);
      });
    }

    if (node.getType() === 'text') {
      node.setTextContent(correctPunctuations(corrections, node.getTextContent()));
    }

    return node
  }, [])

  const punctuationCorrection = useCallback(() => {
    editor.update(() => {
      var root = $getRoot(editor);
      var children = root.getChildren();
      children.forEach((child) => {
        punctuationCorrectionNode(child, punctuationList);
      });
    });
  }, [editor, punctuationCorrectionNode, punctuationList]);

  useEffect(() => {
    if (!configuration.enabled ||
      punctuationListLoading ||
      punctuationListError ||
      autoCorrectListLoading ||
      autoCorrectListError) {
      return;
    }

    /* automatic correction */
    editor.registerCommand(
      AUTO_CORRECT_COMMAND,
      () => {
        autoCorrect();
      },
      COMMAND_PRIORITY_LOW,
    );

    const autoCorrectNode = (node, corrections) => {
      if (node.getChildren) {
        node.getChildren().map((child) => {
          autoCorrectNode(child, corrections);
        });
      }

      if (node.getType() === 'text') {
        node.setTextContent(autoCorrectText(corrections, node.getTextContent()));
      }

      return node
    }

    const autoCorrect = () => {
      editor.update(() => {
        var root = $getRoot(editor);
        var children = root.getChildren();
        children.forEach((child) => {
          autoCorrectNode(child, autoCorrectList);
        });
      });
    }
    /* automatic correction ends */

    /* Punctuation correction */
    editor.registerCommand(
      PUNCTUATION_CORRECT_COMMAND,
      () => {
        punctuationCorrection();
      },
      COMMAND_PRIORITY_LOW,
    );
    /* Punctuation correction ends */

  }, [autoCorrectList, autoCorrectListError, autoCorrectListLoading, configuration, editor, language, punctuationCorrection, punctuationListError, punctuationListLoading]);

  //-------------------------------
  return null;
}

AutoCorrectPlugin.propTypes = {
  locale: PropTypes.string,
  language: PropTypes.string,
  configuration: PropTypes.shape({
    enabled: PropTypes.bool,
  }),
}
export default AutoCorrectPlugin;
