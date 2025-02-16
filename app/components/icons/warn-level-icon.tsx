import React from "react";
import { useIntl } from "../../i18n";
import { Link } from "react-router-dom";
import { getWarnlevelNumber, WARNLEVEL_COLORS } from "../../util/warn-levels";
import { Tooltip } from "../../components/tooltips/tooltip";
import {
  DangerRatingValue,
  isOneDangerRating as isOneDangerRating0
} from "../../stores/bulletin";
import { useStore } from "@nanostores/react";

interface Props {
  above: DangerRatingValue;
  below: DangerRatingValue;
  elevation: string;
  treeline: boolean;
}

const WarnLevelIcon = (props: Props) => {
  const intl = useIntl();
  const getWarnlevelText = (warnLevel: DangerRatingValue) => {
    if (warnLevel) {
      const number = getWarnlevelNumber(warnLevel);
      return (
        (number ? number + "–" : "") +
        intl.formatMessage({
          id: "danger-level:" + warnLevel
        })
      );
    }
    return "";
  };

  const below = props.elevation || props.treeline ? props.below : props.above;

  const numberBelow = getWarnlevelNumber(below);
  const numberAbove = getWarnlevelNumber(props.above);
  const colorBelow = WARNLEVEL_COLORS[numberBelow];
  const colorAbove = WARNLEVEL_COLORS[numberAbove];
  const colorBelowText = numberBelow >= 4 ? "#FFF" : "#222";
  const colorAboveText = numberAbove >= 4 ? "#FFF" : "#222";

  const isOneDangerRating = useStore(isOneDangerRating0);
  const imgRoot = window.config.projectRoot + "images/pro/warning-pictos/";
  const img = isOneDangerRating
    ? `${imgRoot}../danger-levels/level_${numberAbove}.svg`
    : `${imgRoot}levels_${numberBelow}_${numberAbove}.webp`;

  let title;
  let elevationText;
  if (below == props.above) {
    title = intl.formatMessage(
      { id: "bulletin:report:dangerlevel" },
      { level: getWarnlevelText(props.above) }
    );
    elevationText = "";
  } else if (props.treeline) {
    title = [
      intl.formatMessage(
        { id: "bulletin:report:dangerlevel-treeline-above" },
        { level: getWarnlevelText(props.above) }
      ),
      intl.formatMessage(
        { id: "bulletin:report:dangerlevel-treeline-below" },
        { level: getWarnlevelText(props.below) }
      )
    ].join("\n");
    elevationText = intl.formatMessage({
      id: "bulletin:treeline"
    });
  } else {
    title = [
      intl.formatMessage(
        { id: "bulletin:report:dangerlevel-above" },
        {
          elev: props.elevation,
          level: getWarnlevelText(props.above)
        }
      ),
      intl.formatMessage(
        { id: "bulletin:report:dangerlevel-below" },
        {
          elev: props.elevation,
          level: getWarnlevelText(props.below)
        }
      )
    ].join("\n");
    elevationText = props.elevation + "m";
  }

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 65 48"
      fontSize={12}
    >
      <defs>
        <path
          id="p0"
          d="M63.434 47.25A.5.5 0 0 1 63 48H1a.5.5 0 0 1-.432-.751l25-43a.5.5 0 0 1 .866.003l3.556 6.222L35.56.261a.5.5 0 0 1 .873-.01l27 47Z"
        />
        <path id="p1" d="M11.334 0h39.462l10.34 18H.87z" />
        <path
          id="p2"
          d="M.95 27 14.03 4.501l3.57 6.247a.5.5 0 0 0 .873-.009L24.046.523 39.256 27H.95Z"
        />
      </defs>
      {numberAbove === numberBelow ? (
        <g fill="none" fillRule="evenodd">
          <mask id="m0" fill="#fff">
            <use xlinkHref="#p0" />
          </mask>
          <use xlinkHref="#p0" fill="#FFF" />
          <g fill={colorBelow} mask="url(#m0)">
            <path d="M0-1h65v50H0z" />
          </g>
          <text textAnchor="middle" fill={colorBelowText} x={65 / 2} y="35">
            {numberBelow}
          </text>
          <path stroke="#222" d="M63 47.5 36 .5l-6 11-4-7-25 43h62Z" />
        </g>
      ) : (
        <g fill="none" fillRule="evenodd">
          <path
            fill="#222"
            d="M51.875 28h12.626v1H52.45l10.484 18.25a.5.5 0 0 1-.433.75H.5a.5.5 0 0 1-.433-.751l25-43a.5.5 0 0 1 .867.003l3.556 6.222L35.06.261a.5.5 0 0 1 .873-.01L51.875 28Z"
          />
          <g transform="translate(.5 29)">
            <mask id="m1" fill="#fff">
              <use xlinkHref="#p1" />
            </mask>
            <g fill={colorBelow} mask="url(#m1)">
              <path d="M-1-30h65v50H-1z" />
            </g>
            <text
              textAnchor="middle"
              fill={colorBelowText}
              x={65 / 2 - 0.5}
              y="14"
            >
              {numberBelow}
            </text>
          </g>
          <g transform="translate(11.5 1)">
            <mask id="m2" fill="#fff">
              <use xlinkHref="#p2" />
            </mask>
            <g fill={colorAbove} mask="url(#m2)">
              <path d="M-12-2h65v50h-65z" />
            </g>
            <text
              textAnchor="middle"
              fill={colorAboveText}
              x={65 / 2 - 11.5}
              y="23"
            >
              {numberAbove}
            </text>
          </g>
        </g>
      )}
    </svg>
  );

  return (
    <Tooltip label={title}>
      <Link to={"/education/danger-scale?"} tabIndex="-1" aria-label={title}>
        {isOneDangerRating || numberAbove === 5 || numberBelow === 5 ? (
          <img src={img} alt={title} />
        ) : (
          svg
        )}
        {props.above != props.below && <span>{elevationText}</span>}
      </Link>
    </Tooltip>
  );
};

export default WarnLevelIcon;
