/* eslint-disable no-undef */
import PropTypes from 'prop-types';
import { useEffect } from "react";

// Lexical Imports
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";
import MarkdownTransformers from '../transformers';

//---------------------------------------
const useAdoptPlaintextValue = (value, isRichText, format) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (value) {
      if (isRichText) {
        editor.update(() => {
          if (format === "markdown") {
            $convertFromMarkdownString(value, MarkdownTransformers);
          } else {
            const editorState = editor.parseEditorState(value);
            editor.setEditorState(editorState);
          }
        });
      } else {
        editor.update(() => {
          const root = $getRoot();
          const paragraphNode = $createParagraphNode();
          const textNode = $createTextNode(value);
          paragraphNode.append(textNode);
          root.append(paragraphNode);
        });
      }
    }
  }, [editor, format, isRichText, value]);
};

//---------------------------------------

const ControlledValuePlugin = ({
  value,
  onChange,
  isRichtext,
  format,
}) => {
  useAdoptPlaintextValue(value, isRichtext, format);

  const handleChange = (editorState, editor) => {
    editorState.read(() => {
      if (format === "markdown") {
        const markdown = $convertToMarkdownString(MarkdownTransformers);
        if (onChange) {
          onChange(markdown);
        }
      } else {
        const editorState = editor.getEditorState();
        const json = editorState.toJSON();
        if (onChange) {
          onChange(json);
        }
      }
    });
  };

  return <OnChangePlugin onChange={handleChange} />;
};

ControlledValuePlugin.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  isRichtext: PropTypes.bool,
  format: PropTypes.string,
}

export default ControlledValuePlugin;