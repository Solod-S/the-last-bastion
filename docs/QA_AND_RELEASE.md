# QA and Release

## Browser matrix

Проверять актуальные desktop versions:

- Chrome;
- Edge;
- Firefox;
- Safari.

## Resolutions

Минимально:

- 1366×768;
- 1440×900;
- 1920×1080;
- 2560×1440;
- tablet landscape.

## Critical scenarios

- new profile;
- reload mid-menu;
- save migration;
- mission victory;
- mission defeat;
- pause/resume;
- tab loses focus;
- resize;
- audio mute;
- language switch;
- corrupted save recovery.

## Performance budgets

Цели, а не абсолютные гарантии:

- 60 FPS mainstream desktop;
- no uncontrolled memory growth between missions;
- lazy-loaded region assets released where possible;
- no repeated full asset downloads.

## Release checklist

- production build clean;
- no console errors;
- source maps policy set;
- asset cache headers;
- version display;
- save schema version;
- changelog;
- smoke E2E;
- basic accessibility pass;
- favicon/icons/manifest if PWA enabled.
