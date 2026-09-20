# Mezastar Binder site

Static, single page binder site for Khanh's Mezastar tags (Stardust Version 2 only).

## What is in here

- `index.html` the whole app: My Binder, Boss Counter, Loadout
- `assets/style.css` glass UI theme (dark, aurora background, blur panels)
- `assets/app.js` rendering, search, type filters, boss counter maths
- `data/roster.json` his 19 owned tags with PE, types, grade, ability, coverage
- `data/bosses.json` 169 boss entries with types and set, flagged `vn` for Stardust V2
- `data/typechart.json` 18 type attack chart used for the multipliers
- `img/*.webp` tag art, 640px wide WebP converted from the official PNGs

## Rebuilding

```
python trainer/scripts/build_site.py
```

The script reads `data/mezastar_tagdb.json` and `trainer/binder.json`, recomputes every
coverage and weakness list, converts the tag art to WebP and rewrites `docs/data/*.json`.
Re-run it whenever the binder or the tag database changes.

## Publishing (GitHub Pages)

GitHub Pages serves the `/docs` folder of a branch. On a free account the repository must be
public. Settings -> Pages -> Source: Deploy from a branch -> Branch: `main` -> Folder: `/docs`.

## Notes

Every path in the site is relative, so it works at a domain root and under a project subpath
(`https://<user>.github.io/<repo>/`). All boss answers are computed in the browser from
`data/typechart.json` against the roster, so the site works offline once loaded.
