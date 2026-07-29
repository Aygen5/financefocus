# ⚡ Lighthouse Performance & Audit Summary

**Date:** 2026-07-29  
**Status:** **NOT GENERATED**

## Statement

No static pre-baked `.html` Lighthouse report file was saved in the repository root directory.

## Codebase Bundle Build Analysis

While an external Lighthouse HTML report was not pre-baked, modern Vite Rollup bundling metrics were empirically collected via `npm run build`:

| Asset | File Size | Gzip Size |
| :--- | :---: | :---: |
| `dist/index.html` | 2.12 kB | 0.86 kB |
| `dist/assets/index-*.css` | 62.58 kB | 10.90 kB |
| `dist/assets/index-*.js` | 463.83 kB | 139.64 kB |
| `dist/assets/generateCategoricalChart-*.js` | 346.35 kB | 93.40 kB |
| `dist/assets/dist-*.js` | 118.84 kB | 40.27 kB |

- **Code Splitting**: Rollup lazily splits chart modules (`Recharts`), settings, and dashboard routes into separate chunks to ensure fast initial page load times.
