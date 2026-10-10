import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';

import remarkLikhariDirectives from './remarkLikhariDirectives';
import classes from './markdownContent.module.css';
//---------------------------------

// Shared markdown renderer for the reader side: understands the Likhari
// markdown dialect's custom directives (docs/markdown-dialect.md), not just
// plain GFM, so content written in the editor renders correctly here too.
const MarkdownContent = ({ markdown }) => (
    <div className={classes.content}>
        <Markdown remarkPlugins={[remarkGfm, remarkDirective, remarkLikhariDirectives]}>
            {markdown}
        </Markdown>
    </div>
);

MarkdownContent.propTypes = {
    markdown: PropTypes.string,
};

export default MarkdownContent;
