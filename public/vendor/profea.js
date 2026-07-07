/*!
 * profea — CAAML v6 snow profile parser + A4 SVG renderer
 *
 * Works as: <script src="profea.js"></script>
 *
 * The renderer expects the snowsymbolsiacs font to be available via CSS.
 * Include it in the consuming page with an @font-face rule pointing at
 * assets/fonts/SnowSymbolIACS.woff2 (and .woff as a fallback).
 *
 * Public API:
 *   profea.parse(xmlString)            → data object
 *   profea.draw(data, svgEl, options?) → svgEl (populated)
 *
 *     options.colorizeByGrain  boolean   fill layers with the grain palette
 *     options.hardnessDisplay  string    which resistance steps to show
 *                                        on the left panel:
 *                                          'both' (default) · 'hand' · 'ram'
 */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.profea = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════════════════════════
   *
   *   HOW THIS FILE IS LAID OUT
   *
   *   profea.js does two things, in order:
   *     1.  parse(xmlString)            — turn a CAAML v6 XML document into
   *                                       a normalised JavaScript object.
   *                                       Currently only XML is used since it
   *                                       still is the main input format for
   *                                       observed profiles in SNOWPACK.
   *     2.  draw(data, svgEl, options)  — paint that object into an <svg>
   *                                       as an A4-sized snow profile.
   *
   *   No build steps, no runtime dependencies — drop the file into a page
   *   with a <script> tag and you're done.
   *
   *   The sections below are numbered with §N markers. Search for "§5"
   *   to jump straight to the column-and-metadata configuration, and so on.
   *
   *   ─── SECTIONS ──────────────────────────────────────────────────────────
   *
   *   §1   Glossary               domain terms used throughout this file
   *   §2   Page anatomy           the A4 layout, as a diagram
   *   §3   Domain look-ups        IACS grain shapes, hardness, wetness
   *   §4   Page geometry          page, margins, vertical bands, axes
   *   §5   Columns & metadata     right-panel columns, metadata grid, legend
   *   §6   Per-band layout        offsets inside each section of the page
   *   §7   Tuning knobs           thresholds, defaults, magic constants
   *   §8   Appearance             colours, fonts, defs IDs, wrap settings
   *   §9   Helpers                small utility functions + label formatters
   *   §10  CAAML parser           function parse(xml) → data
   *   §11  SVG renderer           function draw(data, svgEl, opts)
   *   §12  Public API             what gets exported
   *
   *   ─── QUICK EDITS ───────────────────────────────────────────────────────
   *
   *   To change …                                  Search for …
   *   ──────────────────────────────────────────   ──────────────────────────
   *   A colour                                     COLOR_              (§8)
   *   A font size                                  FONT_               (§8)
   *   The page layout / band heights               _Y_MM, _H_MM        (§4)
   *   The right-panel columns                      RIGHT_COLUMN_       (§5)
   *   A metadata cell                              META_GRID_FIELDS    (§5)
   *   The legend entries                           LEGEND_ENTRIES      (§5)
   *   Internal layout of a band (meta, legend …)   META_LAYOUT, …      (§6)
   *   What hardness "K" maps to in Newtons         HARDNESS_NEWTONS    (§3)
   *   What wetness means                           WETNESS_LEVELS      (§3)
   *   The lemon-score colour thresholds            LEMON_COLOR_        (§8)
   *   How a CT/ECT/RB/PST label is formed          formatECTLabel, …   (§9)
   *   The [Test Groups] comment trailer parser     consumeTestGroupsTail (§9)
   *
   * ═══════════════════════════════════════════════════════════════════════════
   */

  /* ═══════════════════════════════════════════════════════════════════════════
   *   §1  GLOSSARY
   *   Domain terms used throughout this file.
   * ═══════════════════════════════════════════════════════════════════════════
   *
   *   CAAML        Canadian Avalanche Association Markup Language — the XML format
   *                for snowprofile documentation. v6 is current.
   *
   *   IACS         International Classification for Seasonal Snow on the
   *                Ground. Source of the grain-shape codes (PP, RG, FC, DH,
   *                SH, MF, MFcr, IF, MM, PPgp, FCxr) and the hand-hardness
   *                and wetness scales used by this renderer.
   *
   *   Stratigraphy The layered structure of the snowpack. Each Layer in the
   *                CAAML has a depth, thickness, grain form(s), grain size,
   *                hardness, and wetness.
   *
   *   Hand         Standardised:
   *   hardness     Scale (1–6): F (fist), 4F (four fingers), 1F (one finger),
   *                P (pencil), K (knife), I (ice). Half-steps (4F-1F = 2.5,
   *                etc.) sit between the integers.
   *
   *   Wetness θ    IACS θ index: D (dry, 1), M (moist, 2), W (wet, 3),
   *                V (very wet, 4), S (soaked, 5). Half-steps too.
   *
   *   Rammsonde    A penetrometer dropped through the snowpack with a known
   *                hammer weight and fall height. CAAML records the resulting
   *                resistance per depth interval in Newtons.
   *
   *   Lemons       Layer-by-layer instability heuristic (Jamieson & Schweizer):
   *                counts grain size ≥ 1 mm, fist hardness,
   *                persistent grain types (FC/FCxr/DH/SH), large grain or
   *                hardness step against the layer below, near the surface.
   *                More lemons → weaker layer.
   *
   *   Stability    CT (compression test), ECT (extended
   *   tests        column test), RB (Rutschblock), PST (propagation saw test).
   *                Each fails at a certain depth, with a step count and result code.
   *
   *   hS / hSnow   Total snow column height in centimetres.
   *
   *   depthRef     Convention for measuring depth: this renderer uses
   *                "top down" — depth 0 = snow surface, depth hS = ground.
   *
   *   Spine        The vertical line dividing the rendered page into the
   *                left panel (hand-hardness / ram / temperature curves) and
   *                the right panel (the per-layer column grid).
   *
   * ═══════════════════════════════════════════════════════════════════════════
   */

  /* ═══════════════════════════════════════════════════════════════════════════
   *   §2  PAGE ANATOMY
   *   How the A4 page is laid out, top to bottom.
   * ═══════════════════════════════════════════════════════════════════════════
   *
   *   ┌──────────────────────────────────────────────────────────────────────┐
   *   │  TITLE BAR — "Snow profile: <place>"                                 │
   *   ├──────────────────────────────────────────────────────────────────────┤
   *   │  METADATA BOX — observer · date · place · elevation · snow depth …   │
   *   ├──────────────────────────────────────────────────────────────────────┤
   *   │  LEGEND — grain-shape symbols + names                                │
   *   ├──────────────────────────────────────────────────────────────────────┤
   *   │  COLUMN HEADERS — left-panel title + right-panel rotated col titles  │
   *   ├──────────────────────────────────┬───────────────────────────────────┤
   *   │                                  │                                   │
   *   │   LEFT PANEL                     │   RIGHT PANEL  (8 columns)        │
   *   │                                  │                                   │
   *   │   • Hand-hardness steps          │   Height | Wetness                │
   *   │   • Rammsonde steps              │   Grainform 1 | Grainform 2       │
   *   │   • Temperature curve            │   Grainsize | Hardness            │
   *   │   • Stability-test markers       │   Lemons | Density                │
   *   │                                  │                                   │
   *   │   x-axis = resistance (N) /      │   One row per stratigraphy layer, │
   *   │            temperature (°C)      │   drawn at a minimum visual       │
   *   │   y-axis = height (cm)           │   height so thin layers stay      │
   *   │                                  │   readable                        │
   *   │                                  │                                   │
   *   ├──────────────────────────────────┴───────────────────────────────────┤
   *   │  T(°C) axis ticks                                                    │
   *   ├──────────────────────────────────────────────────────────────────────┤
   *   │  FOOTER — "profea  ©"                                                │
   *   └──────────────────────────────────────────────────────────────────────┘
   *
   *   The vertical bands are defined by the *_Y_MM and *_H_MM constants in §4.
   *
   * ═══════════════════════════════════════════════════════════════════════════
   */

  // ═══════════════════════════════════════════════════════════════════════════
  //   §3  DOMAIN LOOK-UPS
  //   IACS grain shapes, hand-hardness scale, wetness scale. These are the
  //   tables that map the letter codes observers write in the field into
  //   values the renderer can use.
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── IACS grain shapes ─────────────────────────────────────────────────────

  // Grain-shape code → snowsymbolsiacs font glyph.
  var GRAIN_FONT_KEYS = {
    PP: "a",
    PPgp: "o",
    DF: "c",
    RG: "d",
    FCxr: "C",
    FC: "e",
    DH: "f",
    SH: "g",
    MF: "h",
    MFcr: "O",
    IF: "i",
    MM: "b"
  };

  // Grain-shape code → fill colour (Horton et al. 2020 perception-informed palette).
  var GRAIN_COLORS = {
    PP: "#ffde00",
    PPgp: "#ffde00",
    DF: "#f1f501",
    RG: "#ffccd9",
    FC: "#b2edff",
    FCxr: "#b2edff",
    DH: "#0078ff",
    SH: "#ff0000",
    MF: "#d5ebb5",
    IF: "#a3ddbb",
    MFcr: "#addd8e",
    MM: "#888888"
  };

  // Persistent weak-layer grain types (used in the lemon-score heuristic).
  var PERSISTENT_GRAIN_RE = /^(FC|FCxr|DH|SH)/;

  // ─── Hand hardness & wetness ───────────────────────────────────────────────

  // Hand-hardness code → midpoint resistance in Newtons.
  var HARDNESS_NEWTONS = {
    F: 20,
    "F-4F": 40,
    "4F": 100,
    "4F-1F": 175,
    "1F": 250,
    "1F-P": 375,
    P: 500,
    "P-K": 750,
    K: 1000,
    "K-I": 1100,
    I: 1197
  };

  // Hand-hardness code → ordinal level (used both for the in-cell display and
  // for detecting step jumps between layers).
  var HARDNESS_LEVELS = {
    F: 1,
    "F-4F": 1.5,
    "4F": 2,
    "4F-1F": 2.5,
    "1F": 3,
    "1F-P": 3.5,
    P: 4,
    "P-K": 4.5,
    K: 5,
    "K-I": 5.5,
    I: 6
  };

  // Wetness code → ordinal level (IACS θ).
  var WETNESS_LEVELS = {
    D: 1,
    "D-M": 1.5,
    M: 2,
    "M-W": 2.5,
    W: 3,
    "W-V": 3.5,
    V: 4,
    "V-S": 4.5,
    S: 5
  };

  // Letter markers shown along the ram-resistance / hand-hardness x-axis.
  var HARDNESS_MARKERS = [
    { n: 1000, label: "K" },
    { n: 500, label: "P" },
    { n: 250, label: "1F" },
    { n: 100, label: "4F" },
    { n: 20, label: "F" }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  //   §4  PAGE GEOMETRY
  //   Everything that defines WHERE things go on the printed A4 page. Units
  //   are millimetres unless noted; mm → px happens at render time via
  //   PX_PER_MM. See the diagram in §2 for what the bands look like.
  // ═══════════════════════════════════════════════════════════════════════════

  var PX_PER_MM = 3.78;

  var PAGE_W_MM = 210;
  var PAGE_H_MM = 297;
  var MARGIN_L_MM = 6.3;
  var MARGIN_R_MM = 6.3;

  // Vertical bands.
  var TITLE_H_MM = 8.5;
  var META_Y_MM = 8.5;
  var META_H_MM = 30.5;
  var LEGEND_Y_MM = 39;
  var LEGEND_H_MM = 10;
  var HEADER_Y_MM = 49;
  var HEADER_H_MM = 16;
  var PLOT_Y_MM = 65;
  var PLOT_BOTTOM_MM = 283;
  var FOOTER_Y_MM = 291;
  var FOOTER_H_MM = 6;

  // The spine vertically separates the ram/temperature panel (left) from the
  // stratigraphy panel (right). Expressed as a fraction of the printable frame.
  var SPINE_FRACTION_OF_FRAME = 0.55;

  // Vertical headroom above the snow column on the y-axis (cm of snowpack).
  var Y_AXIS_HEADROOM_CM = 20;

  // Ram-resistance axis: divisor for n→x and last numeric tick.
  var RAM_AXIS_MAX_N = 1100;
  var RAM_TICK_MAX_N = 1000;
  var RAM_REFERENCE_LINES_N = [100, 250, 500, 1000];

  // Temperature axis: spans -TEMP_AXIS_RANGE_C..0 °C.
  var TEMP_AXIS_RANGE_C = 20;
  var TEMP_TICK_STEP_C = 2;

  // Trapezoid connector between true layer y and visual row y in the right panel.
  var RIGHT_PANEL_CONN_MM = 4.0;

  // Minimum visual row height for a layer in the right panel.
  var MIN_LAYER_ROW_MM = 5.0;

  // ═══════════════════════════════════════════════════════════════════════════
  //   §5  COLUMNS & METADATA
  //   The 8 columns of the right panel (their widths, titles, units), the
  //   metadata grid in the header block, and the legend. This is the section
  //   to edit for changing fields, rename columns, or rearrange
  //   the grid.
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Right-panel column boundaries & titles ────────────────────────────────
  // Eight columns: height, wetness, grainform1, grainform2, grainsize,
  // hardness, lemons, density. The fractions are relative to the panel width.
  var RIGHT_COLUMN_FRACTIONS = [0, 0.12, 0.24, 0.3, 0.36, 0.6, 0.72, 0.84, 1.0];

  // Right-panel column titles & units. Wetness shows the IACS θ index (1..5);
  // Hardness shows the IACS ordinal level (1..6) with no unit.
  var RIGHT_COLUMN_LABELS = [
    { title: "Height", unit: "[cm]" },
    { title: "Wetness", unit: "[θ]" },
    { title: "Grainform 1", unit: null },
    { title: "Grainform 2", unit: null },
    { title: "Grainsize", unit: "[mm]" },
    { title: "Hardness", unit: null },
    { title: "Lemons", unit: null },
    { title: "Density", unit: "[kg/m³]" }
  ];

  // ─── Metadata grid fields ──────────────────────────────────────────────────
  // The metadata box has a top row (Name / e-mail / Observation date) above a
  // divider, then a 5-row × 3-column grid below. Each entry is { col/row,
  // label, read(meta) → value-or-null }. parseCAAML fills a subset of these;
  // callers can populate the rest before passing the data object to draw().
  var META_TOP_FIELDS = [
    {
      col: 0,
      label: "Name",
      read: function (m) {
        return m.name;
      }
    },
    {
      col: 1,
      label: "e-mail",
      read: function (m) {
        return m.email;
      }
    },
    {
      col: 2,
      label: "Observation date",
      read: function (m) {
        return formatDate(m);
      }
    }
  ];

  // Metadata grid (5 rows × 3 cols). parseCAAML populates only `place`,
  // `elevation`, `airTemp`, `incline`, `aspect`, and `snowHeight`; the rest
  // (sub-region, region, country, precipitation, intensity, wind data, sky,
  // lat/long, name, email, time) are slots for callers who enrich the meta
  // object before rendering.
  var META_GRID_FIELDS = [
    {
      row: 0,
      col: 0,
      label: "Place",
      read: function (m) {
        return m.place;
      }
    },
    {
      row: 0,
      col: 1,
      label: "Elevation",
      read: function (m) {
        return m.elevation != null ? m.elevation + " m" : null;
      }
    },
    {
      row: 0,
      col: 2,
      label: "Air temperature",
      read: function (m) {
        return m.airTemp != null ? m.airTemp + " °C" : null;
      }
    },
    {
      row: 1,
      col: 0,
      label: "Sub-region",
      read: function (m) {
        return m.subregion;
      }
    },
    {
      row: 1,
      col: 1,
      label: "Incline",
      read: function (m) {
        return m.incline != null ? m.incline + "°" : null;
      }
    },
    {
      row: 1,
      col: 2,
      label: "Precipitation",
      read: function (m) {
        return m.precipitation;
      }
    },
    {
      row: 2,
      col: 0,
      label: "Region",
      read: function (m) {
        return m.region;
      }
    },
    {
      row: 2,
      col: 1,
      label: "Aspect",
      read: function (m) {
        return m.aspect;
      }
    },
    {
      row: 2,
      col: 2,
      label: "Intensity",
      read: function (m) {
        return m.intensity;
      }
    },
    {
      row: 3,
      col: 0,
      label: "Country",
      read: function (m) {
        return m.country;
      }
    },
    {
      row: 3,
      col: 1,
      label: "Wind speed",
      read: function (m) {
        return m.windSpeed;
      }
    },
    {
      row: 3,
      col: 2,
      label: "Sky condition",
      read: function (m) {
        return m.skyCondition;
      }
    },
    {
      row: 4,
      col: 0,
      label: "Lat/Long",
      read: function (m) {
        return formatLatLong(m);
      }
    },
    {
      row: 4,
      col: 1,
      label: "Wind direction",
      read: function (m) {
        return m.windDirection;
      }
    },
    {
      row: 4,
      col: 2,
      label: "Total snow depth",
      read: function (m) {
        return m.snowHeight != null ? m.snowHeight + " cm" : null;
      }
    }
  ];

  // ─── Legend entries ────────────────────────────────────────────────────────
  // Legend grid: [grain code, label, column index, row index]. Six columns
  // wide, two rows tall — fits in the LEGEND band defined in §4.
  var LEGEND_ENTRIES = [
    ["PP", "Precip. particles", 0, 0],
    ["RG", "Rounded grains", 1, 0],
    ["DH", "Depth hoar", 2, 0],
    ["MF", "Melt forms", 3, 0],
    ["FCxr", "Faceted, rounded", 4, 0],
    ["MM", "Machine made", 5, 0],
    ["DF", "Decomp. / fragm.", 0, 1],
    ["FC", "Faceted crystals", 1, 1],
    ["SH", "Surface hoar", 2, 1],
    ["IF", "Ice formations", 3, 1],
    ["PPgp", "Graupel", 4, 1],
    ["MFcr", "Melt-freeze crust", 5, 1]
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  //   §6  PER-BAND LAYOUT
  //   Small position-knobs scoped to a single band: where the rows sit inside
  //   the metadata box, where each glyph nests inside a legend cell, where
  //   the rotated column titles vs. unit strings live in the header band, etc.
  //   Numbers are mm offsets from the top-left of the band they apply to.
  // ═══════════════════════════════════════════════════════════════════════════

  var META_LAYOUT = {
    PAD_L_MM: 2,
    HEADER_ROW_Y: 3.8,
    DIVIDER_Y: 7.2,
    GRID_FIRST_Y: 9.5,
    GRID_ROW_STEP: 4.4,
    COL_FRACS: [0, 0.32, 0.6] // x as fraction of FRAME_W_MM (0 → PAD_L_MM)
  };

  var LEGEND_LAYOUT = {
    PAD_L_MM: 2,
    ROW0_Y: 2.8,
    ROW_STEP: 4.8,
    COL_COUNT: 6,
    SYM_DX_MM: 2.2,
    LABEL_DX_MM: 5.3,
    SYM_SIZE_MM: 4.5,
    SWATCH_W_MM: 6.2,
    SWATCH_H_MM: 4.4,
    SWATCH_RX_MM: 0.4,
    MFCR_SCALE: 0.42
  };

  var HEADER_LAYOUT = {
    TITLE_Y: 3.0,
    NUMS_Y: 7.0,
    SEP_Y: 9.8,
    LETTERS_Y: 13.5,
    UNIT_Y: 6.5,
    TICK_W_MM: 1.95 * 4 * 0.7,
    TICK_MIN_GAP_MM: 1.5
  };

  var TEST_LABEL_LAYOUT = {
    CHAR_W: 1.4,
    PAD_L: 1.8,
    PAD_R: 1.8,
    PAD_T: 2.4,
    PAD_B: 1.2,
    BOX_GAP: 0.6,
    BOX_RX: 0.8,
    ARROW_H: 1.6,
    ARROW_W: 1.0,
    ARROW_GAP: 1.0,
    LABEL_X_DX: 3.5,
    GROUP_NUDGE: 1.0
  };

  var COMMENTS_LAYOUT = {
    X_DX_MM: 1,
    Y_DY_MM: 2,
    WIDTH_FRACTION: 0.72,
    HEADER_Y_MM: 3.5,
    BODY_START_Y: 8.5,
    ROW_STEP_MM: 4.4,
    BOX_PADDING_MM: 6.5
  };

  // Layer cell grain-symbol sizing.
  var GRAIN_SYMBOL_PX = 3.5;
  var MFCR_PAIR_NUDGE = 0.9; // MFcr + secondary glyph x-shift factor
  var MFCR_SECONDARY_SCALE = 0.9;
  var GRAIN_PAIR_SPACING = 1.2; // grainForm 1 + 2 centre-to-centre, × symbolSize

  // ═══════════════════════════════════════════════════════════════════════════
  //   §7  TUNING KNOBS
  //   Algorithm thresholds and default values that influence behaviour rather
  //   than appearance. Tune these to change a rule (e.g. "what
  //   counts as 'near the surface' for lemon scoring") rather than a colour
  //   or a position.
  // ═══════════════════════════════════════════════════════════════════════════

  var SURFACE_PROXIMITY_CM = 100; // layer within this distance of surface scores a lemon
  var AIR_TEMP_OFFSET_CM = 15; // dashed air-temp continuation lifts this far above the column
  var PST_DEFAULT_COLUMN_CM = 120; // default PST column length when caller doesn't supply one
  var SECONDARY_LABEL_GAP_CM = 10; // snow-temp labels alternate sides when closer than this

  // SVG <defs> element IDs.
  var SVG_IDS = {
    HATCH: "hatch-diag",
    HATCH_RAM: "hatch-ram",
    CLIP_TEMP: "clip-temp",
    CLIP_R_HDR: "clip-rhdr"
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //   §8  APPEARANCE
  //   Colours, fonts, hatch patterns, and SVG <defs> ids. This is the section
  //   you edit when changing how the profile *looks* without changing its
  //   structure.
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Colors ───────────────────────────────────────────────────────────────

  var COLOR_FRAME = "#195091"; // title bar, footer
  var COLOR_HARDNESS = "#195091"; // hand-hardness step, markers & hatch
  var COLOR_BLACK = "#000";
  var COLOR_DARK_GRAY = "#333";
  var COLOR_LIGHT_GRAY = "#bbb";
  var COLOR_WHITE = "#fff";
  var COLOR_RED = "#dd0000";
  var COLOR_AIR_TEMP = "#e05a00";
  var COLOR_FALLBACK_FILL = "#cccccc";

  var COLOR_HATCH = "rgba(30,60,130,0.5)";
  var COLOR_HATCH_RAM = "rgba(150,150,150,0.5)";
  var COLOR_SHADE_TEST = "rgba(0,0,0,0.06)";
  var COLOR_SHADE_HARD = "rgba(0,0,0,0.09)";
  var COLOR_LABEL_BG = "rgba(255,255,255,0.9)";

  // Stability colour bands. Index returned by stabilityIndex(); 4 = neutral default.
  var STABILITY_PALETTE = [
    { fill: "#80cdc1", stroke: "#5aada1", text: "#000000" },
    { fill: "#018571", stroke: "#016055", text: "#ffffff" },
    { fill: "#dfc27d", stroke: "#c0a060", text: "#000000" },
    { fill: "#a6611a", stroke: "#7a4812", text: "#ffffff" },
    { fill: "#ebebeb", stroke: COLOR_FRAME, text: COLOR_FRAME }
  ];
  var STABILITY_DEFAULT_INDEX = 4;

  // Lemon-count colour bands.
  var LEMON_COLOR_HIGH = "#cc0000"; // ≥ 5
  var LEMON_COLOR_MED = "#d46000"; // ≥ 3
  var LEMON_COLOR_LOW = "#555555"; // <  3

  // ─── Font sizes (mm) ───────────────────────────────────────────────────────

  var FONT_TITLE = 4.2;
  var FONT_META_HEADER = 2.9;
  var FONT_META_CELL = 2.5;
  var FONT_DEFAULT = 2.6;
  var FONT_LEGEND = 2.55;
  var FONT_HDR_TITLE = 2.15;
  var FONT_HDR_NUM = 2.4;
  var FONT_HDR_LETTER = 2.65;
  var FONT_COL_HDR = 2.0;
  var FONT_COL_UNIT = 2.3;
  var FONT_CELL = 2.55;
  var FONT_Y_AXIS = 2.45;
  var FONT_TEST_LABEL = 2.4;
  var FONT_TEST_GROUP = 2.2;
  var FONT_TEMP_LABEL = 2.1;
  var FONT_TEMP_AXIS = 2.3;
  var FONT_TEMP_AXIS_HDR = 2.55;
  var FONT_FOOTER = 2.2;
  var FONT_COMMENTS_HDR = 2.5;
  var FONT_COMMENTS = 2.3;

  // ─── Comments-box wrapping ─────────────────────────────────────────────────
  // The comments box at the top of the plot wraps to ~42 chars per line and
  // caps at 6 lines of free-form comment + 16 total display lines (comments
  // plus the optional stability-test summary that follows).
  var COMMENTS_WRAP_CHARS = 42;
  var COMMENTS_MAX_LINES = 6;
  var COMMENTS_TOTAL_LINES = 16;
  var COMMENTS_WRAP_RE = new RegExp(
    ".{1," + COMMENTS_WRAP_CHARS + "}(\\s|$)",
    "g"
  );

  // ═══════════════════════════════════════════════════════════════════════════
  //   §9  HELPERS
  //   Small functions used by both the parser and the renderer:
  //     • XML escaping & numeric rounding
  //     • code → value look-ups (hardness, wetness, persistent grain)
  //     • formatters (date, lat/long, test labels, grain size cell)
  //     • the [Test Groups] comment-trailer parser
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Generic ───────────────────────────────────────────────────────────────

  function escapeXml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function round2(v) {
    return Math.round(v * 100) / 100;
  }

  function hardnessToNewtons(code) {
    return HARDNESS_NEWTONS[(code || "").trim()] || 0;
  }

  function hardnessToLevel(code) {
    var v = HARDNESS_LEVELS[(code || "").trim()];
    return v != null ? v : 0;
  }

  function wetnessToLevel(code) {
    var v = WETNESS_LEVELS[(code || "").trim()];
    return v != null ? v : 0;
  }

  function isPersistentGrain(code) {
    return !!code && PERSISTENT_GRAIN_RE.test(code);
  }

  function parseFloatOrNull(s) {
    if (s == null) return null;
    var n = parseFloat(s);
    return isNaN(n) ? null : n;
  }

  function formatDate(meta) {
    if (!meta.date) return "—";
    return meta.time ? meta.date + "  " + meta.time : meta.date;
  }

  function formatLatLong(meta) {
    if (meta.latitude == null || meta.longitude == null) return "—";
    return (
      (+meta.latitude).toFixed(4) + "° / " + (+meta.longitude).toFixed(4) + "°"
    );
  }

  // ─── Stability-test label formatters ───────────────────────────────────────
  // Build a pill text for each test class (CT, ECT, RB, PST).
  // The renderer uses these in drawTestLabels() and the comments-box summary.

  function formatECTLabel(t, height) {
    var res = t.result || "ECT";
    var step = t.result === "ECT31" ? "" : t.step != null ? t.step : "";
    return res + step + "@" + height;
  }

  function formatPSTLabel(t) {
    var col = t.columnLength != null ? t.columnLength : PST_DEFAULT_COLUMN_CM;
    return ("PST " + t.step + "/" + col + " " + (t.result || "")).trim();
  }

  function formatGenericTestLabel(t) {
    return (
      (t.testClass || "") +
      (t.result ? " " + t.result : "") +
      (t.step != null ? t.step : "")
    ).trim();
  }

  // ─── Misc formatters ───────────────────────────────────────────────────────

  // Merge grain-size avg & max into a single cell: "avg-max", "avg", or "max".
  function formatGrainSize(avg, max) {
    var hasAvg = avg != null && avg > 0;
    var hasMax = max != null && max > 0;
    if (hasAvg && hasMax) {
      return +avg === +max ? String(+avg) : +avg + " - " + +max;
    }
    if (hasAvg) return String(+avg);
    if (hasMax) return String(+max);
    return "";
  }

  // Reads "[Test Groups] T1=G1 T2=G2 ..." trailer from the comment, attaching
  // `.groupNumber` to each test by 1-based index. Returns the comment with the
  // trailer stripped.
  function consumeTestGroupsTail(comments, tests) {
    if (!comments) return comments;
    var tailMatch = comments.match(/\[Test Groups\][^\n]*/);
    if (!tailMatch) return comments;

    var pairs = tailMatch[0].match(/T(\d+)=G(\d+)/g);
    if (pairs) {
      pairs.forEach(function (pair) {
        var m = pair.match(/T(\d+)=G(\d+)/);
        var idx = parseInt(m[1], 10) - 1;
        var grp = parseInt(m[2], 10);
        if (tests[idx]) tests[idx].groupNumber = grp;
      });
    }
    return comments.replace(/\n*\[Test Groups\][^\n]*/, "").trim();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //   §10  CAAML v6 PARSER
  //
  //  Returns:
  //    {
  //      meta:        { observer, date, place, elevation, aspect, incline,
  //                     snowHeight, airTemp, comments },
  //      layers:      [{ heightMin, heightMax, grainFormPrimary, grainFormSecondary,
  //                      grainSizeAvg, grainSizeMax, hardness, wetness }, ...],
  //      temperatures:[{ height, temperature }, ...],
  //      densities:   [{ heightMin, heightMax, density }, ...],
  //      tests:       [{ testClass, step, height, result, groupNumber? }, ...],
  //      ramProfile:  { entries: [] }
  //    }
  //
  //  Ram profile entries (extracted from <hardnessProfile> with
  //  methodOfMeas="Ram Sonde"): each `{ depthTop, thickness, hardness }`
  //  where hardness is the resistance in Newtons.
  //
  //  Extended fields the renderer reads when callers populate them externally:
  //    meta.name, meta.email, meta.time, meta.subregion, meta.region,
  //    meta.country, meta.precipitation, meta.intensity, meta.windSpeed,
  //    meta.windDirection, meta.skyCondition, meta.latitude, meta.longitude;
  //    test.columnLength (PST).
  // ═══════════════════════════════════════════════════════════════════════════

  function parse(xmlString) {
    var dom = new DOMParser().parseFromString(xmlString, "application/xml");

    // Depth-first descendant search by localName.
    function findFirst(el, localName) {
      if (!el || typeof localName !== "string") return null;
      function walk(node) {
        if (node.nodeType === 1 && node.localName === localName) return node;
        for (var i = 0; i < node.children.length; i++) {
          var hit = walk(node.children[i]);
          if (hit) return hit;
        }
        return null;
      }
      return walk(el);
    }

    function findAll(el, localName) {
      var results = [];
      function walk(node) {
        if (node.nodeType === 1 && node.localName === localName)
          results.push(node);
        for (var i = 0; i < node.children.length; i++) walk(node.children[i]);
      }
      walk(el);
      return results;
    }

    function getText(el, localName) {
      var node = findFirst(el, localName);
      return node ? node.textContent.trim() : null;
    }

    function getNumber(el, localName) {
      return parseFloatOrNull(getText(el, localName));
    }

    function getOwnNumber(el) {
      return el ? parseFloatOrNull(el.textContent) : null;
    }

    // Snow column height (depthRef base): prefer hS, fall back to profileDepth.
    var hSEl = findFirst(dom, "hS");
    var snowHeight = hSEl ? getNumber(hSEl, "height") : null;
    var profileDepth = getOwnNumber(findFirst(dom, "profileDepth"));
    var maxHeightCm = snowHeight || profileDepth || 0;

    function depthToHeight(depthCm) {
      return maxHeightCm > 0 ? round2(maxHeightCm - depthCm) : null;
    }

    var meta = extractMeta();
    var layers = extractStratLayers();
    var temperatures = extractTemperatures();
    var densities = extractDensities();
    var ramProfile = extractRamProfile();

    var tests = [];
    extractComprTests(tests);
    extractExtColumnTests(tests);
    extractRBlockTests(tests);

    meta.comments = consumeTestGroupsTail(extractComments(), tests);

    return {
      meta: meta,
      layers: layers,
      temperatures: temperatures,
      densities: densities,
      tests: tests,
      ramProfile: ramProfile
    };

    // --- inner extractors ---

    function extractMeta() {
      var locRef = findFirst(dom, "locRef");
      var srcRef = findFirst(dom, "srcRef");
      var timeRef = findFirst(dom, "timeRef");
      var elevEl = findFirst(dom, "ElevationPosition");
      var aspectEl = findFirst(dom, "AspectPosition");
      var slopeEl = findFirst(dom, "SlopeAnglePosition");
      var airTempEl = findFirst(dom, "airTempPres");
      var dateStr = timeRef ? getText(timeRef, "timePosition") : null;

      return {
        observer: srcRef ? getText(srcRef, "name") : null,
        date: dateStr ? dateStr.slice(0, 10) : null,
        place: locRef ? getText(locRef, "name") : null,
        elevation: elevEl ? getNumber(elevEl, "position") : null,
        aspect: aspectEl ? getText(aspectEl, "position") : null,
        incline: slopeEl ? getNumber(slopeEl, "position") : null,
        snowHeight: snowHeight,
        airTemp: getOwnNumber(airTempEl),
        comments: ""
      };
    }

    function extractStratLayers() {
      var stratProfile = findFirst(dom, "stratProfile");
      if (!stratProfile) return [];

      return findAll(stratProfile, "Layer").map(function (layerEl) {
        var depthTop = getNumber(layerEl, "depthTop");
        var thickness = getNumber(layerEl, "thickness");
        var heightMax = depthTop != null ? depthToHeight(depthTop) : null;
        var heightMin =
          heightMax != null && thickness != null
            ? round2(heightMax - thickness)
            : null;

        var grainSizeEl = findFirst(layerEl, "grainSize");
        var hardnessText = getText(layerEl, "hardness");

        return {
          heightMax: heightMax,
          heightMin: heightMin,
          grainFormPrimary: getText(layerEl, "grainFormPrimary"),
          grainFormSecondary: getText(layerEl, "grainFormSecondary"),
          grainSizeAvg: grainSizeEl ? getNumber(grainSizeEl, "avg") : null,
          grainSizeMax: grainSizeEl ? getNumber(grainSizeEl, "avgMax") : null,
          // Some sources put Newton values in <hardness>; only keep classed strings.
          hardness:
            hardnessText && isNaN(Number(hardnessText)) ? hardnessText : null,
          wetness: getText(layerEl, "wetness")
        };
      });
    }

    function extractTemperatures() {
      var tempProfile = findFirst(dom, "tempProfile");
      if (!tempProfile) return [];

      return findAll(tempProfile, "Obs").map(function (obsEl) {
        return {
          height: depthToHeight(getNumber(obsEl, "depth")),
          temperature: getOwnNumber(findFirst(obsEl, "snowTemp"))
        };
      });
    }

    function extractDensities() {
      var densityProfile = findFirst(dom, "densityProfile");
      if (!densityProfile) return [];

      return findAll(densityProfile, "Layer").map(function (densEl) {
        var depthTop = getNumber(densEl, "depthTop");
        var thickness = getNumber(densEl, "thickness");
        var heightMax = depthTop != null ? depthToHeight(depthTop) : null;
        var heightMin =
          heightMax != null && thickness != null
            ? round2(heightMax - thickness)
            : null;
        return {
          heightMax: heightMax,
          heightMin: heightMin,
          density: getOwnNumber(findFirst(densEl, "density"))
        };
      });
    }

    function extractComprTests(out) {
      findAll(dom, "ComprTest").forEach(function (testEl) {
        if (findFirst(testEl, "noFailure")) {
          out.push({ testClass: "CT", step: null, height: null, result: "NF" });
          return;
        }
        findAll(testEl, "failedOn").forEach(function (failEl) {
          var depthTop = getNumber(failEl, "depthTop");
          var score = getText(failEl, "testScore");
          out.push({
            testClass: "CT",
            step: score != null && !isNaN(Number(score)) ? Number(score) : null,
            height:
              maxHeightCm > 0 && depthTop != null
                ? depthToHeight(depthTop)
                : null,
            result: getText(failEl, "fractureCharacter") || ""
          });
        });
      });
    }

    function extractExtColumnTests(out) {
      findAll(dom, "ExtColumnTest").forEach(function (testEl) {
        if (findFirst(testEl, "noFailure")) {
          out.push({
            testClass: "ECT",
            step: 31,
            height: null,
            result: "ECT31"
          });
          return;
        }
        findAll(testEl, "failedOn").forEach(function (failEl) {
          var depthTop = getNumber(failEl, "depthTop");
          var score = getText(failEl, "testScore") || "";
          var match = score.match(/^(ECTP|ECTN)(\d+)$/);
          out.push({
            testClass: "ECT",
            step: match ? Number(match[2]) : null,
            height:
              maxHeightCm > 0 && depthTop != null
                ? depthToHeight(depthTop)
                : null,
            result: match ? match[1] : score
          });
        });
      });
    }

    function extractRBlockTests(out) {
      findAll(dom, "RBlockTest").forEach(function (testEl) {
        if (findFirst(testEl, "noFailure")) {
          out.push({ testClass: "RB", step: 7, height: null, result: "NF" });
          return;
        }
        findAll(testEl, "failedOn").forEach(function (failEl) {
          var depthTop = getNumber(failEl, "depthTop");
          var score = getText(failEl, "testScore") || "";
          var match = score.match(/^RB(\d)$/);
          out.push({
            testClass: "RB",
            step: match ? Number(match[1]) : null,
            height:
              maxHeightCm > 0 && depthTop != null
                ? depthToHeight(depthTop)
                : null,
            result: getText(failEl, "releaseType") || ""
          });
        });
      });
    }

    function extractComments() {
      var snowRoot = findFirst(dom, "SnowProfile");
      var topMeta = snowRoot ? findFirst(snowRoot, "metaData") : null;
      return topMeta ? getText(topMeta, "comment") || "" : "";
    }

    // Rammsonde resistance profile.
    // CAAML stores it under <hardnessProfile> tagged with methodOfMeas="Ram Sonde";
    // each <Layer> already supplies the resistance in Newtons, so the parser only
    // forwards depthTop / thickness / hardness — no re-computation from blows.
    function extractRamProfile() {
      var hp = findFirst(dom, "hardnessProfile");
      if (!hp) return { entries: [] };

      var hpMeta = findFirst(hp, "hardnessMetaData");
      var method = hpMeta ? getText(hpMeta, "methodOfMeas") : null;
      // A hardnessProfile can also carry hand-hardness; only treat it as a ram
      // profile when the method explicitly says so.
      if (method && method.toLowerCase().indexOf("ram") === -1)
        return { entries: [] };

      var entries = findAll(hp, "Layer")
        .map(function (layerEl) {
          return {
            depthTop: getNumber(layerEl, "depthTop"),
            thickness: getNumber(layerEl, "thickness"),
            hardness: getNumber(layerEl, "hardness")
          };
        })
        .filter(function (e) {
          return e.depthTop != null && e.hardness != null;
        });

      return { entries: entries };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //   §11  SVG RENDERER
  //   draw(data, svgEl, options) — paints the parsed data into <svgEl>.
  //
  //   Roughly the flow:
  //     1. Pre-process layers/temps/tests into render rows
  //     2. Pick a y-axis scale that fits the data
  //     3. Build geometry helpers (cmToY, newtonsToX, etc.) for this draw
  //     4. Score lemons & partition layer rows for the right panel
  //     5. Stream SVG strings into `out` via the draw* helpers below
  //     6. Set svgEl.innerHTML to the joined output
  //
  //   Every draw* helper appends one shape to the buffer. The actual page
  //   assembly happens in a single linear sequence near the top of draw().
  // ═══════════════════════════════════════════════════════════════════════════

  function draw(data, svgEl, options) {
    options = options || {};
    var colorizeByGrain = !!options.colorizeByGrain;

    // Which resistance steps to show on the left panel.
    //   'both' (default) — hand-hardness step + ram step
    //   'hand'           — hand-hardness step only (ram hidden)
    //   'ram'            — ram step only (hand-hardness steps + markers hidden;
    //                                     layer rectangles fill the full panel)
    var hardnessDisplay = options.hardnessDisplay || "both";
    var showHand = hardnessDisplay !== "ram";
    var showRam = hardnessDisplay !== "hand";

    var meta = data.meta || {};
    var rawLayers = data.layers || [];
    var rawTemps = data.temperatures || [];
    var rawDensities = data.densities || [];
    var rawTests = data.tests || [];
    var ramProfile = data.ramProfile || {};

    // ----- Page geometry -----
    function px(mm) {
      return mm * PX_PER_MM;
    }

    var PAGE_W_PX = Math.round(PAGE_W_MM * PX_PER_MM);
    var PAGE_H_PX = Math.round(PAGE_H_MM * PX_PER_MM);
    var FRAME_W_MM = PAGE_W_MM - MARGIN_L_MM - MARGIN_R_MM;
    var FRAME_R_MM = MARGIN_L_MM + FRAME_W_MM;
    var SPINE_X_MM = MARGIN_L_MM + FRAME_W_MM * SPINE_FRACTION_OF_FRAME;
    var LEFT_W_MM = SPINE_X_MM - MARGIN_L_MM;
    var RIGHT_W_MM = FRAME_R_MM - SPINE_X_MM;
    var PLOT_H_MM = PLOT_BOTTOM_MM - PLOT_Y_MM;
    var CONN_PX = px(RIGHT_PANEL_CONN_MM);

    // ----- Build render rows -----
    var layerRows = rawLayers
      .filter(function (l) {
        return l.heightMax != null;
      })
      .map(buildLayerRow)
      .sort(function (a, b) {
        return a.heightBot - b.heightBot;
      });

    var temperaturePoints = rawTemps
      .filter(function (t) {
        return t.height != null && t.temperature != null;
      })
      .map(function (t) {
        return { height: +t.height, temperature: +t.temperature };
      })
      .sort(function (a, b) {
        return a.height - b.height;
      });

    var stabilityTests = rawTests
      .filter(function (t) {
        return t.height != null;
      })
      .map(buildStabilityTest);

    layerRows.forEach(function (row) {
      row.tests = stabilityTests.filter(function (t) {
        return t.height > row.heightBot && t.height <= row.heightTop;
      });
    });

    // ----- Y-axis scaling -----
    var maxHeightCm = meta.snowHeight || 0;
    layerRows.forEach(function (r) {
      if (r.heightTop > maxHeightCm) maxHeightCm = r.heightTop;
    });
    temperaturePoints.forEach(function (p) {
      if (p.height > maxHeightCm) maxHeightCm = p.height;
    });
    if (maxHeightCm <= 0) maxHeightCm = 100;

    var Y_SCALE_CM = Math.max(Math.ceil(maxHeightCm / 50) * 50, 100);
    var MM_PER_CM = PLOT_H_MM / (Y_SCALE_CM + Y_AXIS_HEADROOM_CM);

    // ----- Coordinate mappings -----
    function cmToY(cm) {
      return px(PLOT_BOTTOM_MM) - cm * px(MM_PER_CM);
    }
    function newtonsToX(n) {
      return px(SPINE_X_MM) - (n * px(LEFT_W_MM)) / RAM_AXIS_MAX_N;
    }
    function tempToX(t) {
      return px(SPINE_X_MM) + (t * px(LEFT_W_MM)) / TEMP_AXIS_RANGE_C;
    }
    function colLeftX(i) {
      return px(SPINE_X_MM + RIGHT_W_MM * RIGHT_COLUMN_FRACTIONS[i]);
    }
    function colMidX(i) {
      return (
        (colLeftX(i) +
          px(SPINE_X_MM + RIGHT_W_MM * RIGHT_COLUMN_FRACTIONS[i + 1])) /
        2
      );
    }
    function metaColX(i) {
      var f = META_LAYOUT.COL_FRACS[i];
      return px(
        MARGIN_L_MM + (f === 0 ? META_LAYOUT.PAD_L_MM : FRAME_W_MM * f)
      );
    }

    computeLemonScores();
    partitionRightPanel();

    // ----- SVG buffer + primitives -----
    var out = [];
    function emit(s) {
      out.push(s);
    }

    function pointsToStr(pairs) {
      return pairs
        .map(function (p) {
          return round2(p[0]) + "," + round2(p[1]);
        })
        .join(" ");
    }

    function strokeWidthAttr(swMm) {
      return ' stroke-width="' + round2(px(swMm)) + '"';
    }

    function drawRect(x, y, w, h, fill, stroke, sw, rx) {
      if (fill === undefined) fill = COLOR_WHITE;
      if (sw === undefined) sw = 0.4;
      if (rx === undefined) rx = 0;
      emit(
        '<rect x="' +
          round2(x) +
          '" y="' +
          round2(y) +
          '" width="' +
          round2(w) +
          '" height="' +
          round2(h) +
          '"' +
          ' fill="' +
          fill +
          '"' +
          (rx ? ' rx="' + round2(rx) + '"' : "") +
          (stroke ? ' stroke="' + stroke + '"' + strokeWidthAttr(sw) : "") +
          "/>"
      );
    }

    function drawLine(x1, y1, x2, y2, color, sw, dashMm) {
      if (color === undefined) color = COLOR_BLACK;
      if (sw === undefined) sw = 0.3;
      var dashAttr = dashMm
        ? ' stroke-dasharray="' +
          round2(px(dashMm[0])) +
          "," +
          round2(px(dashMm[1])) +
          '"'
        : "";
      emit(
        '<line x1="' +
          round2(x1) +
          '" y1="' +
          round2(y1) +
          '" x2="' +
          round2(x2) +
          '" y2="' +
          round2(y2) +
          '" stroke="' +
          color +
          '"' +
          strokeWidthAttr(sw) +
          dashAttr +
          "/>"
      );
    }

    function drawText(
      s,
      x,
      y,
      anchor,
      color,
      sz,
      bold,
      italic,
      baseline,
      rotateDeg
    ) {
      if (anchor === undefined) anchor = "start";
      if (color === undefined) color = COLOR_BLACK;
      if (sz === undefined) sz = FONT_DEFAULT;
      if (baseline === undefined) baseline = "central";
      var rotateAttr = rotateDeg
        ? ' transform="rotate(' +
          rotateDeg +
          "," +
          round2(x) +
          "," +
          round2(y) +
          ')"'
        : "";
      emit(
        '<text x="' +
          round2(x) +
          '" y="' +
          round2(y) +
          '"' +
          rotateAttr +
          ' text-anchor="' +
          anchor +
          '" dominant-baseline="' +
          baseline +
          '"' +
          ' font-family="Arial,sans-serif" font-size="' +
          round2(px(sz)) +
          '"' +
          (bold ? ' font-weight="bold"' : "") +
          (italic ? ' font-style="italic"' : "") +
          ' fill="' +
          color +
          '">' +
          escapeXml(String(s)) +
          "</text>"
      );
    }

    function drawKeyValue(key, value, x, y, sz) {
      if (sz === undefined) sz = FONT_DEFAULT;
      emit(
        '<text x="' +
          round2(x) +
          '" y="' +
          round2(y) +
          '"' +
          ' dominant-baseline="central"' +
          ' font-family="Arial,sans-serif" font-size="' +
          round2(px(sz)) +
          '" fill="' +
          COLOR_BLACK +
          '">' +
          '<tspan font-weight="bold" fill="' +
          COLOR_DARK_GRAY +
          '">' +
          escapeXml(key) +
          ":  </tspan>" +
          "<tspan>" +
          escapeXml(String(value != null ? value : "—")) +
          "</tspan></text>"
      );
    }

    function drawTSpans(x, y, parts, opts) {
      opts = opts || {};
      var tspans = parts
        .map(function (p) {
          return (
            "<tspan" +
            (p.fill ? ' fill="' + p.fill + '"' : "") +
            (p.bold ? ' font-weight="bold"' : "") +
            ">" +
            escapeXml(p.text) +
            "</tspan>"
          );
        })
        .join("");
      emit(
        '<text x="' +
          round2(x) +
          '" y="' +
          round2(y) +
          '"' +
          ' text-anchor="' +
          (opts.anchor || "start") +
          '" dominant-baseline="central"' +
          ' font-family="Arial,sans-serif" font-size="' +
          round2(px(opts.sz != null ? opts.sz : FONT_DEFAULT)) +
          '"' +
          (opts.bold ? ' font-weight="bold"' : "") +
          ">" +
          tspans +
          "</text>"
      );
    }

    function drawGrainSymbol(code, cx, cy, sizePx) {
      var glyph = GRAIN_FONT_KEYS[code];
      if (!glyph || sizePx < 1) return;
      emit(
        '<text x="' +
          round2(cx) +
          '" y="' +
          round2(cy) +
          '"' +
          ' text-anchor="middle" dominant-baseline="central"' +
          ' font-family="snowsymbolsiacs,sans-serif" font-size="' +
          round2(sizePx) +
          '"' +
          ' fill="' +
          COLOR_BLACK +
          '">' +
          glyph +
          "</text>"
      );
    }

    function drawCircle(cx, cy, r, fill) {
      emit(
        '<circle cx="' +
          round2(cx) +
          '" cy="' +
          round2(cy) +
          '" r="' +
          round2(r) +
          '" fill="' +
          (fill || COLOR_BLACK) +
          '"/>'
      );
    }

    function drawPolygon(pairs, fill, stroke) {
      emit(
        '<polygon points="' +
          pointsToStr(pairs) +
          '" fill="' +
          (fill || COLOR_WHITE) +
          '" stroke="' +
          (stroke || "none") +
          '"/>'
      );
    }

    function drawPolyline(pairs, opts) {
      opts = opts || {};
      emit(
        '<polyline points="' +
          pointsToStr(pairs) +
          '" fill="none" stroke="' +
          (opts.stroke || COLOR_BLACK) +
          '"' +
          strokeWidthAttr(opts.sw != null ? opts.sw : 0.3) +
          (opts.linecap ? ' stroke-linecap="' + opts.linecap + '"' : "") +
          (opts.linejoin ? ' stroke-linejoin="' + opts.linejoin + '"' : "") +
          "/>"
      );
    }

    function drawPath(d, opts) {
      opts = opts || {};
      emit(
        '<path d="' +
          d +
          '"' +
          ' fill="' +
          (opts.fill || "none") +
          '"' +
          ' stroke="' +
          (opts.stroke || COLOR_BLACK) +
          '"' +
          strokeWidthAttr(opts.sw != null ? opts.sw : 0.5) +
          (opts.linejoin ? ' stroke-linejoin="' + opts.linejoin + '"' : "") +
          "/>"
      );
    }

    function withClipPath(id, body) {
      emit('<g clip-path="url(#' + id + ')">');
      body();
      emit("</g>");
    }

    // ----- Page assembly -----
    setupSvgRoot();
    drawDefs();
    drawRect(0, 0, PAGE_W_PX, PAGE_H_PX, COLOR_WHITE);

    drawTitleBar();
    drawMetadataBox();
    drawLegend();
    drawColumnHeaders();
    drawPlotFrames();
    drawHardnessReferenceLines();
    drawColumnDividers();
    drawLayers();
    drawDensityColumn();
    if (showRam) drawRamProfile();
    if (showHand) drawHardnessOutline();
    drawLayerBoundaries();
    drawTestLines();
    drawTestLabels();
    drawCommentsBox();
    drawTemperatureCurve();
    drawTemperatureAxis();
    drawFooter();

    svgEl.innerHTML = out.join("\n");

    // =========================================================================
    //  Inner functions
    // =========================================================================

    function buildLayerRow(l) {
      var hardnessN = hardnessToNewtons(l.hardness);
      // Snow-profile convention: ice-formation bands stop at K (Knife) so the black band
      // and stepped outline don't escape the plot.
      if (l.grainFormPrimary === "IF" && hardnessN > HARDNESS_NEWTONS["K"]) {
        hardnessN = HARDNESS_NEWTONS["K"];
      }
      return {
        heightBot: l.heightMin != null ? l.heightMin : 0,
        heightTop: l.heightMax,
        wetness: l.wetness || "",
        grainFormPrimary: l.grainFormPrimary || "",
        grainFormSecondary: l.grainFormSecondary || "",
        grainSizeAvg: l.grainSizeAvg,
        grainSizeMax: l.grainSizeMax,
        hardness: l.hardness || "",
        hardnessNewtons: hardnessN,
        tests: [],
        lemons: 0,
        geom: null
      };
    }

    function buildStabilityTest(t) {
      var height = +t.height;
      var label;
      if (t.testClass === "ECT") label = formatECTLabel(t, height);
      else if (t.testClass === "PST" && t.step != null)
        label = formatPSTLabel(t);
      else label = formatGenericTestLabel(t);
      return {
        height: height,
        label: label,
        testClass: t.testClass,
        result: t.result,
        step: t.step,
        groupNumber: t.groupNumber || null
      };
    }

    // Lemon score per layer (Jamieson & Schweizer).
    function computeLemonScores() {
      layerRows.forEach(function (row, i) {
        var lemons = 0;
        var grainSize = +(
          (row.grainSizeMax != null ? row.grainSizeMax : row.grainSizeAvg) || 0
        );

        if (grainSize >= 1.0) lemons++;
        if ((row.hardness || "").trim() === "F") lemons++;
        if (
          isPersistentGrain(row.grainFormPrimary) ||
          isPersistentGrain(row.grainFormSecondary)
        )
          lemons++;

        var below = layerRows[i - 1];
        if (below) {
          var grainSizeBelow = +(
            (below.grainSizeMax != null
              ? below.grainSizeMax
              : below.grainSizeAvg) || 0
          );
          if (Math.abs(grainSize - grainSizeBelow) >= 1.0) lemons++;
          var lvlA = hardnessToLevel(row.hardness);
          var lvlB = hardnessToLevel(below.hardness);
          if (lvlA > 0 && lvlB > 0 && Math.abs(lvlA - lvlB) >= 2) lemons++;
        }

        if (
          maxHeightCm > 0 &&
          maxHeightCm - row.heightBot < SURFACE_PROXIMITY_CM
        )
          lemons++;
        row.lemons = lemons;
      });
    }

    // Right-panel partitioning: every layer row is at least MIN_LAYER_ROW_MM tall
    // in the visual ("partitioned") space, even if its true height would be less.
    // Stores both true and visual y on row.geom for the trapezoid connector.
    function partitionRightPanel() {
      var minRowH = px(MIN_LAYER_ROW_MM);

      layerRows.forEach(function (row) {
        row.geom = {
          trueTopY: cmToY(row.heightTop),
          trueBotY: cmToY(row.heightBot),
          visTopY: 0,
          visBotY: 0,
          visHeight: 0,
          visMidY: 0
        };
      });

      var n = layerRows.length;
      if (n === 0) return;

      var colBotY = cmToY(layerRows[0].heightBot);
      var pts = [{ y: colBotY }];
      var reserve = 0;

      for (var i = 0; i < n; i++) {
        var trueY = layerRows[i].geom.trueTopY;
        var space = pts[pts.length - 1].y - trueY - minRowH;
        pts.push({ y: trueY });
        var now = pts.length - 1;
        var prev = now - 1;

        if (space >= 0) {
          reserve += space;
        } else {
          var needed = -space;
          if (reserve >= needed) {
            reserve -= needed;
            for (var j = prev; j >= 0; j--) {
              var excess = pts[j].y - pts[j + 1].y - minRowH;
              if (excess >= 0) break;
              pts[j].y -= excess;
            }
          } else {
            pts[now].y = pts[prev].y - minRowH;
          }
        }
      }

      for (var k = 0; k < n; k++) {
        var g = layerRows[k].geom;
        g.visBotY = pts[k].y;
        g.visTopY = pts[k + 1].y;
        g.visHeight = g.visBotY - g.visTopY;
        g.visMidY = (g.visTopY + g.visBotY) / 2;
      }
    }

    function setupSvgRoot() {
      svgEl.setAttribute("viewBox", "0 0 " + PAGE_W_PX + " " + PAGE_H_PX);
      svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      // Apply default sizing only when the consumer hasn't styled the element themselves.
      if (!svgEl.style.cssText) {
        svgEl.style.cssText =
          "max-width:100%;max-height:calc(100vh - 70px);width:auto;height:auto;display:block;";
      }
    }

    function drawDefs() {
      var hatchSp = round2(px(1.5));
      var hatchLw = round2(px(0.15));
      emit("<defs>");
      emit(
        '<pattern id="' +
          SVG_IDS.HATCH +
          '" patternUnits="userSpaceOnUse" width="' +
          hatchSp +
          '" height="' +
          hatchSp +
          '">'
      );
      emit(
        '  <line x1="0" y1="' +
          hatchSp +
          '" x2="' +
          hatchSp +
          '" y2="0" stroke="' +
          COLOR_HATCH +
          '" stroke-width="' +
          hatchLw +
          '"/>'
      );
      emit("</pattern>");
      emit(
        '<pattern id="' +
          SVG_IDS.HATCH_RAM +
          '" patternUnits="userSpaceOnUse" width="' +
          hatchSp +
          '" height="' +
          hatchSp +
          '">'
      );
      emit(
        '  <line x1="0" y1="' +
          hatchSp +
          '" x2="' +
          hatchSp +
          '" y2="0" stroke="' +
          COLOR_HATCH_RAM +
          '" stroke-width="' +
          hatchLw +
          '"/>'
      );
      emit("</pattern>");
      emit('<clipPath id="' + SVG_IDS.CLIP_TEMP + '">');
      emit(
        '  <rect x="' +
          round2(px(MARGIN_L_MM)) +
          '" y="' +
          round2(px(PLOT_Y_MM)) +
          '" width="' +
          round2(px(LEFT_W_MM)) +
          '" height="' +
          round2(px(PLOT_H_MM)) +
          '"/>'
      );
      emit("</clipPath>");
      emit('<clipPath id="' + SVG_IDS.CLIP_R_HDR + '">');
      emit(
        '  <rect x="' +
          round2(px(SPINE_X_MM)) +
          '" y="' +
          round2(px(HEADER_Y_MM)) +
          '" width="' +
          round2(px(RIGHT_W_MM)) +
          '" height="' +
          round2(px(HEADER_H_MM)) +
          '"/>'
      );
      emit("</clipPath>");
      emit("</defs>");
    }

    function drawTitleBar() {
      drawRect(0, 0, PAGE_W_PX, px(TITLE_H_MM), COLOR_FRAME, null, 0.4);
      drawText(
        "Snow profile: " + (meta.place || "—"),
        px(MARGIN_L_MM + 2),
        px(TITLE_H_MM / 2),
        "start",
        COLOR_WHITE,
        FONT_TITLE,
        true
      );
    }

    function drawMetadataBox() {
      drawRect(
        px(MARGIN_L_MM),
        px(META_Y_MM),
        px(FRAME_W_MM),
        px(META_H_MM),
        COLOR_WHITE,
        COLOR_BLACK
      );

      var topY = px(META_Y_MM + META_LAYOUT.HEADER_ROW_Y);
      META_TOP_FIELDS.forEach(function (f) {
        drawKeyValue(
          f.label,
          f.read(meta) || "—",
          metaColX(f.col),
          topY,
          FONT_META_HEADER
        );
      });

      drawLine(
        px(MARGIN_L_MM),
        px(META_Y_MM + META_LAYOUT.DIVIDER_Y),
        px(FRAME_R_MM),
        px(META_Y_MM + META_LAYOUT.DIVIDER_Y),
        COLOR_BLACK,
        0.25
      );

      META_GRID_FIELDS.forEach(function (f) {
        var y = px(
          META_Y_MM +
            META_LAYOUT.GRID_FIRST_Y +
            f.row * META_LAYOUT.GRID_ROW_STEP
        );
        drawKeyValue(
          f.label,
          f.read(meta) || "—",
          metaColX(f.col),
          y,
          FONT_META_CELL
        );
      });
    }

    function drawLegend() {
      drawRect(
        px(MARGIN_L_MM),
        px(LEGEND_Y_MM),
        px(FRAME_W_MM),
        px(LEGEND_H_MM),
        COLOR_WHITE,
        COLOR_BLACK
      );

      var symSize = px(LEGEND_LAYOUT.SYM_SIZE_MM);
      var colW = FRAME_W_MM / LEGEND_LAYOUT.COL_COUNT;

      LEGEND_ENTRIES.forEach(function (entry) {
        var code = entry[0],
          label = entry[1],
          col = entry[2],
          row = entry[3];
        var lx = px(MARGIN_L_MM + LEGEND_LAYOUT.PAD_L_MM + col * colW);
        var ly = px(
          LEGEND_Y_MM + LEGEND_LAYOUT.ROW0_Y + row * LEGEND_LAYOUT.ROW_STEP
        );

        if (colorizeByGrain) {
          var swW = px(LEGEND_LAYOUT.SWATCH_W_MM);
          var swH = px(LEGEND_LAYOUT.SWATCH_H_MM);
          var swX = lx + px(LEGEND_LAYOUT.SYM_DX_MM) - swW / 2;
          var swY = ly - swH / 2;
          drawRect(
            swX,
            swY,
            swW,
            swH,
            GRAIN_COLORS[code] || COLOR_FALLBACK_FILL,
            COLOR_BLACK,
            0.2,
            px(LEGEND_LAYOUT.SWATCH_RX_MM)
          );
        }
        var glyphSize =
          code === "MFcr" ? symSize * LEGEND_LAYOUT.MFCR_SCALE : symSize;
        drawGrainSymbol(code, lx + px(LEGEND_LAYOUT.SYM_DX_MM), ly, glyphSize);
        drawText(
          label,
          lx + px(LEGEND_LAYOUT.LABEL_DX_MM),
          ly,
          "start",
          COLOR_BLACK,
          FONT_LEGEND
        );
      });
    }

    function drawColumnHeaders() {
      drawRect(
        px(MARGIN_L_MM),
        px(HEADER_Y_MM),
        px(FRAME_W_MM),
        px(HEADER_H_MM),
        COLOR_WHITE,
        COLOR_BLACK
      );

      var titleY = HEADER_Y_MM + HEADER_LAYOUT.TITLE_Y;
      var numsY = HEADER_Y_MM + HEADER_LAYOUT.NUMS_Y;
      var sepY = HEADER_Y_MM + HEADER_LAYOUT.SEP_Y;
      var lettersY = HEADER_Y_MM + HEADER_LAYOUT.LETTERS_Y;

      // Title varies with hardnessDisplay so the header reflects what's plotted.
      var titleParts;
      if (showHand && showRam) {
        titleParts = [
          { text: "Ram resistance [N]", fill: COLOR_BLACK },
          { text: "  ·  Hand hardness index", fill: COLOR_HARDNESS }
        ];
      } else if (showRam) {
        titleParts = [{ text: "Ram resistance [N]", fill: COLOR_BLACK }];
      } else {
        titleParts = [{ text: "Hand hardness index", fill: COLOR_HARDNESS }];
      }
      drawTSpans(px(MARGIN_L_MM + LEFT_W_MM / 2), px(titleY), titleParts, {
        anchor: "middle",
        sz: FONT_HDR_TITLE,
        bold: true
      });

      // Numeric ram-resistance ticks (auto-stride to avoid crowding).
      var tickW = px(HEADER_LAYOUT.TICK_W_MM);
      var minSep = tickW + px(HEADER_LAYOUT.TICK_MIN_GAP_MM);
      var per100 = px(LEFT_W_MM) / 11;
      var nStep = per100 >= minSep ? 100 : per100 * 2 >= minSep ? 200 : 500;
      for (var n = nStep; n <= RAM_TICK_MAX_N; n += nStep) {
        var x = newtonsToX(n);
        if (x < px(MARGIN_L_MM) - 1 || x > px(SPINE_X_MM) + 1) continue;
        drawText(n, x, px(numsY), "middle", COLOR_BLACK, FONT_HDR_NUM);
        drawLine(x, px(sepY), x, px(sepY + 2.0), COLOR_BLACK, 0.4);
      }

      drawLine(
        px(MARGIN_L_MM),
        px(sepY),
        px(SPINE_X_MM),
        px(sepY),
        COLOR_BLACK,
        0.5
      );

      if (showHand) {
        HARDNESS_MARKERS.forEach(function (m) {
          var x = newtonsToX(m.n);
          if (x < px(MARGIN_L_MM) - 1 || x > px(SPINE_X_MM) + 1) return;
          drawText(
            m.label,
            x,
            px(lettersY),
            "middle",
            COLOR_HARDNESS,
            FONT_HDR_LETTER,
            true
          );
        });
      }

      withClipPath(SVG_IDS.CLIP_R_HDR, function () {
        RIGHT_COLUMN_LABELS.forEach(function (col, i) {
          var cx = colMidX(i);
          var cy = px(
            col.unit
              ? HEADER_Y_MM + HEADER_LAYOUT.UNIT_Y
              : HEADER_Y_MM + HEADER_H_MM / 2
          );
          drawText(
            col.title,
            cx,
            cy,
            "middle",
            COLOR_BLACK,
            FONT_COL_HDR,
            true,
            false,
            "central",
            -90
          );
          if (col.unit)
            drawText(
              col.unit,
              cx,
              px(lettersY),
              "middle",
              COLOR_BLACK,
              FONT_COL_UNIT
            );
        });
      });

      // Vertical column dividers in the header. Skip i=3 (cols 2 & 3 share a header).
      for (var ic = 1; ic < 8; ic++) {
        if (ic !== 3)
          drawLine(
            colLeftX(ic),
            px(HEADER_Y_MM),
            colLeftX(ic),
            px(HEADER_Y_MM + HEADER_H_MM),
            COLOR_BLACK,
            0.5
          );
      }
      drawLine(
        px(SPINE_X_MM),
        px(HEADER_Y_MM),
        px(SPINE_X_MM),
        px(HEADER_Y_MM + HEADER_H_MM),
        COLOR_BLACK,
        0.5
      );
    }

    function drawPlotFrames() {
      drawRect(
        px(MARGIN_L_MM),
        px(PLOT_Y_MM),
        px(LEFT_W_MM),
        px(PLOT_H_MM),
        COLOR_WHITE,
        COLOR_BLACK
      );
      drawRect(
        px(SPINE_X_MM),
        px(PLOT_Y_MM),
        px(RIGHT_W_MM),
        px(PLOT_H_MM),
        COLOR_WHITE,
        COLOR_BLACK
      );

      var cmStep = Y_SCALE_CM <= 200 ? 10 : Y_SCALE_CM <= 400 ? 20 : 50;
      for (var cm = cmStep; cm <= Y_SCALE_CM; cm += cmStep) {
        var y = cmToY(cm);
        if (y < px(PLOT_Y_MM) - 1 || y > px(PLOT_BOTTOM_MM) + 1) continue;
        drawLine(
          px(SPINE_X_MM),
          y,
          px(SPINE_X_MM) + px(1.5),
          y,
          COLOR_BLACK,
          0.45
        );
        drawText(cm, colMidX(0), y, "middle", COLOR_BLACK, FONT_Y_AXIS);
      }
      drawLine(
        px(SPINE_X_MM),
        px(PLOT_Y_MM),
        px(SPINE_X_MM),
        px(PLOT_BOTTOM_MM),
        COLOR_BLACK,
        0.5
      );
    }

    function drawHardnessReferenceLines() {
      RAM_REFERENCE_LINES_N.forEach(function (n) {
        var x = newtonsToX(n);
        if (x <= px(MARGIN_L_MM) || x >= px(SPINE_X_MM)) return;
        drawLine(
          x,
          px(PLOT_Y_MM),
          x,
          px(PLOT_BOTTOM_MM),
          COLOR_SHADE_HARD,
          0.2
        );
      });
    }

    function drawColumnDividers() {
      for (var i = 1; i < 9; i++) {
        if (i !== 3)
          drawLine(
            colLeftX(i),
            px(PLOT_Y_MM),
            colLeftX(i),
            px(PLOT_BOTTOM_MM),
            COLOR_BLACK,
            0.5
          );
      }
    }

    function drawLayers() {
      var symbolSize = px(GRAIN_SYMBOL_PX);

      layerRows.forEach(function (row) {
        // When the hand-hardness steps are hidden the staircase shape becomes
        // meaningless, so the layer rectangles fill the entire left panel.
        var xRectLeft = showHand
          ? newtonsToX(row.hardnessNewtons)
          : px(MARGIN_L_MM);
        var xS = px(SPINE_X_MM);
        var yT = cmToY(row.heightTop);
        var yB = cmToY(row.heightBot);
        var layH = yB - yT;
        var midY = row.geom.visMidY;

        if (yT < px(PLOT_Y_MM) - 1) return;

        // Ice formations are always rendered as a solid black band.
        if (row.grainFormPrimary === "IF") {
          drawRect(xRectLeft, yT, xS - xRectLeft, layH, COLOR_BLACK);
        } else if (colorizeByGrain) {
          // Grain-shape fill is layer information, not hardness information,
          // so it's drawn regardless of which resistance steps are shown.
          drawRect(
            xRectLeft,
            yT,
            xS - xRectLeft,
            layH,
            GRAIN_COLORS[row.grainFormPrimary] || COLOR_FALLBACK_FILL
          );
        } else if (showHand) {
          // The blue diagonal hatch IS the hand-hardness fill, so it's only
          // drawn when the hand-hardness staircase is being shown. In 'ram'
          // mode with no colorize, the left panel stays clean — just the ram
          // step and the layer-boundary lines are displayed.
          drawRect(xRectLeft, yT, xS - xRectLeft, layH, COLOR_WHITE);
          drawRect(
            xRectLeft,
            yT,
            xS - xRectLeft,
            layH,
            "url(#" + SVG_IDS.HATCH + ")"
          );
        }

        // Highlight the right-panel row (trapezoid) when this layer carries tests.
        // The highlight stops at the density-column boundary so the density
        // column stays visually independent.
        if (row.tests && row.tests.length) {
          var g = row.geom;
          var x0 = px(SPINE_X_MM);
          var xConn = x0 + CONN_PX;
          var xR = colLeftX(7);
          drawPolygon(
            [
              [x0, g.trueTopY],
              [xConn, g.visTopY],
              [xR, g.visTopY],
              [xR, g.visBotY],
              [xConn, g.visBotY],
              [x0, g.trueBotY]
            ],
            COLOR_SHADE_TEST,
            "none"
          );
        }

        var wetnessLevel = wetnessToLevel(row.wetness);
        if (wetnessLevel > 0)
          drawText(
            String(wetnessLevel),
            colMidX(1),
            midY,
            "middle",
            COLOR_BLACK,
            FONT_CELL
          );

        drawLayerGrainSymbols(row, midY, symbolSize);

        var grainSizeLabel = formatGrainSize(
          row.grainSizeAvg,
          row.grainSizeMax
        );
        if (grainSizeLabel)
          drawText(
            grainSizeLabel,
            colMidX(4),
            midY,
            "middle",
            COLOR_BLACK,
            FONT_CELL
          );

        var hardnessLevel = hardnessToLevel(row.hardness);
        if (hardnessLevel > 0)
          drawText(
            String(hardnessLevel),
            colMidX(5),
            midY,
            "middle",
            COLOR_BLACK,
            FONT_CELL
          );

        if (row.lemons > 0) {
          var lemonColor =
            row.lemons >= 5
              ? LEMON_COLOR_HIGH
              : row.lemons >= 3
                ? LEMON_COLOR_MED
                : LEMON_COLOR_LOW;
          drawText(
            String(row.lemons),
            colMidX(6),
            midY,
            "middle",
            lemonColor,
            FONT_CELL,
            true
          );
        }
      });
    }

    // Renders the grain glyphs in the two grainform columns. Special cases:
    //  - IF (ice formation): a single glyph centred across both columns.
    //  - MFcr (melt-freeze crust): wider than the others, so the secondary
    //    glyph nestles up against the crust symbol instead of sitting in its
    //    own column.
    //  - Everything else: primary in col 2, secondary in col 3. If no
    //    secondary is declared the primary is repeated so every row carries a
    //    balanced pair.
    function drawLayerGrainSymbols(row, midY, symbolSize) {
      var g1 = row.grainFormPrimary;
      if (!g1) return;

      if (g1 === "IF") {
        drawGrainSymbol(g1, (colLeftX(2) + colLeftX(4)) / 2, midY, symbolSize);
        return;
      }

      var g2 = row.grainFormSecondary || g1;

      if (g1 === "MFcr") {
        // Centre the MFcr + secondary pair across both grainshape columns,
        // the same way IF does its single glyph.
        var pairCenter = (colLeftX(2) + colLeftX(4)) / 2;
        var halfNudge = (symbolSize * MFCR_PAIR_NUDGE) / 2;
        drawGrainSymbol(g1, pairCenter - halfNudge, midY, symbolSize);
        drawGrainSymbol(
          g2,
          pairCenter + halfNudge,
          midY,
          symbolSize * MFCR_SECONDARY_SCALE
        );
      } else {
        // Centre the pair across both grainshape columns with a slightly
        // tighter spacing than the full column-midpoint spread (which leaves
        // a visible gap between the two glyphs).
        var pairCenter = (colLeftX(2) + colLeftX(4)) / 2;
        var halfGap = (symbolSize * GRAIN_PAIR_SPACING) / 2;
        drawGrainSymbol(g1, pairCenter - halfGap, midY, symbolSize);
        drawGrainSymbol(g2, pairCenter + halfGap, midY, symbolSize);
      }
    }

    function drawDensityColumn() {
      var visible = rawDensities
        .filter(function (d) {
          return d.heightMax != null && d.density != null;
        })
        .sort(function (a, b) {
          return b.heightMax - a.heightMax;
        });

      visible.forEach(function (d) {
        var heightBot = d.heightMin != null ? d.heightMin : 0;
        var yT = cmToY(d.heightMax);
        var yB = cmToY(heightBot);
        var midY = (yT + yB) / 2;
        if (midY < px(PLOT_Y_MM) || midY > px(PLOT_BOTTOM_MM)) return;
        [yT, yB].forEach(function (y) {
          if (y >= px(PLOT_Y_MM) - 0.5 && y <= px(PLOT_BOTTOM_MM) + 0.5) {
            drawLine(colLeftX(7), y, colLeftX(8), y, COLOR_LIGHT_GRAY, 0.3);
          }
        });
        drawText(
          Math.round(d.density),
          colMidX(7),
          midY,
          "middle",
          COLOR_BLACK,
          FONT_CELL
        );
      });
    }

    // Stepped hardness outline on the left panel (one step per layer).
    function drawHardnessOutline() {
      if (!layerRows.length) return;
      var d = "";
      layerRows.forEach(function (row, i) {
        var x = newtonsToX(row.hardnessNewtons);
        var yT = cmToY(row.heightTop);
        var yB = cmToY(row.heightBot);
        d +=
          i === 0
            ? "M " + round2(px(SPINE_X_MM)) + " " + round2(yB)
            : " L " + round2(px(SPINE_X_MM)) + " " + round2(yB);
        d +=
          " L " +
          round2(x) +
          " " +
          round2(yB) +
          " L " +
          round2(x) +
          " " +
          round2(yT);
      });
      d +=
        " L " +
        round2(px(SPINE_X_MM)) +
        " " +
        round2(cmToY(layerRows[layerRows.length - 1].heightTop));
      drawPath(d, { stroke: COLOR_HARDNESS, sw: 0.5, linejoin: "miter" });
    }

    // Right-panel layer boundary lines, with diagonal connectors when the true
    // and visual y diverge after partitioning. The lines stop at the left edge
    // of the density column — the density profile draws its own horizontal
    // segments inside that column.
    function drawLayerBoundaries() {
      var drawn = {};

      function drawBoundary(trueY, visY) {
        if (trueY < px(PLOT_Y_MM) - 2 && visY < px(PLOT_Y_MM) - 2) return;
        if (trueY > px(PLOT_BOTTOM_MM) + 2 && visY > px(PLOT_BOTTOM_MM) + 2)
          return;
        var key = round2(trueY) + "," + round2(visY);
        if (drawn[key]) return;
        drawn[key] = true;

        var x0 = px(SPINE_X_MM);
        var xConn = x0 + CONN_PX;
        var xR = colLeftX(7); // stop at the density-column boundary

        if (Math.abs(trueY - visY) > 0.5) {
          drawLine(x0, trueY, xConn, visY, COLOR_BLACK, 0.5);
          drawLine(xConn, visY, xR, visY, COLOR_BLACK, 0.5);
        } else {
          drawLine(x0, visY, xR, visY, COLOR_BLACK, 0.5);
        }
      }

      layerRows.forEach(function (row) {
        drawBoundary(row.geom.trueTopY, row.geom.visTopY);
        drawBoundary(row.geom.trueBotY, row.geom.visBotY);
      });
    }

    // Ram penetrometer (Rammsonde) profile, drawn as steps on the
    // left panel using the same ram-resistance x-axis as the hand-hardness
    // outline. Each entry already carries the resistance in Newtons (the
    // CAAML field <hardness uom="N">), so the renderer just maps n → x.
    // Zero-thickness "point" entries are skipped — they have no vertical
    // extent to draw a step over.
    function drawRamProfile() {
      var entries = ramProfile.entries || [];
      if (!entries.length) return;

      var snowH =
        meta.snowHeight != null
          ? meta.snowHeight
          : layerRows.length
            ? layerRows.reduce(function (m, r) {
                return Math.max(m, r.heightTop);
              }, 0)
            : 0;

      var intervals = entries
        .filter(function (e) {
          return (e.thickness || 0) > 0 && e.hardness != null;
        })
        .map(function (e) {
          return {
            heightTop: snowH - e.depthTop,
            heightBot: snowH - e.depthTop - e.thickness,
            R: e.hardness
          };
        })
        .sort(function (a, b) {
          return a.heightBot - b.heightBot;
        });

      if (!intervals.length) return;

      // Clip x to the left edge of the panel so values above RAM_AXIS_MAX_N
      // don't escape the plot.
      var leftEdge = px(MARGIN_L_MM);
      function ramX(n) {
        return Math.max(newtonsToX(n), leftEdge);
      }

      var d = "";
      intervals.forEach(function (it, i) {
        var x = ramX(it.R);
        var yB = cmToY(it.heightBot);
        var yT = cmToY(it.heightTop);
        d +=
          i === 0
            ? "M " + round2(px(SPINE_X_MM)) + " " + round2(yB)
            : " L " + round2(px(SPINE_X_MM)) + " " + round2(yB);
        d +=
          " L " +
          round2(x) +
          " " +
          round2(yB) +
          " L " +
          round2(x) +
          " " +
          round2(yT);
      });
      d +=
        " L " +
        round2(px(SPINE_X_MM)) +
        " " +
        round2(cmToY(intervals[intervals.length - 1].heightTop)) +
        " Z";

      drawPath(d, {
        fill: "url(#" + SVG_IDS.HATCH_RAM + ")",
        stroke: COLOR_BLACK,
        sw: 0.3
      });
    }

    // Dashed horizontal lines marking each stability test on the left panel.
    function drawTestLines() {
      stabilityTests.forEach(function (t) {
        var y = cmToY(t.height);
        if (y < px(PLOT_Y_MM) || y > px(PLOT_BOTTOM_MM)) return;
        drawLine(
          px(MARGIN_L_MM),
          y,
          px(SPINE_X_MM),
          y,
          COLOR_FRAME,
          0.45,
          [2.5, 2]
        );
      });
    }

    function stabilityIndex(t) {
      var cls = t.testClass || "";
      var res = (t.result || "").trim();
      var step = t.step != null ? +t.step : null;

      if (cls === "CT") {
        if (res === "NF" || step === null) return 0;
        if (step <= 10) return 3;
        if (step <= 20) return 2;
        if (step <= 30) return 1;
        return 0;
      }
      if (cls === "ECT") {
        if (res === "ECT31" || res === "ECTN" || res === "NF") return 0;
        if (res === "ECTP") {
          if (step === null) return 2;
          if (step <= 10) return 3;
          if (step <= 20) return 2;
          return 1;
        }
        return 1;
      }
      if (cls === "RB") {
        if (step === null) return STABILITY_DEFAULT_INDEX;
        if (step >= 6) return 0;
        if (step >= 4) return 1;
        if (step >= 3) return 2;
        return 3;
      }
      if (cls === "PST") {
        if (res === "End" || res === "Arr") return 3;
        if (res === "SF") return 2;
        return 1;
      }
      return STABILITY_DEFAULT_INDEX;
    }

    // Stability test labels — pinned arrow heads, vertically staggered to
    // avoid overlap, with a coloured pill per palette band.
    function drawTestLabels() {
      var L = TEST_LABEL_LAYOUT;
      var charW = px(L.CHAR_W);
      var padL = px(L.PAD_L);
      var padR = px(L.PAD_R);
      var padT = px(L.PAD_T);
      var padB = px(L.PAD_B);
      var boxH = padT + padB;
      var boxGap = px(L.BOX_GAP);
      var boxRx = round2(px(L.BOX_RX));
      var arrowH = px(L.ARROW_H);
      var arrowW = px(L.ARROW_W);
      var arrowGap = px(L.ARROW_GAP);
      var labelX = px(MARGIN_L_MM + L.LABEL_X_DX);

      var prevLy = px(PLOT_BOTTOM_MM) + px(20);

      var items = stabilityTests
        .filter(function (t) {
          var y = cmToY(t.height);
          return y >= px(PLOT_Y_MM) && y <= px(PLOT_BOTTOM_MM);
        })
        .sort(function (a, b) {
          return a.height - b.height;
        })
        .map(function (t) {
          var y = cmToY(t.height);
          var natLy = y - padB - arrowH - arrowGap;
          var ly = Math.min(natLy, prevLy - boxH - boxGap);
          prevLy = ly;

          var approxW = t.label.length * charW;
          var boxX = labelX - padL;
          var boxY = ly - padT;
          var boxW = approxW + padL + padR;
          var boxBot = ly + padB;
          var ax = boxX + boxW / 2;

          var cls = t.testClass || "";
          var paletteIdx =
            cls === "ECT" || cls === "RB"
              ? stabilityIndex(t)
              : STABILITY_DEFAULT_INDEX;

          return {
            y: y,
            ly: ly,
            boxX: boxX,
            boxY: boxY,
            boxW: boxW,
            boxBot: boxBot,
            ax: ax,
            label: t.label,
            palette: STABILITY_PALETTE[paletteIdx],
            groupNumber: t.groupNumber
          };
        });

      withClipPath(SVG_IDS.CLIP_TEMP, function () {
        items.forEach(function (it) {
          var arrowTip = it.y;
          var arrowBase = it.y - arrowH;
          if (arrowBase > it.boxBot + px(0.3)) {
            drawLine(
              it.ax,
              it.boxBot,
              it.ax,
              arrowBase,
              it.palette.stroke,
              0.25
            );
          }
          drawPath(
            "M" +
              round2(it.ax - arrowW) +
              "," +
              round2(arrowBase) +
              " L" +
              round2(it.ax + arrowW) +
              "," +
              round2(arrowBase) +
              " L" +
              round2(it.ax) +
              "," +
              round2(arrowTip) +
              " Z",
            { fill: it.palette.stroke, stroke: "none", sw: 0 }
          );
        });

        items.forEach(function (it) {
          drawRect(
            it.boxX,
            it.boxY,
            it.boxW,
            boxH,
            it.palette.fill,
            it.palette.stroke,
            0.3,
            boxRx
          );
        });

        items.forEach(function (it) {
          drawText(
            it.label,
            it.ax,
            it.ly,
            "middle",
            it.palette.text,
            FONT_TEST_LABEL,
            true
          );
        });

        items.forEach(function (it) {
          if (!it.groupNumber) return;
          drawText(
            "group #" + it.groupNumber,
            it.boxX + it.boxW + px(L.GROUP_NUDGE),
            it.ly,
            "start",
            COLOR_DARK_GRAY,
            FONT_TEST_GROUP,
            false,
            true
          );
        });
      });
    }

    function drawCommentsBox() {
      var commentLines = meta.comments
        ? (String(meta.comments).match(COMMENTS_WRAP_RE) || [meta.comments])
            .slice(0, COMMENTS_MAX_LINES)
            .map(function (l) {
              return l.trim();
            })
        : [];

      var testLines = buildTestSummaryLines();
      if (!commentLines.length && !testLines.length) return;

      var hasBoth = commentLines.length && testLines.length;
      var header = commentLines.length ? "Comments:" : "Stability tests:";

      var display = [];
      Array.prototype.push.apply(display, commentLines);
      if (hasBoth) {
        display.push("");
        display.push("Stability tests:");
      }
      Array.prototype.push.apply(display, testLines);
      var capped = display.slice(0, COMMENTS_TOTAL_LINES);

      var bxMM = MARGIN_L_MM + COMMENTS_LAYOUT.X_DX_MM;
      var bwMM = LEFT_W_MM * COMMENTS_LAYOUT.WIDTH_FRACTION;
      var bhMM =
        COMMENTS_LAYOUT.BOX_PADDING_MM +
        capped.length * COMMENTS_LAYOUT.ROW_STEP_MM;
      var byMM = PLOT_Y_MM + COMMENTS_LAYOUT.Y_DY_MM;

      drawRect(
        px(bxMM),
        px(byMM),
        px(bwMM),
        px(bhMM),
        COLOR_WHITE,
        COLOR_BLACK,
        0.3
      );
      drawText(
        header,
        px(bxMM + 1),
        px(byMM + COMMENTS_LAYOUT.HEADER_Y_MM),
        "start",
        COLOR_DARK_GRAY,
        FONT_COMMENTS_HDR,
        true
      );

      capped.forEach(function (line, i) {
        var isSection =
          line === "Stability tests:" ||
          /^Group \d:$/.test(line) ||
          line === "Ungrouped:";
        drawText(
          line,
          px(bxMM + 1),
          px(
            byMM +
              COMMENTS_LAYOUT.BODY_START_Y +
              i * COMMENTS_LAYOUT.ROW_STEP_MM
          ),
          "start",
          isSection ? COLOR_DARK_GRAY : COLOR_BLACK,
          FONT_COMMENTS,
          isSection
        );
      });
    }

    function buildTestSummaryLines() {
      if (!stabilityTests.length) return [];

      var hasGroups = stabilityTests.some(function (t) {
        return t.groupNumber;
      });
      if (!hasGroups) {
        return stabilityTests.map(function (t) {
          return t.label;
        });
      }

      var buckets = { 1: [], 2: [], 3: [], 4: [], 0: [] };
      stabilityTests.forEach(function (t) {
        var g = t.groupNumber || 0;
        if (buckets[g]) buckets[g].push(t.label);
      });

      var lines = [];
      [1, 2, 3, 4].forEach(function (g) {
        if (!buckets[g].length) return;
        lines.push("Group " + g + ":");
        buckets[g].forEach(function (l) {
          lines.push("  " + l);
        });
      });
      if (buckets[0].length) {
        lines.push("Ungrouped:");
        buckets[0].forEach(function (l) {
          lines.push("  " + l);
        });
      }
      return lines;
    }

    function drawTemperatureCurve() {
      if (!temperaturePoints.length) return;

      withClipPath(SVG_IDS.CLIP_TEMP, function () {
        if (temperaturePoints.length >= 2) {
          var points = temperaturePoints.map(function (pt) {
            return [tempToX(pt.temperature), cmToY(pt.height)];
          });
          drawPolyline(points, {
            stroke: COLOR_RED,
            sw: 0.6,
            linecap: "round",
            linejoin: "round"
          });
        }

        var airT =
          meta.airTemp != null && +meta.airTemp <= 0 ? +meta.airTemp : null;
        var airH = maxHeightCm + AIR_TEMP_OFFSET_CM;
        if (airT != null) {
          var topPt = temperaturePoints[temperaturePoints.length - 1];
          drawLine(
            tempToX(topPt.temperature),
            cmToY(topPt.height),
            tempToX(airT),
            cmToY(airH),
            COLOR_RED,
            0.6,
            [2.8, 2.0]
          );
        }

        drawSnowTempLabels();
        if (airT != null) drawAirTempLabel(airT, airH);
      });
    }

    function drawSnowTempLabels() {
      var prevHeight = -Infinity;
      var side = "left";

      temperaturePoints.forEach(function (pt) {
        var x = tempToX(pt.temperature);
        var y = cmToY(pt.height);
        if (y < px(PLOT_Y_MM) - 2 || y > px(PLOT_BOTTOM_MM) + 2) return;

        var label = (+pt.temperature).toFixed(1) + "°C";
        drawCircle(x, y, px(0.9), COLOR_RED);

        var approxW = label.length * px(FONT_TEMP_LABEL) * 0.6 + px(1.0);
        var labelY = Math.min(y, px(PLOT_BOTTOM_MM) - px(2.0));

        // Alternate sides when two labels would crowd vertically.
        side =
          Math.abs(pt.height - prevHeight) < SECONDARY_LABEL_GAP_CM
            ? side === "left"
              ? "right"
              : "left"
            : "left";
        prevHeight = pt.height;

        // If 'right' would push the label past the spine (the clipPath
        // boundary), force 'left' so the label stays visible. This is the
        // typical case for the surface-temperature reading, which sits very
        // close to 0 °C and so lands right next to the spine.
        if (side === "right" && x + approxW > px(SPINE_X_MM)) side = "left";

        drawTempLabelPill(label, x, labelY, approxW, side, COLOR_RED);
      });
    }

    function drawAirTempLabel(airT, airH) {
      var x = tempToX(airT);
      var y = cmToY(airH);
      if (y < px(PLOT_Y_MM) - 2) return;

      var label = airT.toFixed(1) + "°C";
      var approxW = label.length * px(FONT_TEMP_LABEL) * 0.6 + px(1.0);

      drawCircle(x, y, px(0.9), COLOR_AIR_TEMP);
      drawTempLabelPill(label, x, y, approxW, "left", COLOR_AIR_TEMP);
    }

    function drawTempLabelPill(label, x, y, approxW, side, accentColor) {
      var rectX = side === "left" ? x - approxW - px(0.3) : x - px(0.3);
      var textX = side === "left" ? x - px(0.4) : x + px(0.4);
      var anchor = side === "left" ? "end" : "start";

      drawRect(
        rectX,
        y - px(1.7),
        approxW + px(0.6),
        px(3.4),
        COLOR_LABEL_BG,
        accentColor,
        0.2
      );
      drawText(label, textX, y, anchor, COLOR_BLACK, FONT_TEMP_LABEL);
    }

    function drawTemperatureAxis() {
      drawText(
        "T(°C)",
        px(SPINE_X_MM - 0.5),
        px(PLOT_BOTTOM_MM + 4.5),
        "end",
        COLOR_BLACK,
        FONT_TEMP_AXIS_HDR,
        true
      );
      for (
        var t = -TEMP_TICK_STEP_C;
        t >= -TEMP_AXIS_RANGE_C;
        t -= TEMP_TICK_STEP_C
      ) {
        var x = tempToX(t);
        if (x < px(MARGIN_L_MM) - 1 || x > px(SPINE_X_MM) + 1) continue;
        drawLine(
          x,
          px(PLOT_BOTTOM_MM),
          x,
          px(PLOT_BOTTOM_MM + 2.0),
          COLOR_BLACK,
          0.3
        );
        drawText(
          t,
          x,
          px(PLOT_BOTTOM_MM + 5.0),
          "middle",
          COLOR_BLACK,
          FONT_TEMP_AXIS
        );
      }
    }

    function drawFooter() {
      drawRect(
        0,
        px(FOOTER_Y_MM),
        PAGE_W_PX,
        px(FOOTER_H_MM),
        COLOR_FRAME,
        null,
        0.4
      );
      drawText(
        "profea",
        px(MARGIN_L_MM + 1),
        px(FOOTER_Y_MM + FOOTER_H_MM / 2),
        "start",
        COLOR_WHITE,
        FONT_FOOTER,
        false,
        true
      );
      drawText(
        "©",
        px(PAGE_W_MM - MARGIN_R_MM - 1),
        px(FOOTER_Y_MM + FOOTER_H_MM / 2),
        "end",
        COLOR_WHITE,
        FONT_FOOTER
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //   §12  PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════

  return { parse: parse, draw: draw };
});
