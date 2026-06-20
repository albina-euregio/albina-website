import React, { useEffect, useMemo, useRef } from "react";
import { useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";

import "leaflet";
import BulletinMapDetails from "./bulletin-map-details";
import { preprocessContent } from "../../util/htmlParser";
import type {
  AvalancheProblemType,
  BulletinCollection,
  Status
} from "../../stores/bulletin";
import { scrollIntoView } from "../../util/scrollIntoView";
import {
  matchesValidTimePeriod,
  toAmPm,
  ValidTimePeriod
} from "../../stores/bulletin";
import { useStore } from "@nanostores/react";
import {
  eawsRegion,
  eawsRegionIds,
  eawsRegionsBounds
} from "../../stores/eawsRegions";
import { getMacroRegion, microRegionIds } from "../../stores/microRegions";
import { $focusRegions, $province } from "../../appStore";
import { FormattedMessage } from "../../i18n";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { MAPLIBRE_STYLE } from "../maplibre/maplibre-style";
import { WarnLevelNumber } from "../../util/warn-levels";
import eawsPmtimes from "@eaws/pmtiles/eaws-regions.pmtiles?url";
import { REGION_FILL_PAINT, REGION_LINE_PAINT } from "./bulletin-map-paint";

// Register the pmtiles:// protocol once so MapLibre can read PMTiles archives.
// https://maplibre.org/maplibre-gl-js/docs/examples/pmtiles-source-and-protocol/
maplibregl.addProtocol("pmtiles", new Protocol().tile);

// Transparent style for the overlay map that carries the danger-rating fills.
// It is stacked over the base map with `mix-blend-mode: multiply` (MapLibre has
// no per-layer blend mode, so the multiply happens between the two canvases).
const OVERLAY_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {},
  layers: []
};

// Registry of the interactive overlay maps currently mounted (e.g. the
// earlier/later bulletin maps), kept view-synced so they share one view. Each
// map registers itself on creation and removes itself on destroy. The
// `syncingMaps` guard breaks the feedback loop, since jumpTo() on a target map
// itself fires a `move` event.
const syncedMaps: maplibregl.Map[] = [];
let syncingMaps = false;

export type RegionState =
  | "mouseOver"
  | "selected"
  | "highlighted"
  | "dehighlighted"
  | "dimmed"
  | "noData"
  | "noDataMouseOver"
  | "noDataGrey"
  | "noDataGreyMouseOver"
  // partial-no-data micro-region (inside a rated macro-region) while
  // hovered/selected: noDataGrey fill plus the mouseOver border.
  | "noDataPartialMouseOver"
  | "default";

interface RegionFeatureStates {
  stateById: Record<string, RegionState>;
  warnlevelById: Record<string, WarnLevelNumber>;
  internById: Record<string, boolean>;
  hoverStateById: Record<string, RegionState>;
  hoverGroup: Record<string, string[]>;
}

const REGION_SOURCE = {
  source: "eaws-regions",
  sourceLayer: "micro-regions"
} as const;

// Push the per-region `state` / `warnlevel` / `intern` feature-states onto the
// overlay source, then re-apply the active hover group on top of the new base
// states. No-op until the source exists.
function applyFeatureStates(
  map: maplibregl.Map | null,
  fs: RegionFeatureStates,
  hoverActive: string[]
) {
  if (!map?.getSource(REGION_SOURCE.source)) return;
  for (const id of Object.keys(fs.stateById)) {
    map.setFeatureState(
      { ...REGION_SOURCE, id },
      {
        state: fs.stateById[id],
        warnlevel: fs.warnlevelById[id] ?? 0,
        intern: !!fs.internById[id]
      }
    );
  }
  for (const id of hoverActive) {
    map.setFeatureState(
      { ...REGION_SOURCE, id },
      { state: fs.hoverStateById[id] }
    );
  }
}

interface Props {
  activeBulletinCollection: BulletinCollection;
  problems: Record<AvalancheProblemType, { highlighted: boolean }>;
  status: Status;
  region: string;
  validTimePeriod: ValidTimePeriod;
  date: Temporal.PlainDate;
  handleSelectRegion: (region: string) => void;
  onSelectTimePeriod: (timePeriod: string) => void;
}

