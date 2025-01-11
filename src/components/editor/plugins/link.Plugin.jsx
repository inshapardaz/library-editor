import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin';

// Local Imports

import { validateUrl } from '../utils/url';
// ---------------------------------------------

const LinkPlugin = () => <LexicalLinkPlugin validateUrl={validateUrl} />;

export default LinkPlugin;