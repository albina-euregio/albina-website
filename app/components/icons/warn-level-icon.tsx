import React from "react";
import { useIntl } from "../../i18n";
import {
  getDangerRatingLabel,
  getWarnlevelNumber
} from "../../util/warn-levels";
import { Tooltip } from "../tooltips/tooltip.tsx";
import { DangerRatingValue } from "../../stores/bulletin";

interface Props {
  above: DangerRatingValue;
  below: DangerRatingValue;
  elevation?: string;
  treeline: boolean;
}

const WarnLevelIcon = (props: Props) => {
  const intl = useIntl();
  const getWarnlevelText = (warnLevel: DangerRatingValue) =>
    warnLevel
      ? getDangerRatingLabel(
          warnLevel,
          intl.formatMessage({ id: `caaml:dangerRating.${warnLevel}` })
        )
      : "";

  const below = props.elevation || props.treeline ? props.below : props.above;

  const numberAbove = getWarnlevelNumber(props.above);
  const numberBelow = getWarnlevelNumber(props.below);

  // "Our" danger-level picto: the elevation-split warning-picto
  // (levels_{below}_{above}), matching the PatternLab bulletin-map popup,
  // instead of the single generic EAWS diamond.
  const img = `/images/pro/warning-pictos/levels_${numberBelow}_${numberAbove}.png`;

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
      id: "caaml:elevation.treeline.capitalized"
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

  return (
    <Tooltip label={title}>
      <a href={"/education/danger-scale?"} tabIndex="-1" aria-label={title}>
        <img src={img} alt={title} />
        {props.above != props.below && <span>{elevationText}</span>}
      </a>
    </Tooltip>
  );
};

export default WarnLevelIcon;
