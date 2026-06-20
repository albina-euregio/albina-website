import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";

import "leaflet";
import "leaflet.sync";
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
import {
  WARNLEVEL_COLORS,
  WARNLEVEL_OPACITY,
  WarnLevelNumber
} from "../../util/warn-levels";

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

type RegionState =
  | "mouseOver"
  | "selected"
  | "highlighted"
  | "dehighlighted"
  | "dimmed"
  | "noData"
  | "noDataMouseOver"
  | "noDataGrey"
  | "noDataGreyMouseOver"
  | "default";

interface Props {
  activeBulletinCollection: BulletinCollection;
  problems: Record<AvalancheProblemType, { highlighted: boolean }>;
  status: Status;
  region: string;
  validTimePeriod: ValidTimePeriod;
  date: Temporal.PlainDate;
  handleSelectRegion: (region: string) => void;
  onMapInit: (map: L.Map) => void;
  onSelectTimePeriod: (timePeriod: string) => void;
}

const BulletinMap = (props: Props) => {
  const intl = useIntl();
  const focusRegions = useStore($focusRegions);
  const language = intl.locale.slice(0, 2);
  const [regionMouseover, setRegionMouseover] = useState("");

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
          regionMouseover={regionMouseover}
          handleSelectRegion={props.handleSelectRegion}
          setRegionMouseover={setRegionMouseover}
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
  regionMouseover,
  handleSelectRegion,
  setRegionMouseover
}: Pick<
  Props,
  | "activeBulletinCollection"
  | "problems"
  | "region"
  | "validTimePeriod"
  | "handleSelectRegion"
