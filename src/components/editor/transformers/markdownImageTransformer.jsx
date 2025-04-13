import { $createImageNode, $isImageNode, ImageNode } from "../nodes/imageNode/imageNode";

export const IMAGE = {
    dependencies: [ImageNode],
    export: (node) => {
        if (!$isImageNode(node)) {
            return null;
        }

        // TODO: support serialziation of images with width and height
        /*if (node.__width && node.__height) {
            return `<img src="${node.getSrc()}" alt="${node.getAltText()}" width="${node.getWidth()}" height="${node.getHeight()}"/>`
        } else if (node.__width) {
            return `<img src="${node.getSrc()}" alt="${node.getAltText()}" width="${node.getWidth()}" />`
        } else if (node.__height) {
            return `<img src="${node.getSrc()}" alt="${node.getAltText()}" height="${node.getHeight()}"/>`
        }*/
        return `![${node.getAltText()}](${node.getSrc()})`;
    },
    importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
    regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
    replace: (textNode, match) => {
        const [, altText, src] = match;
        const imageNode = $createImageNode({
            altText,
            maxWidth: 800,
            src,
        });
        textNode.replace(imageNode);
    },
    trigger: ')',
    type: 'text-match',
};