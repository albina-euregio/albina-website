import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";

import "leaflet";
import "leaflet.sync";
import { DomEvent } from "leaflet";
import LeafletMap from "../leaflet/leaflet-map";
import BulletinMapDetails from "./bulletin-map-details";
import { preprocessContent } from "../../util/htmlParser";
import type {
  AvalancheProblemType,
  BulletinCollection,
  Status
} from "../../stores/bulletin";
import { scrollIntoView } from "../../util/scrollIntoView";
import { DangerRatings, PbfLayer, PbfLayerOverlay } from "../leaflet/pbf-map";
import { PbfRegionState } from "../leaflet/pbf-region-state";
import {
  isOneDangerRating as isOneDangerRating0,
  matchesValidTimePeriod,
  toAmPm,
  ValidTimePeriod
} from "../../stores/bulletin";
import { useMapEvent } from "react-leaflet";
import { useStore } from "@nanostores/react";
import { eawsRegion, eawsRegionsBounds } from "../../stores/eawsRegions";
import { getMacroRegion } from "../../stores/microRegions";
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
  const isOneDangerRating = useStore(isOneDangerRating0);
  const focusRegions = useStore($focusRegions);
  const language = intl.locale.slice(0, 2);
  const [regionMouseover, setRegionMouseover] = useState("");

  function RegionClickHandler(): null {
    useMapEvent("click", () => props.handleSelectRegion(""));
    return null;
  }

  const styleOverMap = () => {
    return {
      zIndex: 1000
    };
  };

  const regionState = useMemo(
    () => (
      <PbfRegionState
        activeBulletinCollection={props.activeBulletinCollection}
        problems={props.problems}
        region={props.region}
        regionMouseover={regionMouseover}
        validTimePeriod={props.validTimePeriod}
      />
    ),
    [
      props.activeBulletinCollection,
      props.problems,
      props.region,
      props.validTimePeriod,
      regionMouseover
    ]
  );

  const getMapOverlays = () => {
    const overlays = [<RegionClickHandler key="region-click-handler" />];
    overlays.push(
      <PbfLayer
        key={`eaws-regions-${props.validTimePeriod}-${props.date}-${props.status}`}
        date={props.date}
        isOneDangerRating={isOneDangerRating}
        handleSelectRegion={props.handleSelectRegion}
        validTimePeriod={props.validTimePeriod}
      >
        {props.activeBulletinCollection && (
          <DangerRatings
            maxDangerRatings={props.activeBulletinCollection.maxDangerRatings}
          />
        )}
        {props.activeBulletinCollection?.eawsMaxDangerRatings && (
          <DangerRatings
            maxDangerRatings={
              props.activeBulletinCollection.eawsMaxDangerRatings
            }
          />
        )}
      </PbfLayer>
    );
    overlays.push(
      <PbfLayerOverlay
        key={`eaws-regions-${props.validTimePeriod}-${props.date}-${props.status}-overlay`}
        date={props.date}
        validTimePeriod={props.validTimePeriod}
        eventHandlers={{
          click(e) {
            DomEvent.stop(e);
            props.handleSelectRegion(e.sourceTarget.properties.id);
          },
          pointerover(e) {
            requestAnimationFrame(() =>
              setRegionMouseover(e.sourceTarget.properties.id)
            );
          },
          pointerout(e) {
            requestAnimationFrame(() =>
              setRegionMouseover(id =>
                id === e.sourceTarget.properties.id ? "" : id
              )
            );
          }
        }}
      >
        {regionState}
      </PbfLayerOverlay>
    );
    return overlays;
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
          validTimePeriod={props.validTimePeriod}
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

// Build the data-driven paint for the eaws-regions fill layer: each region is
// coloured by its max danger rating, expressed as MapLibre expressions that look
// up the feature `id` in per-region colour/opacity tables (see below).
function eawsRegionsFillPaint(
  activeBulletinCollection: BulletinCollection | undefined,
  validTimePeriod: ValidTimePeriod
): maplibregl.FillLayerSpecification["paint"] {
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
    opacityById[id] = internRegex.test(id) ? WARNLEVEL_OPACITY[warnlevel] : 0.5;
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
}

function MapLibreMap({
  activeBulletinCollection,
  validTimePeriod
}: Pick<Props, "activeBulletinCollection" | "validTimePeriod">) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const focusRegions = useStore($focusRegions);

  const fillPaint = useMemo(
    () => eawsRegionsFillPaint(activeBulletinCollection, validTimePeriod),
    [activeBulletinCollection, validTimePeriod]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const bounds = eawsRegionsBounds(focusRegions).pad(0.1);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAPLIBRE_STYLE,
      minZoom: 5,
      maxZoom: 10,
      bounds: [
        [bounds.getWest(), bounds.getSouth()],
        [bounds.getEast(), bounds.getNorth()]
      ]
    });

    map.on("load", () => {
      // Register the pmtiles:// protocol once so MapLibre can read PMTiles archives.
      // https://maplibre.org/maplibre-gl-js/docs/examples/pmtiles-source-and-protocol/
      maplibregl.addProtocol("pmtiles", new Protocol().tile);

      map.addSource("eaws-regions", {
        type: "vector",
        url: `pmtiles://https://static.avalanche.report/eaws-regions.pmtiles`,
        attribution: "© <a href='https://www.avalanches.org/'>EAWS</a>"
      });
      map.addLayer({
        id: "eaws-regions-fill",
        type: "fill",
        source: "eaws-regions",
        "source-layer": "micro-regions",
        paint: fillPaint
      });
      map.addLayer({
        id: "eaws-regions",
        type: "line",
        source: "eaws-regions",
        "source-layer": "micro-regions",
        paint: {
          "line-color": "#19334d",
          "line-width": 1,
          "line-opacity": 0.5
        }
      });
    });

    mapRef.current = map;

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver?.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-style the region fills whenever the danger ratings or time period change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("eaws-regions-fill")) return;
    for (const [property, value] of Object.entries(fillPaint ?? {})) {
      map.setPaintProperty("eaws-regions-fill", property, value);
    }
  }, [fillPaint]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
