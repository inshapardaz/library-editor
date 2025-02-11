import { $isImageNode, ImageNode } from "../nodes/imageNode/imageNode";
import { $createInlineImageNode, $isInlineImageNode } from "../nodes/inlineImageNode/inlineImageNode";

export const IMAGE = {
    dependencies: [ImageNode],
    export: (node) => {
        if (!$isImageNode(node) && !$isInlineImageNode(node)) {
            return null;
        }

        return `![${node.getAltText()}](${node.getSrc()})`;
    },
    importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
    regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
    replace: (textNode, match) => {
        const [, altText, src] = match;
        const imageNode = $createInlineImageNode({
            altText,
            maxWidth: 800,
            src,
        });
        textNode.replace(imageNode);
    },
    trigger: ')',
    type: 'text-match',
};