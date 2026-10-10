import { visit } from 'unist-util-visit';

// Rewrites the Likhari markdown dialect's remark-directive nodes
// (docs/markdown-dialect.md) into plain hast-renderable elements, so
// react-markdown's `components` map can style them without knowing anything
// about directive syntax. Must run after remarkDirective.
export default function remarkLikhariDirectives() {
    return (tree) => {
        visit(tree, (node) => {
            if (
                node.type !== 'textDirective' &&
                node.type !== 'leafDirective' &&
                node.type !== 'containerDirective'
            ) {
                return;
            }

            const data = node.data || (node.data = {});
            const attrs = node.attributes || {};

            switch (node.name) {
                case 'u':
                    data.hName = 'u';
                    break;
                case 'sup':
                    data.hName = 'sup';
                    break;
                case 'sub':
                    data.hName = 'sub';
                    break;
                case 'mark':
                    data.hName = 'mark';
                    break;
                case 'span': {
                    data.hName = 'span';
                    const style = [];
                    if (attrs.color) style.push(`color:${attrs.color}`);
                    if (attrs.bg) style.push(`background-color:${attrs.bg}`);
                    if (attrs.style) style.push(attrs.style);
                    data.hProperties = { style: style.join(';') };
                    break;
                }
                case 'figure': {
                    data.hName = 'figure';
                    node.children = [
                        {
                            type: 'paragraph',
                            data: {
                                hName: 'img',
                                hProperties: {
                                    src: attrs.src,
                                    alt: attrs.alt ?? '',
                                    width: attrs.width,
                                    height: attrs.height,
                                },
                            },
                            children: [],
                        },
                        {
                            type: 'paragraph',
                            data: { hName: 'figcaption' },
                            children: node.children ?? [],
                        },
                    ];
                    break;
                }
                case 'pagebreak':
                    data.hName = 'hr';
                    data.hProperties = { 'data-pagebreak': true };
                    break;
                case 'para':
                    data.hName = 'div';
                    data.hProperties = {
                        'data-align': attrs.align,
                        'data-indent': attrs.indent,
                        dir: attrs.dir,
                    };
                    break;
                case 'columns':
                    data.hName = 'div';
                    data.hProperties = {
                        'data-columns': true,
                        style: `grid-template-columns:repeat(${attrs.count ?? 2},1fr)`,
                    };
                    break;
                case 'column':
                    data.hName = 'div';
                    data.hProperties = { 'data-column': true };
                    break;
                case 'poetry': {
                    data.hName = 'div';
                    const style = [];
                    if (attrs.gutter) style.push(`gap:${attrs.gutter}`);
                    if (attrs.stagger) style.push(`--stagger:${attrs.stagger}`);
                    if (attrs.centerWidth) style.push(`max-width:${attrs.centerWidth}`);
                    if (attrs.width) style.push(`width:${attrs.width}`);
                    data.hProperties = {
                        'data-poetry-layout': attrs.layout ?? 'single',
                        style: style.join(';'),
                    };
                    break;
                }
                default:
                    // Unknown directive: leave it as literal text, per the dialect's
                    // own fallback rule (docs/markdown-dialect.md).
                    break;
            }
        });
    };
}
