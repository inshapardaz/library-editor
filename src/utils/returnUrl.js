import { MAIN_SITE } from '@/config';

// Builds a link to a main-site account page carrying the current page as
// returnUrl, so the user lands back where they started after auth actions.
// The current URL must be encoded: it's placed inside another URL's query
// string, and editor pages commonly carry their own query params (book/
// library/chapter IDs) which would otherwise truncate the outer returnUrl
// at the first stray "&".
export const accountUrl = (path) =>
    `${MAIN_SITE}${path}?returnUrl=${encodeURIComponent(window.location.href)}`;