const BulletinMap = (props: Props) => {
  const intl = useIntl();
  const focusRegions = useStore($focusRegions);
  const language = intl.locale.slice(0, 2);

  const styleOverMap = () => {
    return {
      zIndex: 1000
    };
  };

  const NoRatingPopup = ({
    divKey,
    regionName,
    onClose,
    children
  }: {
    divKey: string;
    regionName: string;
    onClose: () => void;
    children?: React.ReactNode;
  }) => (
    <div key={divKey}>
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          onClose();
        }}
        className="bulletin-map-details-close icon-close"
      >
        <span className="is-visually-hidden">
          {intl.formatMessage({ id: "bulletin:map:details:close" })}
        </span>
      </a>
      <p className="bulletin-report-region-name">
        <span className="bulletin-report-region-name-region">{regionName}</span>
      </p>
      <p
        className="bulletin-report-region-name"
        style={{ textAlign: "center" }}
      >
        <img
          src={`${window.config.projectRoot}images/pro/danger-levels/level_0.svg`}
          alt={intl.formatMessage({ id: "danger-level:no_rating" })}
          style={{ height: "4em", display: "block", margin: "0 auto 0.25em" }}
        />
        <FormattedMessage id="danger-level:no_rating" />
      </p>
      {children}
    </div>
  );

  const AwsLinks = ({
    aws
  }: {
    aws: { name: string; url: Partial<Record<string, string>> }[];
  }) =>
    (aws || []).map((link, index) => {
      const href = link.url[language] || Object.values(link.url)[0];
      return (
        <Tooltip key={`tp-aws-link-${index}`} label={href}>
          <a
            tabIndex="-1"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
            className={
              /ALPSOLUT|METEOMONT/.test(link.name)
                ? "pure-button is-de-highlighted"
                : "pure-button"
            }
            style={{ cursor: "pointer", pointerEvents: "initial" }}
          >
            {link.name}{" "}
            <span
              className="icon-arrow-right"
              style={{ verticalAlign: "sub", marginLeft: "0.25em" }}
            />
          </a>
        </Tooltip>
      );
    });

  const PopupButton = ({
    href,
    label,
    target,
    rel,
    onClick,
    className,
    children
  }: {
    href: string;
    label: string;
    target?: string;
    rel?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    className?: string;
    children: React.ReactNode;
  }) => (
    <Tooltip label={label}>
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={className ?? "pure-button"}
        style={{ cursor: "pointer", pointerEvents: "initial" }}
      >
        {children}
      </a>
    </Tooltip>
  );

  const getBulletinMapDetails = () => {
    const res = [];
    const detailsClasses = ["bulletin-map-details", "top-right"];
    const activeBulletin =
      props.activeBulletinCollection?.getBulletinForBulletinOrRegion(
        props.region
      );
    const activeEaws = eawsRegion(props.region);
    if (activeBulletin) {
      detailsClasses.push("js-active");
      res.push(
        <BulletinMapDetails
          key="details"
          bulletin={activeBulletin}
          region={intl.formatMessage({
            id: "region:" + props.region
          })}
          validTimePeriod={props.validTimePeriod}
          unselectRegion={() => props.handleSelectRegion("")}
        />
      );
      const isNoSnowBulletin = activeBulletin.dangerRatings
        ?.filter(r =>
          matchesValidTimePeriod(props.validTimePeriod, r.validTimePeriod)
        )
        .some(r => r.mainValue === "no_snow");
      res.push(
        activeBulletin?.bulletinID &&
          (isNoSnowBulletin ? (
            <PopupButton
              key="tp-education"
              href="/education/danger-scale"
              label={intl.formatMessage({
                id: "bulletin:map:education:button:title"
              })}
            >
              {intl.formatMessage({ id: "bulletin:map:education:button" })}{" "}
              <span className="icon-arrow-right" />
            </PopupButton>
          ) : (
            <PopupButton
              key="tp-link"
              href={"#" + activeBulletin.bulletinID}
              label={intl.formatMessage({
                id: "bulletin:map:info:details:hover"
              })}
              onClick={e => scrollIntoView(e)}
            >
              {preprocessContent(
                intl.formatMessage({ id: "bulletin:map:info:details" })
              )}
              <span className="icon-arrow-down" />
            </PopupButton>
          ))
      );
    } else if (activeEaws) {
      detailsClasses.push("js-active");
      const country = activeEaws.id.replace(/-.*/, "");
      const region = activeEaws.id;
      res.push(
        <div>
          <a
            href="#"
            onClick={() => props.handleSelectRegion("")}
            className="bulletin-map-details-close icon-close"
          >
            <span className="is-visually-hidden">
              {intl.formatMessage({ id: "bulletin:map:details:close" })}
            </span>
          </a>

          <p
            key={`eaws-name-${country}`}
            className="bulletin-report-region-name"
          >
            <span className="bulletin-report-region-name-country">
              {intl.formatMessage({ id: "region:" + country })}
            </span>
            <span>&nbsp;/ </span>
            <span className="bulletin-report-region-name-region">
              {intl.formatMessage({ id: "region:" + region })}
            </span>
          </p>
        </div>
      );
      res.push(<AwsLinks key="eaws-links" aws={activeEaws.aws ?? []} />);
    } else {
      // Check if the clicked region belongs to a macro-region with no data
      const macroRegion = getMacroRegion(props.region);
      const isNoDataMacro =
        macroRegion &&
        props.activeBulletinCollection?.macroRegionStatuses?.[macroRegion] ===
          "n/a";
      if (isNoDataMacro && focusRegions.includes(macroRegion)) {
        // primary region: focus macro-region with no data: show blog link
        detailsClasses.push("js-active");
        res.push(
          <NoRatingPopup
            key="no-data"
            divKey="no-data"
            regionName={intl.formatMessage({ id: "region:" + macroRegion })}
            onClose={() => props.handleSelectRegion("")}
          >
            <PopupButton
              href={`/blog?region=${macroRegion}`}
              label={intl.formatMessage({
                id: "bulletin:map:blog:button:title"
              })}
            >
              {intl.formatMessage({ id: "bulletin:map:blog:button" })}{" "}
              <span
                className="icon-arrow-right"
                style={{ verticalAlign: "sub", marginLeft: "0.25em" }}
              />
            </PopupButton>
          </NoRatingPopup>
        );
      } else if (
        macroRegion &&
        props.activeBulletinCollection?.macroRegionStatuses?.[macroRegion] ===
          "ok"
      ) {
        // Micro-region within a rated macro-region but itself without a rating
        detailsClasses.push("js-active");
        res.push(
          <NoRatingPopup
            key="no-rating-partial"
            divKey="no-rating-partial"
            regionName={intl.formatMessage({ id: "region:" + props.region })}
            onClose={() => props.handleSelectRegion("")}
          />
        );
        res.push(
          <PopupButton
            key="tp-education"
            href="/education"
            label={intl.formatMessage({
              id: "bulletin:map:education:button:title"
            })}
          >
            {intl.formatMessage({ id: "bulletin:map:education:button" })}{" "}
            <span className="icon-arrow-right" />
          </PopupButton>
        );
      } else if (isNoDataMacro) {
        // extraRegion with no rating: no-rating icon/text + external AWS links
        const greyEaws = eawsRegion(macroRegion);
        detailsClasses.push("js-active");
        res.push(
          <NoRatingPopup
            key="no-data-grey"
            divKey="no-data-grey"
            regionName={intl.formatMessage({ id: "region:" + macroRegion })}
            onClose={() => props.handleSelectRegion("")}
          />
        );
        res.push(<AwsLinks aws={greyEaws?.aws ?? []} />);
      }
    }

    return (
      <div style={styleOverMap()} className={detailsClasses.join(" ")}>
        {res}
      </div>
    );
  };

  return (
    <section
      id="section-bulletin-map"
      className="section section-bulletin-map"
      aria-hidden
    >
      <div
        className={
          "section-map" + (config.map.useWindowWidth ? "" : " section-centered")
        }
        data-iframe-ignore
      >
        <MapLibreMap
          activeBulletinCollection={props.activeBulletinCollection}
          problems={props.problems}
          region={props.region}
          validTimePeriod={props.validTimePeriod}
          handleSelectRegion={props.handleSelectRegion}
        />
        {getBulletinMapDetails()}

        {props.validTimePeriod && (
          <p className="bulletin-map-daytime">
            <span className="primary label">
              {!config.bulletin.switchBetweenTimePeriods
                ? intl.formatMessage({
                    id: `bulletin:header:${props.validTimePeriod}`
                  })
                : (["earlier", "later"] as const).map(timePeriod => (
                    <a
                      key={timePeriod}
                      href="#"
                      className={
                        "toggle-link" +
                        (props.validTimePeriod === timePeriod ? " active" : "")
                      }
                      onClick={() => props.onSelectTimePeriod(timePeriod)}
                    >
                      {intl.formatMessage({
                        id: `bulletin:header:${timePeriod}`
                      })}
                    </a>
                  ))}
            </span>
          </p>
        )}
      </div>
    </section>
  );
};

