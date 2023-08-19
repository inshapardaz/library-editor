import {useEffect, useRef} from 'react';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

// local imports
import styles from './editor.module.scss'


  const theme = {
  }

  function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      // Focus the editor when the effect fires!
      editor.focus();
    }, [editor]);

    return null;
  }

  const Editor = ({ placeholder, value, onChange = () => {}}) => {
    const editorStateRef = useRef();
    const onEditorChange = (editorState) => {
        editorStateRef.current = editorState;
        //console.log(editorState);
        //const markdown = $convertToMarkdownString(TRANSFORMERS);
        //onChange(markdown);
      }

    const onError = (error) => {
        console.error(error);
    }

    const initialConfig = {
        theme,
        onError,
        //editorState: () => $convertFromMarkdownString(value, TRANSFORMERS)
        editorState: () => editorStateRef.current
      };

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={<div className={styles.editor}>
                <ContentEditable />
            </div>}
          placeholder={placeholder}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onEditorChange} />
        <HistoryPlugin />
        <MyCustomAutoFocusPlugin />
      </LexicalComposer>
    );
  }

  export default Editor;
