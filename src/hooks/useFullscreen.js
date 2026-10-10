import { useFullscreenElement } from '@mantine/hooks';

// Mantine 9 split the old useFullscreen into useFullscreenElement (scoped to
// a ref'd element, same {ref, toggle, fullscreen} shape) and
// useFullscreenDocument (whole-document, no ref). This app always wraps a
// specific container, so useFullscreenElement is the direct replacement.
const useFullscreen = useFullscreenElement;

export default useFullscreen;