> & {
  regionMouseover: string;
  setRegionMouseover: React.Dispatch<React.SetStateAction<string>>;
}) {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const baseMapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const overlayMapRef = useRef<maplibregl.Map | null>(null);
  const focusRegions = useStore($focusRegions);

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

  const statePaint = useMemo((): {
    state: maplibregl.FillLayerSpecification["paint"];
    line: maplibregl.LineLayerSpecification["paint"];
  } => {
    // Region-state styling, ported from the former Leaflet PbfRegionState overlay.
    // Produces data-driven paint for two layers stacked above the danger-rating
    // fill: a state overlay fill (dimming / no-data / problem-filter colours) and
    // the region borders (shown on hover / selection).
    const styling = config.map.regionStyling;

    function getRegionState(regionId: string): RegionState {
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
      const amPm = toAmPm[validTimePeriod ?? "all_day"] ?? "";
      const maxDangerRatings = activeBulletinCollection?.maxDangerRatings ?? {};
      const hasRating =
        `${regionId}:low${amPm}` in maxDangerRatings ||
        `${regionId}:high${amPm}` in maxDangerRatings ||
        `${regionId}${amPm}` in maxDangerRatings;
      const isPartialNoData = !isNoData && !hasRating && macroStatus === "ok";

      // For n/a regions: highlight the whole macro-region on hover (no stroke)
      const hoveredMacroRegion = getMacroRegion(regionMouseover);
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

      if (regionId === regionMouseover) {
        return isPartialNoData || isEawsWithNoData
          ? "noDataGreyMouseOver"
          : "mouseOver";
      }

      // For n/a or partial no-data regions: keep color (increased opacity) when selected
      if (regionId === region) {
        return isNoData
          ? noDataMouseOverState
          : isPartialNoData || isEawsWithNoData
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

    // Translate the merged Leaflet path options into per-region lookup tables,
    // consumed below as MapLibre `["get", id, ["literal", …]]` expressions.
    const fillColorById: Record<string, string> = {};
    const fillOpacityById: Record<string, number> = {};
    const lineColorById: Record<string, string> = {};
    const lineWidthById: Record<string, number> = {};
    const lineOpacityById: Record<string, number> = {};

    const amPm = toAmPm[validTimePeriod ?? "all_day"] ?? "";
    const maxDangerRatings = activeBulletinCollection?.maxDangerRatings ?? {};

    for (const regionId of new Set([...microRegions, ...eawsRegions])) {
      const state = getRegionState(regionId);
      // show border for partial-no-data micro-regions on hover
      const isPartialNoDataHover =
        state === "noDataGreyMouseOver" &&
        !(
          `${regionId}:low${amPm}` in maxDangerRatings ||
          `${regionId}:high${amPm}` in maxDangerRatings ||
          `${regionId}${amPm}` in maxDangerRatings
        ) &&
        activeBulletinCollection?.macroRegionStatuses?.[
          getMacroRegion(regionId) ?? ""
        ] === "ok";
      const style = {
        ...styling.clickable,
        ...styling.all,
        ...styling[state],
        ...(isPartialNoDataHover ? styling.mouseOver : {})
      };
      const fillOpacity = style.fillOpacity ?? 0;
      if (
        style.fill !== false &&
        style.fillColor &&
        style.fillColor !== "none" &&
        fillOpacity > 0
      ) {
        fillColorById[regionId] = style.fillColor;
        fillOpacityById[regionId] = fillOpacity;
      }
      if (style.stroke) {
        lineColorById[regionId] = style.color ?? "#aaaaaa";
        lineWidthById[regionId] = style.weight ?? 1;
        lineOpacityById[regionId] = style.opacity ?? 1;
      }
    }

    return {
      state: {
        "fill-color": [
          "coalesce",
          ["get", ["get", "id"], ["literal", fillColorById]],
          "#000000"
        ],
        "fill-opacity": [
          "coalesce",
          ["get", ["get", "id"], ["literal", fillOpacityById]],
          0
        ]
      },
      line: {
        "line-color": [
          "coalesce",
          ["get", ["get", "id"], ["literal", lineColorById]],
          "#aaaaaa"
        ],
        "line-width": [
          "coalesce",
          ["get", ["get", "id"], ["literal", lineWidthById]],
          1
        ],
        "line-opacity": [
          "coalesce",
          ["get", ["get", "id"], ["literal", lineOpacityById]],
          0
        ]
      }
    };
  }, [
    activeBulletinCollection,
    problems,
    region,
    regionMouseover,
    validTimePeriod,
    focusRegions,
    microRegions,
    eawsRegions,
    eawsMicroRegions
  ]);

  const fillPaint = useMemo((): maplibregl.FillLayerSpecification["paint"] => {
    // Build the data-driven paint for the eaws-regions fill layer: each region is
    // coloured by its max danger rating, expressed as MapLibre expressions that look
    // up the feature `id` in per-region colour/opacity tables (see below).
    const dangerRatings = {
      ...(activeBulletinCollection?.maxDangerRatings ?? {}),
      ...(activeBulletinCollection?.eawsMaxDangerRatings ?? {})
    };
    const amPm = toAmPm[validTimePeriod] ?? "";
    const province = $province.get();
    const internRegex = province
      ? new RegExp(`^(${province})`)
      : new RegExp(config.regionsRegex);

    const ids = new Set(
      Object.keys(dangerRatings).map(key => key.replace(/:.*/, ""))
    );

    // Per-region lookup tables, consumed below via `["get", id, ["literal", …]]`.
    // Using object lookups keeps the expressions fixed-shape (no dynamic tuple),
    // so they type as ExpressionSpecification without a cast.
    const colorById: Record<string, string> = {};
    const opacityById: Record<string, number> = {};
    for (const id of ids) {
      const warnlevel = (dangerRatings[`${id}${amPm}`] ??
        Math.max(
          dangerRatings[`${id}:low${amPm}`] ?? 0,
          dangerRatings[`${id}:high${amPm}`] ?? 0
        )) as WarnLevelNumber;
      if (!warnlevel) continue;
      colorById[id] = WARNLEVEL_COLORS[warnlevel];
      opacityById[id] = internRegex.test(id)
        ? WARNLEVEL_OPACITY[warnlevel]
        : 0.5;
    }

    return {
      "fill-color": [
        "coalesce",
        ["get", ["get", "id"], ["literal", colorById]],
        WARNLEVEL_COLORS[0]
      ],
      "fill-opacity": [
        "coalesce",
        ["get", ["get", "id"], ["literal", opacityById]],
        WARNLEVEL_OPACITY[0]
      ]
    };
  }, [activeBulletinCollection, validTimePeriod]);

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
      container: overlayRef.current,
      style: OVERLAY_STYLE,
      minZoom: 5,
      maxZoom: 10,
      bounds: initialBounds
    });

    overlay.on("load", () => {
      overlay.addSource("eaws-regions", {
        type: "vector",
        url: `pmtiles://https://static.avalanche.report/eaws-regions.pmtiles`
      });
      overlay.addLayer({
        id: "eaws-regions-fill",
        type: "fill",
        source: "eaws-regions",
        "source-layer": "micro-regions",
        filter: featureFilter,
        paint: fillPaint
      });
      // State overlay (dimming / no-data / problem-filter colours) above the
      // danger fill; see eawsRegionsStatePaint.
      overlay.addLayer({
        id: "eaws-regions-state",
        type: "fill",
        source: "eaws-regions",
        "source-layer": "micro-regions",
        filter: featureFilter,
        paint: statePaint.state
      });
      overlay.addLayer({
        id: "eaws-regions",
        type: "line",
        source: "eaws-regions",
        "source-layer": "micro-regions",
        filter: featureFilter,
        paint: statePaint.line
      });

      // Region interaction, migrated from the former Leaflet PbfLayerOverlay
      // event handlers: select on click (empty space deselects), track hover.
      overlay.on("click", e => {
        const [feature] = overlay.queryRenderedFeatures(e.point, {
          layers: ["eaws-regions-fill"]
        });
        handleSelectRegionRef.current(feature?.properties?.id ?? "");
      });
      overlay.on("mousemove", "eaws-regions-fill", e => {
        overlay.getCanvas().style.cursor = "pointer";
        const id = e.features?.[0]?.properties?.id;
        if (id) requestAnimationFrame(() => setRegionMouseover(id));
      });
      overlay.on("mouseleave", "eaws-regions-fill", () => {
        overlay.getCanvas().style.cursor = "";
        requestAnimationFrame(() => setRegionMouseover(""));
      });
    });

    // Keep the base map glued to the overlay's view on every interaction.
    overlay.on("move", () => {
      base.jumpTo({
        center: overlay.getCenter(),
        zoom: overlay.getZoom(),
        bearing: overlay.getBearing(),
        pitch: overlay.getPitch()
      });
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
      base.remove();
      baseMapRef.current = null;
      overlay.remove();
      overlayMapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-style the region fills whenever the danger ratings or time period change.
  useEffect(() => {
    const map = overlayMapRef.current;
    if (!map?.getLayer("eaws-regions-fill")) return;
    for (const [property, value] of Object.entries(fillPaint ?? {})) {
      map.setPaintProperty("eaws-regions-fill", property, value);
    }
  }, [fillPaint]);

  // Re-style the state overlay + borders on selection / hover / filter changes.
  useEffect(() => {
    const map = overlayMapRef.current;
    if (!map?.getLayer("eaws-regions-state")) return;
    for (const [property, value] of Object.entries(statePaint.state ?? {})) {
      map.setPaintProperty("eaws-regions-state", property, value);
    }
    for (const [property, value] of Object.entries(statePaint.line ?? {})) {
      map.setPaintProperty("eaws-regions", property, value);
    }
  }, [statePaint]);

  // Re-apply the date-validity filter to all region layers when the date changes.
  useEffect(() => {
    const map = overlayMapRef.current;
    if (!map?.getLayer("eaws-regions-fill")) return;
    for (const id of [
      "eaws-regions-fill",
      "eaws-regions-state",
      "eaws-regions"
    ]) {
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
