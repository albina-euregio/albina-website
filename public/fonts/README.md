# Map glyphs (MapLibre fonts)

Self-hosted glyph PBFs for the station dashboard map (see
`app/components/maplibre/maplibre-map.tsx`). MapLibre symbol/text layers fetch
fonts from `{glyphs}` as `<fontstack>/<range>.pbf`.

The map only renders numeric labels (`0-9 . , -`), which all live in the
`0-255` range, so a single file per font is enough:

```
public/fonts/Noto Sans Regular/0-255.pbf
```

- The folder name **must** match `LABEL_FONT` in `maplibre-map.tsx`.
- `GLYPHS_URL` points here via `import.meta.env.BASE_URL`.

## Updating / adding fonts or ranges

Download a prebuilt range from a public glyph server, e.g. MapLibre's demo
tiles:

```sh
curl -fsSL "https://demotiles.maplibre.org/font/Noto%20Sans%20Regular/0-255.pbf" \
  -o "public/fonts/Noto Sans Regular/0-255.pbf"
```

To generate from your own font instead, use the MapLibre Font Maker
(https://maplibre.org/font-maker/) or `fontnik` and drop the resulting
`<range>.pbf` files into the matching `public/fonts/<Font Name>/` folder.
