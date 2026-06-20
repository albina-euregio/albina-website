import maplibregl from "maplibre-gl";

// The fill/line paint is a pure function of the static config + warn-level
// tables, so it is built once. It reads three feature-states per region —
// `state` (cf. getRegionState), `warnlevel`, `intern` — set by the effect
// below; selection / hover / filter changes only update those feature-states,
// never the paint expression.

export const REGION_FILL_PAINT = Object.freeze({
  "fill-color": [
    "match",
    ["coalesce", ["feature-state", "state"], "default"],
    // n/a / no-rating regions carry no warnlevel, so their colour depends on
    // the state alone — the per-warnlevel arms are unreachable and collapse away.
    "noData",
    "#19abff",
    "noDataMouseOver",
    "#19abff",
    "noDataGrey",
    "#888888",
    "noDataGreyMouseOver",
    "#888888",
    "noDataPartialMouseOver",
    "#888888",
    [
      "match",
      ["coalesce", ["feature-state", "warnlevel"], 0],
      // Rated regions: switch on the warn-level, then on the state/intern combos
      // that deviate from the plain warn colour (only dehighlighted / dimmed do,
      // via their white veil); every other state keeps the warn colour.
      1,
      [
        "match",
        [
          "concat",
          ["coalesce", ["feature-state", "state"], "default"],
          "/",
          ["to-string", ["coalesce", ["feature-state", "intern"], false]]
        ],
        "dehighlighted/true",
        "#f2ffd9",
        "dehighlighted/false",
        "#f8ffe9",
        "dimmed/true",
        "#e6ffb3",
        "dimmed/false",
        "#eeffcc",
        "#ccff66"
      ],
      2,
      [
        "match",
        [
          "concat",
          ["coalesce", ["feature-state", "state"], "default"],
          "/",
          ["to-string", ["coalesce", ["feature-state", "intern"], false]]
        ],
        "dehighlighted/true",
        "#ffffbf",
        "dehighlighted/false",
        "#ffffdb",
        "dimmed/true",
        "#ffff80",
        "dimmed/false",
        "#ffffaa",
        "#ffff00"
      ],
      3,
      [
        "match",
        [
          "concat",
          ["coalesce", ["feature-state", "state"], "default"],
          "/",
          ["to-string", ["coalesce", ["feature-state", "intern"], false]]
        ],
        "dehighlighted/true",
        "#ffe6bf",
        "dehighlighted/false",
        "#fff0db",
        "dimmed/true",
        "#ffcc80",
        "dimmed/false",
        "#ffddaa",
        "#ff9900"
      ],
      4,
      [
        "match",
        [
          "concat",
          ["coalesce", ["feature-state", "state"], "default"],
          "/",
          ["to-string", ["coalesce", ["feature-state", "intern"], false]]
        ],
        "dehighlighted/true",
        "#ffbfbf",
        "dehighlighted/false",
        "#ffdbdb",
        "dimmed/true",
        "#ff8080",
        "dimmed/false",
        "#ffaaaa",
        "#ff0000"
      ],
      5,
      [
        "match",
        [
          "concat",
          ["coalesce", ["feature-state", "state"], "default"],
          "/",
          ["to-string", ["coalesce", ["feature-state", "intern"], false]]
        ],
        "dehighlighted/true",
        "#c9c9c9",
        "dehighlighted/false",
        "#dbdbdb",
        "dimmed/true",
        "#8e8e8e",
        "dimmed/false",
        "#aaaaaa",
        "#000000"
      ],
      // warnlevel 0 / no rating → transparent (rendered at opacity 0 anyway).
      "#ffffff"
    ]
  ],
  "fill-opacity": [
    "match",
    ["coalesce", ["feature-state", "state"], "default"],
    // n/a / no-rating regions carry no warnlevel, so their opacity depends on
    // the state alone — the per-warnlevel arms (incl. the slightly different
    // `/5/`) are unreachable and collapse away.
    "noData",
    0.5,
    "noDataMouseOver",
    0.75,
    "noDataGrey",
    0.5,
    "noDataGreyMouseOver",
    0.75,
    "noDataPartialMouseOver",
    0.75,
    [
      "case",
      // no-rating regions (warnlevel 0)
      ["==", ["coalesce", ["feature-state", "warnlevel"], 0], 0],
      0,
      // rated regions: opacity depends only on state + intern (warnlevel is
      // irrelevant once the slight /5/ differences are ignored).
      [
        "match",
        [
          "concat",
          ["coalesce", ["feature-state", "state"], "default"],
          "/",
          ["to-string", ["coalesce", ["feature-state", "intern"], false]]
        ],
        "mouseOver/true",
        1,
        "mouseOver/false",
        0.5,
        "selected/true",
        1,
        "selected/false",
        0.5,
        "highlighted/true",
        1,
        "highlighted/false",
        0.5,
        "dehighlighted/true",
        1,
        "dehighlighted/false",
        0.875,
        "dimmed/true",
        1,
        "dimmed/false",
        0.75,
        "default/true",
        1,
        "default/false",
        0.5,
        0
      ]
    ]
  ]
} satisfies maplibregl.FillLayerSpecification["paint"]);

export const REGION_LINE_PAINT = Object.freeze({
  "line-color": [
    "match",
    ["coalesce", ["feature-state", "state"], "default"],
    "mouseOver",
    "#555555",
    "selected",
    "#555555",
    "noDataPartialMouseOver",
    "#555555",
    "default",
    "#aaaaaa",
    "#aaaaaa"
  ],
  "line-width": [
    "match",
    ["coalesce", ["feature-state", "state"], "default"],
    "mouseOver",
    2,
    "selected",
    2,
    "noDataPartialMouseOver",
    2,
    "default",
    1,
    1
  ],
  "line-opacity": [
    "match",
    ["coalesce", ["feature-state", "state"], "default"],
    "mouseOver",
    1,
    "selected",
    1,
    "noDataPartialMouseOver",
    1,
    "default",
    0,
    0
  ]
} satisfies maplibregl.LineLayerSpecification["paint"]);
