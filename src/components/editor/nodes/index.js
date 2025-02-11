import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';
import { HorizontalRuleNode } from './horizontalRuleNode';
import { AutocompleteNode } from './autocompleteNode';
import { ImageNode } from './imageNode/imageNode';
import { InlineImageNode } from './inlineImageNode/inlineImageNode';

const EditorNodes = [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    AutoLinkNode,
    LinkNode,
    HorizontalRuleNode,
    AutocompleteNode,
    ImageNode,
    InlineImageNode
];

export default EditorNodes;