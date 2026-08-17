import React from "react";
import WarnLevelIcon from "../icons/warn-level-icon";
import type * as Caaml from "../../stores/bulletin";
import { getMaxMainValue } from "../../stores/bulletin";
import { useIntl, FormattedMessage } from "../../i18n";

interface Props {
  dangerRatings: Caaml.DangerRating[];
}

function BulletinDangerRating({ dangerRatings }: Props) {
  const intl = useIntl();

  if (!dangerRatings?.length) return null;

  if (dangerRatings.some(r => r.mainValue === "no_snow")) {
    const alt = intl.formatMessage({ id: "danger-level:no_snow" });
    return (
      <p
        className="bulletin-report-no-bulletin"
        style={{ marginBottom: 0, marginTop: 0, textAlign: "center" }}
      >
        <img
          src={`${window.config.projectRoot}images/pro/danger-levels/no_snow.svg`}
          alt={alt}
        />
        <FormattedMessage id="danger-level:no_snow" />
      </p>
    );
  }

  const dangerRatingBelow = getMaxMainValue(
    dangerRatings.filter(r => r?.elevation?.lowerBound === undefined)
  );
  const dangerRatingAbove = getMaxMainValue(
    dangerRatings.filter(r => r?.elevation?.upperBound === undefined)
  );
  const dangerRatingBounds = dangerRatings.flatMap(r => [
    r?.elevation?.lowerBound,
    r?.elevation?.upperBound
  ]);
  const elevation = dangerRatingBounds.find(b => b && b !== "treeline");
  const treeline = dangerRatingBounds.some(bound => bound === "treeline");

  return (
    <WarnLevelIcon
      below={dangerRatingBelow}
      above={dangerRatingAbove}
      elevation={elevation}
      treeline={treeline}
    />
  );
}

export default BulletinDangerRating;
