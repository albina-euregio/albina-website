import React from "react";
import { useIntl } from "../../i18n";
import { getWarnlevelNumber } from "../../util/warn-levels";
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
  const getWarnlevelText = (warnLevel: DangerRatingValue) => {
    if (warnLevel) {
      const number = getWarnlevelNumber(warnLevel);
      return (
        (number ? number + "–" : "") +
        intl.formatMessage({
          id: `danger-level:${warnLevel}`
        })
      );
    }
    return "";
  };

  const below = props.elevation || props.treeline ? props.below : props.above;

  const numberAbove = getWarnlevelNumber(props.above);

  const img = `${window.config.projectRoot}images/pro/danger-levels/level_${numberAbove}.svg`;

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
