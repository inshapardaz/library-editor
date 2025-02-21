import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

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
import LanguageService from '@/domain/language.service';

//---------------------------------------
const AutoCorrectPlugin = ({ language, configuration = { enabled: false } }) => {
  const [editor] = useLexicalComposerContext();
  const [languageServer, setLanguageServer] = useState(new LanguageService({}));
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

  useEffect(() => {
    setLanguageServer(new LanguageService({ language, autoCorrectList, punctuationList }));
  }, [autoCorrectList, language, punctuationList]);

  const punctuationCorrectionNode = useCallback((node, corrections) => {
    if (node.getChildren) {
      node.getChildren().map((child) => {
        punctuationCorrectionNode(child, corrections);
      });
    }

    if (node.getType() === 'text') {
      node.setTextContent(languageServer.correctPunctuations(node.getTextContent()));
    }

    return node
  }, [languageServer])

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
      if (languageServer) {
        if (node.getChildren) {
          node.getChildren().map((child) => {
            autoCorrectNode(child, corrections);
          });
        }

        if (node.getType() === 'text') {
          node.setTextContent(languageServer.autoCorrect(node.getTextContent()));
        }
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

  }, [autoCorrectList, autoCorrectListError, autoCorrectListLoading, configuration, editor, language, languageServer, punctuationCorrection, punctuationListError, punctuationListLoading]);

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
