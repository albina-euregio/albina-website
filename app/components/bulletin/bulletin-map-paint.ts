import maplibregl from "maplibre-gl";
import type { RegionState } from "./bulletin-map";
import { DangerRatingValue } from "../../stores/bulletin";

// The fill/line paint is a pure function of the static config + warn-level
// tables, so it is built once. It reads three feature-states per region —
// `state` (cf. getRegionState), `dangerRating` (a DangerRatingValue, e.g. `low`
// … `very_high` / `no_snow`), `intern` — set by the effect below; selection /
// hover / filter changes only update those feature-states, never the paint
// expression.

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
    // n/a / no-rating regions carry no danger rating, so their colour depends on
    // the state alone — the per-rating arms are unreachable and collapse away.
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
      [
        "coalesce",
        ["feature-state", "dangerRating"],
        "no_snow" satisfies DangerRatingValue
      ],
      // Rated regions: switch on the danger rating, then on the state/intern
      // combos that deviate from the plain danger colour (only dehighlighted /
      // dimmed do, via their white veil); every other state keeps it.
      "low" satisfies DangerRatingValue,
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
      "moderate" satisfies DangerRatingValue,
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
      "considerable" satisfies DangerRatingValue,
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
      "high" satisfies DangerRatingValue,
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
      "very_high" satisfies DangerRatingValue,
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
      // no_snow / no rating → transparent (rendered at opacity 0 anyway).
      "#ffffff"
    ]
  ],
  "fill-opacity": [
    "match",
    State,
    // n/a / no-rating regions carry no danger rating, so their opacity depends
    // on the state alone — the per-rating arms (incl. the slightly different
    // very_high) are unreachable and collapse away.
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
      // no-rating regions (no_snow)
      [
        "==",
        [
          "coalesce",
          ["feature-state", "dangerRating"],
          "no_snow" satisfies DangerRatingValue
        ],
        "no_snow" satisfies DangerRatingValue
      ],
      0,
      // rated regions: opacity depends only on state + intern (the danger rating
      // is irrelevant once the slight very_high differences are ignored).
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