export default BulletinMap;

function MapLibreMap({
  activeBulletinCollection,
  problems,
  region,
  validTimePeriod,
  handleSelectRegion
}: Pick<
  Props,
  | "activeBulletinCollection"
  | "problems"
  | "region"
  | "validTimePeriod"
  | "handleSelectRegion"
>) {
  const intl = useIntl();
  const baseRef = useRef<HTMLDivElement | null>(null);
  const baseMapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const overlayMapRef = useRef<maplibregl.Map | null>(null);
  const focusRegions = useStore($focusRegions);

  // Region styling is driven entirely through feature-states (`state` /
  // `warnlevel` / `intern`), not React re-renders, so selection / hover changes
  // never re-upload paint. These refs keep the once-mounted map handlers in sync
  // with the latest feature-state values and the currently-hovered group.
  const hoverAnchorRef = useRef<string>("");
  const hoverActiveRef = useRef<string[]>([]);

  // Latest select handler, so the once-mounted map listeners never go stale.
  const handleSelectRegionRef = useRef(handleSelectRegion);
  handleSelectRegionRef.current = handleSelectRegion;

  // Region id sets used to drive the state styling (cf. PbfRegionState).
  const microRegions = useMemo(
    () =>
      microRegionIds(activeBulletinCollection?.date, [
        ...config.regionCodes,
        ...config.extraRegions
      ]),
    [activeBulletinCollection?.date]
  );
  const eawsRegions = useMemo(
    () => eawsRegionIds().filter(r => !config.extraRegions.includes(r)),
    []
  );
  const eawsMicroRegions = useMemo(
    () =>
      Object.keys(activeBulletinCollection?.eawsMaxDangerRatings || {}).filter(
        region => !region.includes(":")
      ),
    [activeBulletinCollection?.eawsMaxDangerRatings]
  );

  // Per-region feature-state values that drive `regionPaint`, recomputed when the
  // bulletin data or selection changes and pushed onto the source via
  // setFeatureState (cf. applyFeatureStates).
  const featureStates = useMemo((): RegionFeatureStates => {
    const amPm = toAmPm[validTimePeriod ?? "all_day"] ?? "";

    // Max danger rating (warn-level) per region — the danger fill the state
    // overlay composites over.
    const dangerRatings = {
      ...(activeBulletinCollection?.maxDangerRatings ?? {}),
      ...(activeBulletinCollection?.eawsMaxDangerRatings ?? {})
    };
    const province = $province.get();
    const internRegex = province
      ? new RegExp(`^(${province})`)
      : new RegExp(config.regionsRegex);
    const warnlevelByRegion: Record<string, WarnLevelNumber> = {};
    for (const id of new Set(
      Object.keys(dangerRatings).map(key => key.replace(/:.*/, ""))
    )) {
      const warnlevel = (dangerRatings[`${id}${amPm}`] ??
        Math.max(
          dangerRatings[`${id}:low${amPm}`] ?? 0,
          dangerRatings[`${id}:high${amPm}`] ?? 0
        )) as WarnLevelNumber;
      if (!warnlevel) continue;
      warnlevelByRegion[id] = warnlevel;
    }

    function getRegionState(regionId: string, hovered: string): RegionState {
      const macroRegion = getMacroRegion(regionId);
      const macroStatus =
        macroRegion !== undefined
          ? activeBulletinCollection?.macroRegionStatuses?.[macroRegion]
          : undefined;
      const isNoData = macroStatus === "n/a";
      const isFocusRegion = !!macroRegion && focusRegions.includes(macroRegion);
      const noDataState = isFocusRegion ? "noData" : "noDataGrey";
      const noDataMouseOverState = isFocusRegion
        ? "noDataMouseOver"
        : "noDataGreyMouseOver";

      // EAWS regions not present in the ratings JSON → grey,
      // but only if the whole EAWS provider area has no ratings
      const parentPrefix =
        regionId.lastIndexOf("-") > 0
          ? regionId.substring(0, regionId.lastIndexOf("-"))
          : regionId;
      const effectivePrefix = regionId === "LI" ? "CH" : parentPrefix;
      const isEawsWithNoData =
        eawsRegions.includes(regionId) &&
        !eawsMicroRegions.some(r => r.startsWith(effectivePrefix));

      // Detect micro-regions with no rating inside an otherwise-rated macro-region
      const hasRating = regionId in warnlevelByRegion;
      const isPartialNoData = !isNoData && !hasRating && macroStatus === "ok";

      // For n/a regions: highlight the whole macro-region on hover (no stroke)
      const hoveredMacroRegion = getMacroRegion(hovered);
      const selectedMacroRegion = getMacroRegion(region);
      const isSameHoveredMacro =
        isNoData &&
        hoveredMacroRegion !== undefined &&
        hoveredMacroRegion === macroRegion;
      const isSameSelectedMacro =
        isNoData &&
        selectedMacroRegion !== undefined &&
        selectedMacroRegion === macroRegion;
      if (isSameHoveredMacro || isSameSelectedMacro) {
        return noDataMouseOverState;
      }

      if (regionId === hovered) {
        // partial-no-data gets the mouseOver border (former isPartialNoDataHover),
        // EAWS-with-no-data does not.
        return isPartialNoData
          ? "noDataPartialMouseOver"
          : isEawsWithNoData
            ? "noDataGreyMouseOver"
            : "mouseOver";
      }

      // For n/a or partial no-data regions: keep color (increased opacity) when selected
      if (regionId === region) {
        return isNoData
          ? noDataMouseOverState
          : isPartialNoData
            ? "noDataPartialMouseOver"
            : isEawsWithNoData
              ? "noDataGreyMouseOver"
              : "selected";
      }
      if (
        activeBulletinCollection
          ?.getBulletinForBulletinOrRegion(region)
          ?.regions?.some(r => r.regionID === regionId)
      ) {
        return "highlighted";
      }
      if (region) {
        // some other region is selected — keep n/a / partial regions colored, dim the rest
        return isNoData || isPartialNoData || isEawsWithNoData
          ? isPartialNoData || isEawsWithNoData
            ? "noDataGrey"
            : noDataState
          : "dimmed";
      }

      const bulletinProblemTypes =
        activeBulletinCollection
          ?.getBulletinForBulletinOrRegion(regionId)
          ?.avalancheProblems?.filter(p =>
            matchesValidTimePeriod(validTimePeriod, p.validTimePeriod)
          )
          ?.map(p => p.problemType) ??
        activeBulletinCollection?.eawsAvalancheProblems?.[
          `${regionId}${toAmPm[validTimePeriod || "all_day"]}`
        ] ??
        [];
      if (bulletinProblemTypes.some(p => problems?.[p]?.highlighted)) {
        return "highlighted";
      }

      // dehighligt if any filter is activated
      if (Object.values(problems).some(p => p.highlighted)) {
        return isNoData
          ? noDataState
          : isEawsWithNoData
            ? "noDataGrey"
            : "dehighlighted";
      }

      if (isNoData) {
        return noDataState;
      }

      if (isPartialNoData || isEawsWithNoData) {
        return "noDataGrey";
      }

      return "default";
    }

    const allRegionIds = new Set([
      ...microRegions,
      ...eawsRegions,
      ...Object.keys(warnlevelByRegion)
    ]);

    // Micro-regions grouped by macro-region, to highlight the whole macro-region
    // when any of its (no-data) micro-regions is hovered.
    const macroMembers: Record<string, string[]> = {};
    for (const regionId of allRegionIds) {
      const macro = getMacroRegion(regionId);
      if (macro) (macroMembers[macro] ??= []).push(regionId);
    }

    const stateById: Record<string, RegionState> = {};
    const warnlevelById: Record<string, WarnLevelNumber> = {};
    const internById: Record<string, boolean> = {};
    const hoverStateById: Record<string, RegionState> = {};
    // Feature ids to mark hovered when a given region is hovered (just itself,
    // or the whole macro-region for n/a regions which highlight as a group).
    const hoverGroup: Record<string, string[]> = {};

    for (const regionId of allRegionIds) {
      stateById[regionId] = getRegionState(regionId, "");
      warnlevelById[regionId] = warnlevelByRegion[regionId] ?? 0;
      internById[regionId] = internRegex.test(regionId);
      // Hovering a region reproduces both individual and macro-group hover by
      // passing the region as its own hovered id.
      hoverStateById[regionId] = getRegionState(regionId, regionId);
      const macro = getMacroRegion(regionId);
      const isNoData =
        !!macro &&
        activeBulletinCollection?.macroRegionStatuses?.[macro] === "n/a";
      hoverGroup[regionId] =
        isNoData && macro ? macroMembers[macro] : [regionId];
    }

    return { stateById, warnlevelById, internById, hoverStateById, hoverGroup };
  }, [
    activeBulletinCollection,
    problems,
    region,
    validTimePeriod,
    focusRegions,
    microRegions,
    eawsRegions,
    eawsMicroRegions
  ]);

  // Latest feature-states, so the once-mounted map handlers (hover, initial
  // apply on `load`) never read stale values.
  const featureStatesRef = useRef(featureStates);
  featureStatesRef.current = featureStates;

  // Hide micro-regions whose start_date/end_date is not valid on the bulletin
  // date — the MapLibre equivalent of the GeoJSON `filterFeature` predicate
  // (empty/absent bounds are open-ended; no date → show nothing).
  const featureFilter = useMemo((): maplibregl.FilterSpecification => {
    const today = activeBulletinCollection?.date?.toString();
    if (!today) return ["literal", false];
    return [
      "all",
      [
        "case",
        ["==", ["coalesce", ["get", "start_date"], ""], ""],
        true,
        ["<=", ["get", "start_date"], today]
      ],
      [
        "case",
        ["==", ["coalesce", ["get", "end_date"], ""], ""],
        true,
        [">", ["get", "end_date"], today]
      ]
    ];
  }, [activeBulletinCollection?.date]);

  useEffect(() => {
    if (!baseRef.current || !overlayRef.current || baseMapRef.current) return;

    const bounds = eawsRegionsBounds(focusRegions).pad(0.1);
    const initialBounds: maplibregl.LngLatBoundsLike = [
      [bounds.getWest(), bounds.getSouth()],
      [bounds.getEast(), bounds.getNorth()]
    ];

    // Base map: the shared raster style (basemap + opentopomap). It sits behind
    // the overlay (pointer-events: none) and is non-interactive — it just
    // follows the overlay's view.
    const base = new maplibregl.Map({
      container: baseRef.current,
      style: MAPLIBRE_STYLE,
      minZoom: 5,
      maxZoom: 10,
      bounds: initialBounds,
      interactive: false
    });

    // Overlay map: only the danger-rating fills + region borders, stacked on top
    // with `mix-blend-mode: multiply` (see the JSX below). It is the interactive
    // map; the base map is view-synced to it.
    const overlay = new maplibregl.Map({
      cooperativeGestures: true,
      dragRotate: false,
      locale: {
        "CooperativeGesturesHandler.WindowsHelpText": intl.formatMessage({
          id: "bulletin:map:gesture:windows"
        }),
        "CooperativeGesturesHandler.MacHelpText": intl.formatMessage({
          id: "bulletin:map:gesture:mac"
        }),
        "CooperativeGesturesHandler.MobileHelpText": intl.formatMessage({
          id: "bulletin:map:gesture:mobile"
        }),
        "NavigationControl.ZoomIn": intl.formatMessage({
          id: "bulletin:map:zoom-in:hover"
        }),
        "NavigationControl.ZoomOut": intl.formatMessage({
          id: "bulletin:map:zoom-out:hover"
        })
      },
      container: overlayRef.current,
      style: OVERLAY_STYLE,
      minZoom: 5,
      maxZoom: 10,
      bounds: initialBounds
    });

    overlay.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-left"
    );

    overlay.on("load", () => {
      overlay.addSource("eaws-regions", {
        type: "vector",
        url: `pmtiles://${eawsPmtimes}`,
        // Promote `id` to the feature id so hover feature-state can be keyed by it.
        promoteId: "id"
      });
      overlay.addLayer({
        id: "eaws-regions-fill",
        type: "fill",
        source: "eaws-regions",
        "source-layer": "micro-regions",
        filter: featureFilter,
        paint: REGION_FILL_PAINT
      });
      overlay.addLayer({
        id: "eaws-regions-line",
        type: "line",
        source: "eaws-regions",
        "source-layer": "micro-regions",
        filter: featureFilter,
        paint: REGION_LINE_PAINT
      });

      // Push the initial feature-states now that the source exists (subsequent
      // changes flow through the effect below).
      applyFeatureStates(
        overlay,
        featureStatesRef.current,
        hoverActiveRef.current
      );

      // Region interaction, migrated from the former Leaflet PbfLayerOverlay
      // event handlers: select on click (empty space deselects), track hover.
      overlay.on("click", e => {
        const [feature] = overlay.queryRenderedFeatures(e.point, {
          layers: ["eaws-regions-fill"]
        });
        handleSelectRegionRef.current(feature?.properties?.id ?? "");
      });
      // Swap the hovered region (or its whole macro-region group) onto its hover
      // `state` feature-state instead of re-rendering: restore the previous group
      // to its base state, then apply the new group's hover state. Only `state`
      // is touched, so `warnlevel` / `intern` are preserved (cf. setFeatureState
      // merge); the base state is read fresh so it tracks selection changes.
      const setHover = (ids: string[]) => {
        const fs = featureStatesRef.current;
        for (const id of hoverActiveRef.current) {
          overlay.setFeatureState(
            { ...REGION_SOURCE, id },
            { state: fs.stateById[id] }
          );
        }
        hoverActiveRef.current = ids;
        for (const id of ids) {
          overlay.setFeatureState(
            { ...REGION_SOURCE, id },
            { state: fs.hoverStateById[id] }
          );
        }
      };
      overlay.on("mousemove", "eaws-regions-fill", e => {
        overlay.getCanvas().style.cursor = "pointer";
        const id = e.features?.[0]?.id;
        if (id == null || String(id) === hoverAnchorRef.current) return;
        hoverAnchorRef.current = String(id);
        const group = featureStatesRef.current.hoverGroup[String(id)] ?? [
          String(id)
        ];
        setHover(group);
      });
      overlay.on("mouseleave", "eaws-regions-fill", () => {
        overlay.getCanvas().style.cursor = "";
        hoverAnchorRef.current = "";
        setHover([]);
      });
    });

    // Keep the base map glued to its overlay's view, and mirror the view onto
    // any other mounted overlay maps (earlier/later) so they stay in sync.
    syncedMaps.push(overlay);
    overlay.on("move", () => {
      const view: maplibregl.JumpToOptions = {
        center: overlay.getCenter(),
        zoom: overlay.getZoom(),
        bearing: overlay.getBearing(),
        pitch: overlay.getPitch()
      };
      base.jumpTo(view);
      if (syncingMaps) return;
      syncingMaps = true;
      for (const otherMap of syncedMaps) {
        if (otherMap !== overlay) otherMap.jumpTo(view);
      }
      syncingMaps = false;
    });

    baseMapRef.current = base;
    overlayMapRef.current = overlay;

    const resizeObserver = new ResizeObserver(() => {
      base.resize();
      overlay.resize();
    });
    resizeObserver.observe(baseRef.current);

    return () => {
      resizeObserver?.disconnect();
      const index = syncedMaps.indexOf(overlay);
      if (index >= 0) syncedMaps.splice(index, 1);
      base.remove();
      baseMapRef.current = null;
      overlay.remove();
      overlayMapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-style the region fill + borders on danger / selection / filter changes by
  // updating the per-region `state` / `warnlevel` / `intern` feature-states; the
  // paint expression itself is static. Hover is layered on top inside the map
  // handlers (see setHover above).
  useEffect(() => {
    applyFeatureStates(
      overlayMapRef.current,
      featureStates,
      hoverActiveRef.current
    );
  }, [featureStates]);

  // Re-apply the date-validity filter to both region layers when the date changes.
  useEffect(() => {
    const map = overlayMapRef.current;
    for (const id of ["eaws-regions-fill", "eaws-regions-line"]) {
      if (!map?.getLayer(id)) break;
      map.setFilter(id, featureFilter);
    }
  }, [featureFilter]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={baseRef}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />
      <div
        ref={overlayRef}
        style={{ position: "absolute", inset: 0, mixBlendMode: "multiply" }}
      />
    </div>
  );
}
