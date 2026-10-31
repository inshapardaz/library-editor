import { Badge, Card, Chip, Divider, Menu, Pagination, Paper, Popover, Tabs, createTheme } from '@mantine/core';
import { makeAccentPalette, DEFAULT_ACCENT, PLAIN_ACCENT } from './accent';

// The site offers three looks, picked in the appearance menu and kept in local storage:
//   nawishta - the paper/spine design (warm paper, spine green, gold); follows light/dark mode
//   white    - a basic plain white theme (always light)
//   black    - a basic plain black theme (always dark)
// Surface colours are CSS custom properties per theme (styles/appearance.css); the Mantine theme
// supplies the accent palette, type and shape.

export const THEMES = ['nawishta', 'white', 'black'];
export const DEFAULT_THEME = 'nawishta';

// Plain themes pin the colour scheme; Nawishta follows the visitor's choice.
export const FORCED_COLOR_SCHEME = { nawishta: undefined, white: 'light', black: 'dark' };

const FONT_FALLBACK = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// The spine green used for the header/footer/nav chrome (see styles/appearance.css for the
// --spine/--paper/--gold custom properties those components are built from).
const SPINE = ['#eaf1ee', '#cfe0d9', '#a9c9bd', '#7fb09d', '#5a9882', '#3d7f69', '#2a6654', '#1f4a40', '#163831', '#0f2621'];

export const createAppTheme = (variant = DEFAULT_THEME) => createTheme({
    scale: 0.94,
    primaryColor: 'accent',
    primaryShade: { light: 6, dark: 5 },
    colors: { accent: makeAccentPalette(variant === 'nawishta' ? DEFAULT_ACCENT : PLAIN_ACCENT), spine: SPINE },
    fontFamily: `"Open Sans Variable", "Open Sans", ${FONT_FALLBACK}`,
    headings: {
        fontFamily: `"Open Sans Variable", "Open Sans", ${FONT_FALLBACK}`,
        fontWeight: '700',
        sizes: {
            h1: { fontSize: '2.125rem', lineHeight: '1.25' },
            h2: { fontSize: '1.625rem', lineHeight: '1.3' },
            h3: { fontSize: '1.25rem', lineHeight: '1.3' },
            h4: { fontSize: '1.125rem', lineHeight: '1.35' },
            h5: { fontSize: '1rem', lineHeight: '1.4' },
            h6: { fontSize: '0.875rem', lineHeight: '1.4' },
        },
    },
    defaultRadius: 'sm',
    radius: { xs: '2px', sm: '4px', md: '8px', lg: '16px', xl: '32px' },
    components: {
        Card: Card.extend({
            defaultProps: { radius: 'md', withBorder: true },
            styles: { root: { backgroundColor: 'var(--paper-card)', borderColor: 'var(--nw-line)' } },
        }),
        Paper: Paper.extend({ styles: { root: { backgroundColor: 'var(--paper-card)', borderColor: 'var(--nw-line)' } } }),
        Badge: Badge.extend({ defaultProps: { radius: 'xl' } }),
        Chip: Chip.extend({ defaultProps: { radius: 'xl' } }),
        Pagination: Pagination.extend({ defaultProps: { radius: 'xl' } }),
        Tabs: Tabs.extend({ defaultProps: { color: 'accent' } }),
        Menu: Menu.extend({ styles: { dropdown: { backgroundColor: 'var(--paper-card)', borderColor: 'var(--nw-line)' } } }),
        Popover: Popover.extend({ styles: { dropdown: { backgroundColor: 'var(--paper-card)', borderColor: 'var(--nw-line)' } } }),
        Divider: Divider.extend({ styles: { root: { borderColor: 'var(--nw-line)' } } }),
    },
});
