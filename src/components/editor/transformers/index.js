import { TRANSFORMERS } from "@lexical/markdown";
import { IMAGE } from './markdownImageTransformer';
import { HR } from './markdownHorizontalRuleTransformer';
//-------------------------------------

const MarkdownTransformers = [...TRANSFORMERS, IMAGE, HR];

export default MarkdownTransformers