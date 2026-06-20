import maplibregl from "maplibre-gl";
import type { WarnLevelNumber } from "../../util/warn-levels";
import type { RegionState } from "./bulletin-map";

// The fill/line paint is a pure function of the static config + warn-level
// tables, so it is built once. It reads three feature-states per region —
// `state` (cf. getRegionState), `warnlevel`, `intern` — set by the effect
// below; selection / hover / filter changes only update those feature-states,
// never the paint expression.

const State: ["coalesce", ["feature-state", "state"], "default"] = [
  "coalesce",
  ["feature-state", "state"],
  "default"
];
const StateSlashIntern: [
  "concat",
  ["coalesce", ["feature-state", "state"], "default"],
  "/",
  ["to-string", ["coalesce", ["feature-state", "intern"], false]]
] = [
  "concat",
  State,
  "/",
  ["to-string", ["coalesce", ["feature-state", "intern"], false]]
];
type StateSlashInternType = `${RegionState}/${boolean}`;

export const REGION_FILL_PAINT = Object.freeze({
  "fill-color": [
    "match",
    State,
    // n/a / no-rating regions carry no warnlevel, so their colour depends on
    // the state alone — the per-warnlevel arms are unreachable and collapse away.
    "noData" satisfies RegionState,
    "#19abff",
    "noDataMouseOver" satisfies RegionState,
    "#19abff",
    "noDataGrey" satisfies RegionState,
    "#888888",
    "noDataGreyMouseOver" satisfies RegionState,
    "#888888",
    "noDataPartialMouseOver" satisfies RegionState,
    "#888888",
    [
      "match",
      ["coalesce", ["feature-state", "warnlevel"], 0],
      // Rated regions: switch on the warn-level, then on the state/intern combos
      // that deviate from the plain warn colour (only dehighlighted / dimmed do,
      // via their white veil); every other state keeps the warn colour.
      1 satisfies WarnLevelNumber,
      [
        "match",
        StateSlashIntern,
        "dehighlighted/true" satisfies StateSlashInternType,
        "#f2ffd9",
        "dehighlighted/false" satisfies StateSlashInternType,
        "#f8ffe9",
        "dimmed/true" satisfies StateSlashInternType,
        "#e6ffb3",
        "dimmed/false" satisfies StateSlashInternType,
        "#eeffcc",
        "#ccff66"
      ],
      2 satisfies WarnLevelNumber,
      [
        "match",
        StateSlashIntern,
        "dehighlighted/true" satisfies StateSlashInternType,
        "#ffffbf",
        "dehighlighted/false" satisfies StateSlashInternType,
        "#ffffdb",
        "dimmed/true" satisfies StateSlashInternType,
        "#ffff80",
        "dimmed/false" satisfies StateSlashInternType,
        "#ffffaa",
        "#ffff00"
      ],
      3 satisfies WarnLevelNumber,
      [
        "match",
        StateSlashIntern,
        "dehighlighted/true" satisfies StateSlashInternType,
        "#ffe6bf",
        "dehighlighted/false" satisfies StateSlashInternType,
        "#fff0db",
        "dimmed/true" satisfies StateSlashInternType,
        "#ffcc80",
        "dimmed/false" satisfies StateSlashInternType,
        "#ffddaa",
        "#ff9900"
      ],
      4 satisfies WarnLevelNumber,
      [
        "match",
        StateSlashIntern,
        "dehighlighted/true" satisfies StateSlashInternType,
        "#ffbfbf",
        "dehighlighted/false" satisfies StateSlashInternType,
        "#ffdbdb",
        "dimmed/true" satisfies StateSlashInternType,
        "#ff8080",
        "dimmed/false" satisfies StateSlashInternType,
        "#ffaaaa",
        "#ff0000"
      ],
      5 satisfies WarnLevelNumber,
      [
        "match",
        StateSlashIntern,
        "dehighlighted/true" satisfies StateSlashInternType,
        "#c9c9c9",
        "dehighlighted/false" satisfies StateSlashInternType,
        "#dbdbdb",
        "dimmed/true" satisfies StateSlashInternType,
        "#8e8e8e",
        "dimmed/false" satisfies StateSlashInternType,
        "#aaaaaa",
        "#000000"
      ],
      // warnlevel 0 / no rating → transparent (rendered at opacity 0 anyway).
      "#ffffff"
    ]
  ],
  "fill-opacity": [
    "match",
    State,
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
        StateSlashIntern,
        "mouseOver/true" satisfies StateSlashInternType,
        1,
        "mouseOver/false" satisfies StateSlashInternType,
        0.5,
        "selected/true" satisfies StateSlashInternType,
        1,
        "selected/false" satisfies StateSlashInternType,
        0.5,
        "highlighted/true" satisfies StateSlashInternType,
        1,
        "highlighted/false" satisfies StateSlashInternType,
        0.5,
        "dehighlighted/true" satisfies StateSlashInternType,
        1,
        "dehighlighted/false" satisfies StateSlashInternType,
        0.875,
        "dimmed/true" satisfies StateSlashInternType,
        1,
        "dimmed/false" satisfies StateSlashInternType,
        0.75,
        "default/true" satisfies StateSlashInternType,
        1,
        "default/false" satisfies StateSlashInternType,
        0.5,
        0
      ]
    ]
  ]
} satisfies maplibregl.FillLayerSpecification["paint"]);

export const REGION_LINE_PAINT = Object.freeze({
  "line-color": [
    "match",
    State,
    "mouseOver" satisfies RegionState,
    "#555555",
    "selected" satisfies RegionState,
    "#555555",
    "noDataPartialMouseOver" satisfies RegionState,
    "#555555",
    "default",
    "#aaaaaa",
    "#aaaaaa"
  ],
  "line-width": [
    "match",
    State,
    "mouseOver" satisfies RegionState,
    2,
    "selected" satisfies RegionState,
    2,
    "noDataPartialMouseOver" satisfies RegionState,
    2,
    "default",
    1,
    1
  ],
  "line-opacity": [
    "match",
    State,
    "mouseOver" satisfies RegionState,
    1,
    "selected" satisfies RegionState,
    1,
    "noDataPartialMouseOver" satisfies RegionState,
    1,
    "default",
    0,
    0
  ]
} satisfies maplibregl.LineLayerSpecification["paint"]);
